import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

// Quit activity
async function DeleteHandler(request:Request) {
  const session = await getServerSessionCM();
  const req = await request.json();

  const activity = await client.activity.findUnique({
    where: {
      id: req.id
    },
    select: {
      id: true,
      relation: {
        select: {
          user: {
            select: {
              email: true
            }
          }
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
  if(!activity.relation.some((relation:any) => relation.user.email === session.user.email)) {
    return NextResponse.json({
      success: false,
      message: 'You are not the relations of this activity'
    }, { status: 400 });
  }

  await client.activityRelation.deleteMany({
    where: {
      activityId: req.id,
      user: {
        email: session.user.email
      }
    }
  });

  return NextResponse.json({
    success: true
  }, { status: 200 });
}

export const DELETE = withHandler({ method: "DELETE", fn: DeleteHandler });