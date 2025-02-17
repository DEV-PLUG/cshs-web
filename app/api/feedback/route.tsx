import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

// Post feedback
async function PostHandler(request:Request) {
  const session = await getServerSessionCM();
  const req = await request.json();
  
  const user = await client.user.findMany({
    where: {
      email: session.user.email
    },
    select: {
      id: true
    }
  });
  if(user.length <= 0) {
    return NextResponse.json({
      success: false,
      message: '사용자 정보를 찾을 수 없어요'
    }, { status: 404 });
  }

  await client.feedback.create({
    data: {
      content: req.content,
    }
  });

  return NextResponse.json({
    success: true
  }, { status: 200 });
}

export const POST = withHandler({ method: "POST", fn: PostHandler });