import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

// Approve activity
async function PostHandler(request:Request) {
  const session = await getServerSessionCM();

  await client.activity.updateMany({
    where: {
      teacher: {
        email: session.user.email
      }
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