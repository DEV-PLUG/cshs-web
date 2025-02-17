import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

// Approve activity
async function PostHandler(request:Request) {
  const session = await getServerSessionCM();

  const activity = await client.activity.findMany({
    where: {
      teacher: {
        email: session.user.email
      },
      status: 0
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

  await client.activity.updateMany({
    where: {
      teacher: {
        email: session.user.email
      },
      status: 0
    },
    data: {
      status: 1
    }
  });

  activity.forEach(async (act:any) => {
    if(act.writer.notificationToken) {
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: act.writer.notificationToken,
          title: `신청한 활동 요청이 승인되었어요`,
          body: `'${act.content}' - ${act.writer.name}${act.relation.length > 0 ? ' 외 ' + act.relation.length + '명' : ''}`
        })
      });
    }
    await client.notification.create({
      data: {
        title: `신청한 활동 요청이 승인되었어요`,
        content: `'${act.content}' - ${act.writer.name}${act.relation.length > 0 ? ' 외 ' + act.relation.length + '명' : ''}`,
        userId: act.writer.id
      }
    });
    
    let notificationTokens:string[] = [];
    let notificationCreations:{title:string,content:string,userId:number}[] = [];
    act.relation.forEach(async (relation:{user:{notificationToken:string,id:number}}) => {
      if(relation.user.notificationToken) {
        notificationTokens.push(relation.user.notificationToken);
      }
      notificationCreations.push({
        title: `신청한 활동 요청이 승인되었어요`,
        content: `'${act.content}' - ${act.writer.name}${act.relation.length > 0 ? ' 외 ' + act.relation.length + '명' : ''}`,
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
          body: `'${act.content}' - ${act.writer.name}${act.relation.length > 0 ? ' 외 ' + act.relation.length + '명' : ''}`
        })
      });
    }
    await client.notification.createMany({
      data: notificationCreations
    });
  });

  return NextResponse.json({
    success: true
  }, { status: 200 });
}

export const POST = withHandler({ method: "POST", fn: PostHandler });