import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";
import { todo } from "node:test";

// Get todo complete data of the send user
async function GetHandler(request:Request, {params}:{params:{id:string}}) {
  const session = await getServerSessionCM();
  const { id } = params;

  if(typeof parseInt(id) !== 'number') return NextResponse.json({
    success: false,
    message: "할 일 정보가 올바르지 않아요"
  }, { status: 400 });
  
  const todos = await client.todo.findMany({
    where: {
      mainTodoId: parseInt(id),
      sender: {
        email: session.user.email
      }
    },
    select: {
      status: true,
      receiver: {
        select: {
          id: true,
          class: true,
          number: true,
          name: true,
          grade: true,
          type: true,
          profile: true
        }
      },
      sender: {
        select: {
          email: true
        }
      }
    }
  });

  return NextResponse.json({
    success: true,
    todo: todos
  }, { status: 200 });
}

// Delete todo of the send user
async function DeleteHandler(request:Request, {params}:{params:{id:string}}) {
  const session = await getServerSessionCM();
  const { id } = params;

  if(typeof parseInt(id) !== 'number') return NextResponse.json({
    success: false,
    message: "할 일 올바르지 않아요"
  }, { status: 400 });
  
  const todos = await client.todo.findMany({
    where: {
      id: parseInt(id),
      sender: {
        email: session.user.email
      }
    },
    select: {
      sender: {
        select: {
          email: true
        }
      }
    }
  });
  if(todos.length <= 0) return NextResponse.json({
    success: false,
    message: "할 일을 찾을 수 없거나 내가 보낸 할 일이 아니에요"
  }, { status: 404 });

  await client.todo.delete({
    where: {
      id: parseInt(id)
    }
  });

  return NextResponse.json({
    success: true,
    todo: todos
  }, { status: 200 });
}

export const GET = withHandler({ method: "GET", fn: GetHandler });
export const DELETE = withHandler({ method: "DELETE", fn: DeleteHandler });