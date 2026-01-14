import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

async function isAdmin(session: any) {
  if (!session?.user?.email) return false;
  const user = await client.user.findUnique({ where: { email: session.user.email } });
  return (Number(user?.admin) & 2) === 2;
}

// Approve activity
async function PostHandler(request:Request) {
  const session = await getServerSessionCM();

  if (!(await isAdmin(session))) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 });
  }

  const req = await request.json();

  const activity = await client.activity.findUnique({
    where: {
      id: req.id
    },
    select: {
      id: true,
      teacher: {
        select: {
          email: true
        }
      },
      status: true,
      writer: {
        select: {
          id: true,
          notificationToken: true,
          name: true
        }
      },
      relation: {
        select: {
          user: {
            select: {
              notificationToken: true,
              id: true
            }
          }
        }
      },
      content: true
    }
  });
  if(!activity) {
    return NextResponse.json({
      success: false,
      message: 'Activity not found'
    }, { status: 404 });
  }
  
  await client.activity.update({
    where: {
      id: req.id
    },
    data: {
      status: 1
    }
  });

  if(activity.writer.notificationToken) {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: activity.writer.notificationToken,
        title: `신청한 활동 요청이 승인되었어요`,
        body: `'${activity.content}' - ${activity.writer.name}${activity.relation.length > 0 ? ' 외 ' + activity.relation.length + '명' : ''}`
      })
    });
  }
  await client.notification.create({
    data: {
      title: `신청한 활동 요청이 승인되었어요`,
      content: `'${activity.content}' - ${activity.writer.name}${activity.relation.length > 0 ? ' 외 ' + activity.relation.length + '명' : ''}`,
      userId: activity.writer.id
    }
  });

  let notificationTokens:string[] = [];
  let notificationCreations:{title:string,content:string,userId:number}[] = [];
  activity.relation.forEach(async (relation) => {
    if(relation.user.notificationToken) {
      notificationTokens.push(relation.user.notificationToken);
    }
    notificationCreations.push({
      title: `신청한 활동 요청이 승인되었어요`,
      content: `'${activity.content}' - ${activity.writer.name}${activity.relation.length > 0 ? ' 외 ' + activity.relation.length + '명' : ''}`,
      userId: relation.user.id
    });
  });
  if(notificationTokens.length > 0) {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: notificationTokens,
        title: `신청한 활동 요청이 승인되었어요`,
        body: `'${activity.content}' - ${activity.writer.name}${activity.relation.length > 0 ? ' 외 ' + activity.relation.length + '명' : ''}`
      })
    });
  }
  await client.notification.createMany({
    data: notificationCreations
  });

  return NextResponse.json({
    success: true
  }, { status: 200 });
}

export const POST = withHandler({ method: "POST", fn: PostHandler });