import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

// Get notification of me
async function GetHandler() {
  const session = await getServerSessionCM();
  
  const notification = await client.notification.findMany({
    where: {
      user: {
        email: session.user.email
      },
      read: false
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      read: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 20
  });

  return NextResponse.json({
    success: true,
    notification
  }, { status: 200 });
}

async function PutHandler() {
  const session = await getServerSessionCM();

  await client.notification.updateMany({
    where: {
      user: {
        email: session.user.email
      },
      read: false
    },
    data: {
      read: true
    }
  });

  return NextResponse.json({
    success: true
  }, { status: 200 });
}

export const GET = withHandler({ method: "GET", fn: GetHandler });
export const PUT = withHandler({ method: "PUT", fn: PutHandler });