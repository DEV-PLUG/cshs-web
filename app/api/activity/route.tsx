import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

// Add Activity
async function PostHandler(request:Request) {
  const session = await getServerSessionCM();
  const req = await request.json();

  if(!req.content || req.content.length <= 0 || req.content.length > 20 || typeof(req.content) !== "string") return NextResponse.json({
    success: false,
    message: "활동 내용이 올바르지 않아요"
  }, { status: 400 });
  if(!req.to || !Array.isArray(req.to) || !req.to.every((item:number) => typeof item === 'number')) return NextResponse.json({
    success: false,
    message: "추가 구성원이 올바르지 않아요"
  }, { status: 400 });
  if(!req.teacher || !Array.isArray(req.teacher) || !req.teacher.every((item:number) => typeof item === 'number')) return NextResponse.json({
    success: false,
    message: "담당 교사가 올바르지 않아요"
  }, { status: 400 });
  if(!req.place || typeof req.place !== 'number') return NextResponse.json({
    success: false,
    message: "장소 올바르지 않아요"
  }, { status: 400 });
  if(!req.place || typeof req.place !== 'number') return NextResponse.json({
    success: false,
    message: "장소 올바르지 않아요"
  }, { status: 400 });
  if(!req.time || !Array.isArray(req.time) || !req.time.every((item:number) => typeof item === 'number')) return NextResponse.json({
    success: false,
    message: "시간이 올바르지 않아요"
  }, { status: 400 });

  const sender = await client.user.findUnique({
    where: {
      email: session.user.email
    },
    select: {
      id: true,
      name: true
    }
  });
  if(!sender) return NextResponse.json({
    success: false,
    message: "사용자 정보를 찾을 수 없어요"
  }, { status: 404 });

  let overlappingActivities:any = [];
  let i = 0
  for (const userId of [sender.id, ...req.to]) {
    const user = await client.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        name: true
      }
    });
    overlappingActivities.push({
      id: userId,
      name: user?.name,
      activity: []
    });
    for (const time of req.time.sort((a:number, b:number) => a - b)) {
      const activity = await client.activity.findFirst({
        where: {
          relation: {
            some: {
              userId: userId
            }
          },
          perio: {
            contains: time + ''
          },
        },
        select: {
          id: true,
          content: true,
          perio: true,
        }
      });
      if(activity) overlappingActivities[i].activity.push(activity);
    }
    i++;
  }

  const activity = await client.activity.create({
    data: {
      content: req.content,
      writer: {
        connect: {
          email: session.user.email
        }
      },
      place: {
        connect: {
          id: req.place
        }
      },
      perio: req.time.join(','),
      date: new Date().toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" }).replaceAll('.', '').replaceAll(' ', ''),
      teacher: {
        connect: {
          id: req.teacher[0]
        }
      },
      status: 0
    }
  });

  const activityData = req.to.map((receiverId:number) => ({
    activityId: activity.id,
    userId: receiverId
  }));
  await client.activityRelation.createMany({
    data: activityData
  });

  const teacher = await client.user.findUnique({
    where: {
      id: req.teacher[0]
    },
    select: {
      notificationToken: true
    }
  });
  if(teacher && teacher.notificationToken) {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: teacher.notificationToken,
        title: `새로운 활동 승인 요청이 있습니다`,
        body: `'${req.content}' - ${sender.name}${activityData.length > 0 ? ' 외 ' + activityData.length + '명' : ''}`
      })
    });
  }
  await client.notification.create({
    data: {
      title: `새로운 활동 승인 요청이 있습니다`,
      content: `'${req.content}' - ${sender.name}${activityData.length > 0 ? ' 외 ' + activityData.length + '명' : ''}`,
      userId: req.teacher[0]
    }
  });

  return NextResponse.json({
    success: true,
    overlappingActivities,
  }, { status: 200 });
}

// Delete activity
async function DeleteHandler(request:Request) {
  const session = await getServerSessionCM();
  const req = await request.json();

  const activity = await client.activity.findUnique({
    where: {
      id: req.id
    },
    select: {
      id: true,
      writer: {
        select: {
          email: true
        }
      },
      status: true
    }
  });
  if(!activity) {
    return NextResponse.json({
      success: false,
      message: 'Todo not found'
    }, { status: 404 });
  }
  if(activity.writer?.email !== session.user.email) {
    return NextResponse.json({
      success: false,
      message: 'You are not the writer of this activity'
    }, { status: 400 });
  }

  await client.activityRelation.deleteMany({
    where: {
      activityId: req.id
    }
  });
  await client.activity.delete({
    where: {
      id: req.id
    }
  });

  return NextResponse.json({
    success: true
  }, { status: 200 });
}

export const POST = withHandler({ method: "POST", fn: PostHandler });
export const DELETE = withHandler({ method: "DELETE", fn: DeleteHandler });