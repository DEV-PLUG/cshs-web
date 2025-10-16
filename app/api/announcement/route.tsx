import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

async function GetHandler() {
  const session = await getServerSessionCM();
  
  const announcements = await client.announcement.findMany({
    orderBy: [
      {
        id: 'desc',
      }
    ],
    select: {
      id: true,
      user: {
        select: {
          name: true
        }
      },
      writerId: true,
      createdAt: true,
      updatedAt: true,
      title: true,
      content: true,
    }
  });

  return NextResponse.json({
    success: true,
    data: announcements
  }, { status: 200 });
}

async function PostHandler(request:Request) {
  const session = await getServerSessionCM();
  const req = await request.json();
  const sender = await client.user.findUnique({
    where: {
      email: session.user.email
    },
    select: {
      id: true,
      name: true
    }
  });
  if (!sender) return NextResponse.json({
    success: false,
    message: "사용자 정보를 찾을 수 없어요."
  }, { status: 404 });
  
  await client.announcement.create({
    data: {
      user: {
        connect: {
          email: session.user.email
        }
      },
      title: req.title,
      content: req.content,
      grade: req.grade
    }
  })

  return NextResponse.json({
    success: true
  }, { status: 200 });
}

export const GET = withHandler({ method: "GET", fn: GetHandler });
export const POST = withHandler({ method: "POST", fn: PostHandler });