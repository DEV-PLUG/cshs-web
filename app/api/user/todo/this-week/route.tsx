import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

// Get all todos of the user in this week
async function GetHandler() {
  const session = await getServerSessionCM();

  const user = await client.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
    },
  });
  if(!user) {
    return NextResponse.json({
      success: false,
      message: "사용자 정보를 찾을 수 없어요",
    }, { status: 404 });
  }

  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
  const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 7));

  const todos = await client.todo.findMany({
    where: {
      receiverId: user.id,
      deadline: {
        gte: startOfWeek,
        lte: endOfWeek,
      },
      status: 0
    },
    orderBy: {
      deadline: 'asc'
    },
    select: {
      title: true,
      sender: {
        select: {
          profile: true,
          name: true
        }
      },
      deadline: true,
      createdAt: true,
      id: true
    }
  });

  return NextResponse.json({
    success: true,
    todos,
  }, { status: 200 });
}

export const GET = withHandler({ method: "GET", fn: GetHandler });