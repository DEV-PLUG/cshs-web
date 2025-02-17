import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

// Add a new todo to the user(self)
async function PostHandler(request:Request) {
  const session = await getServerSessionCM();
  const req = await request.json();

  if(!req.title || req.title.length <= 0 || req.title.length > 20 || typeof(req.title) !== "string") return NextResponse.json({
    success: false,
    message: "이름이 올바르지 않아요"
  }, { status: 400 });
  if(!req.description || req.description.length <= 0 || req.description.length > 300 || typeof(req.description) !== "string") return NextResponse.json({
    success: false,
    message: "설명이 올바르지 않아요"
  }, { status: 400 });
  if(!req.deadline || req.deadline.length <= 0 || req.deadline.length > 100 || typeof(req.deadline) !== "string") return NextResponse.json({
    success: false,
    message: "마감일이 올바르지 않아요"
  }, { status: 400 });

  await client.todo.create({
    data: {
      title: req.title,
      description: req.description,
      status: 0,
      deadline: req.deadline,
      sender: {
        connect: {
          email: session.user.email
        }
      },
      receiver: {
        connect: {
          email: session.user.email
        }
      },
      type: 0
    }
  });

  return NextResponse.json({
    success: true
  }, { status: 200 });
}

export const POST = withHandler({ method: "POST", fn: PostHandler });