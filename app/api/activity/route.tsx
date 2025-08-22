import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";
import formatedDate from "@libs/client/formated-date";

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
  if(req.to.length > 50) return NextResponse.json({
    success: false,
    message: "추가 구성원은 50명 이하로만 선택할 수 있어요"
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

  const userIds = [sender.id, ...req.to];
  const times = req.time.map((t: number) => t + '');

  // -----------------------------------------------------
  // 여기서는 queryRaw'Unsafe'를 사용합니다.
  // 여기서 SQL 인젝션이 발생할 수 있으므로, 주의할 것.
  // 'userIds와 times는 숫자 배열이므로 SQL 인젝션 위험이 없습니다.' - Copilot
  // -----------------------------------------------------
  
  const today = formatedDate(new Date().toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" }));
  const likeConditions = times.map((t: string) => `a.perio LIKE '%${t}%'`).join(' OR ');
  const overlappingRows: any[] = await client.$queryRawUnsafe(`
    SELECT 
      ar."userId" as "userId",
      a.id as "activityId",
      a.content as "content",
      a.perio as "perio"
    FROM "Activity" a
    LEFT JOIN "ActivityRelation" ar ON a.id = ar."activityId"
    WHERE ar."userId" IN (${userIds.join(',')})
      AND (${likeConditions})
      AND a.date = '${today}'
  `);

  // 유저 정보 미리 조회
  const users = await client.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true }
  });
  const userMap = Object.fromEntries(users.map(u => [u.id, u.name]));

  // 유저별, 타임별로 분류
  let overlappingActivities: any = userIds.map((userId: number) => ({
    id: userId,
    name: userMap[userId],
    activity: []
  }));

  for (const row of overlappingRows) {
    const activityTimes = row.perio.split(',').map((t: string) => t.trim());
    for (const t of times) {
      if (activityTimes.includes(t)) {
        const userObj = overlappingActivities.find((u: any) => u.id === row.userId);
        if (userObj) {
          // 이미 같은 활동이 추가되어 있는지 확인
          if (!userObj.activity.some((a: any) => a.id === row.activityId)) {
            userObj.activity.push({
              id: row.activityId,
              content: row.content,
              perio: row.perio
            });
          }
        }
      }
    }
  }

  // 교사 정보 조회
  const teacherUser = await client.user.findUnique({
    where: { id: req.teacher[0] },
    select: { name: true, notificationToken: true }
  });

  // 자동 승인 여부 결정
  const autoApprove = teacherUser?.name === "김정민";

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
      date: formatedDate(new Date().toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" })),
      teacher: {
        connect: {
          id: req.teacher[0]
        }
      },
      status: autoApprove ? 1 : 0
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
      status: true,
      teacher: {
        select: {
          id: true,
          email: true
        }
      }
    }
  });
  if(!activity) {
    return NextResponse.json({
      success: false,
      message: 'Todo not found'
    }, { status: 404 });
  }
  if(activity.writer?.email !== session.user.email && activity.status !== 2) {
    return NextResponse.json({
      success: false,
      message: 'You are not the writer of this activity'
    }, { status: 400 });
  }
  if(activity.status === 2 && activity.teacher?.email !== session.user.email) {
    return NextResponse.json({
      success: false,
      message: '교사가 작성한 활동은 삭제할 수 없어요'
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