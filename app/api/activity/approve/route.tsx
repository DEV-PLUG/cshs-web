import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

// Approve activity
async function PostHandler(request:Request) {
  const session = await getServerSessionCM();
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
      status: true
    }
  });
  if(!activity) {
    return NextResponse.json({
      success: false,
      message: 'Activity not found'
    }, { status: 404 });
  }
  if(activity.teacher.email !== session.user.email) {
    return NextResponse.json({
      success: false,
      message: 'You are not the teacher of this activity'
    }, { status: 400 });
  }

  await client.activity.update({
    where: {
      id: req.id
    },
    data: {
      status: 1
    }
  });

  return NextResponse.json({
    success: true
  }, { status: 200 });
}

export const POST = withHandler({ method: "POST", fn: PostHandler });