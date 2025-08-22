import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

// Add a new todo to the other user
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
  if(!req.to || !Array.isArray(req.to) || !req.to.every((item:number) => typeof item === 'number')) return NextResponse.json({
    success: false,
    message: "전송 대상이 올바르지 않아요"
  }, { status: 400 });
  if(req.toMe === undefined || typeof req.toMe !== 'boolean') return NextResponse.json({
    success: false,
    message: "나에게 추가 옵션이 올바르지 않아요"
  }, { status: 400 });

  const sender = await client.user.findUnique({
    where: {
      email: session.user.email
    },
    select: {
      id: true
    }
  });
  if(!sender) return NextResponse.json({
    success: false,
    message: "사용자 정보를 찾을 수 없어요"
  }, { status: 404 });

  if(req.toMe === true) await client.todo.create({
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

  const mainTodo = await client.todo.create({
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
      type: 0
    }
  });

  const todoData = req.to.map((receiverId:number) => ({
    title: req.title,
    description: req.description,
    status: 0,
    deadline: req.deadline,
    senderId: sender.id,
    receiverId: receiverId,
    type: 0,
    mainTodoId: mainTodo.id
  }));
  await client.todo.createMany({
    data: todoData
  });

  // 받는 사람들에게 notification 추가
  await Promise.all(req.to.map((receiverId:number) =>
    client.notification.create({
      data: {
        title: "할 일이 도착했습니다",
        content: `'${req.title}' 할 일이 도착했습니다.`,
        userId: receiverId
      }
    })
  ));

  return NextResponse.json({
    success: true
  }, { status: 200 });
}

// Get all todos of the user
async function GetHandler(request:Request) {
  const session = await getServerSessionCM();
  const searchParams = new URL(request.url).searchParams;
  const search = searchParams.get('search');
  const sort = searchParams.get('sort');
  const order = searchParams.get('order');
  
  if (sort && sort !== 'createdAt' && sort !== 'deadline' && sort !== 'updatedAt') {
    return NextResponse.json({
      success: false,
      message: 'Invalid sort value'
    }, { status: 400 });
  }
  if (order && order !== 'asc' && order !== 'desc') {
    return NextResponse.json({
      success: false,
      message: 'Invalid sort order'
    }, { status: 400 });
  }

  const beforeTodo:any = await client.$queryRaw`
    SELECT 
      t.id, 
      t.title, 
      t.description, 
      t."createdAt", 
      t.deadline, 
      t.type,
      s.name as senderName, 
      s.profile as senderProfile, 
      r.name as receiverName, 
      r.profile as receiverProfile, 
      t.status,
      (SELECT COUNT(*) FROM "Todo" AS rt WHERE rt."mainTodoId" = t.id) AS relationTodoCount,
      (SELECT COUNT(*) FROM "Todo" AS rt WHERE rt."mainTodoId" = t.id AND rt.status = 1) AS relationTodoStatusCount
    FROM "Todo" AS t
    LEFT JOIN "User" AS s ON t."senderId" = s.id
    LEFT JOIN "User" AS r ON t."receiverId" = r.id
    WHERE 
      t."senderId" = (SELECT id FROM "User" WHERE email = ${session.user.email}) AND
      t."receiverId" IS NULL AND
      t.status = 0 AND
      (${search ? Prisma.sql`(t.title LIKE ${'%' + search + '%'} OR t.description LIKE ${'%' + search + '%'})` : Prisma.sql`1=1`})
    ${sort && order ? Prisma.sql`ORDER BY t.${Prisma.raw(sort)} ${Prisma.raw(order)}` : Prisma.sql``}
    LIMIT 100;
  `;

  const finishedTodo:any = await client.$queryRaw`
    SELECT 
      t.id, 
      t.title, 
      t.description, 
      t."createdAt", 
      t.deadline, 
      t.type,
      s.name as senderName, 
      s.profile as senderProfile, 
      r.name as receiverName, 
      r.profile as receiverProfile, 
      t.status,
      (SELECT COUNT(*) FROM "Todo" AS rt WHERE rt."mainTodoId" = t.id) AS relationTodoCount,
      (SELECT COUNT(*) FROM "Todo" AS rt WHERE rt."mainTodoId" = t.id AND rt.status = 1) AS relationTodoStatusCount
    FROM "Todo" AS t
    LEFT JOIN "User" AS s ON t."senderId" = s.id
    LEFT JOIN "User" AS r ON t."receiverId" = r.id
    WHERE 
      t."senderId" = (SELECT id FROM "User" WHERE email = ${session.user.email}) AND
      t."receiverId" IS NULL AND
      t.status = 1 AND
      (${search ? Prisma.sql`(t.title LIKE ${'%' + search + '%'} OR t.description LIKE ${'%' + search + '%'})` : Prisma.sql`1=1`})
    ${sort && order ? Prisma.sql`ORDER BY t.${Prisma.raw(sort)} ${Prisma.raw(order)}` : Prisma.sql``}
    LIMIT 100;
  `;

  return NextResponse.json({
    success: true,
    todo: {
      before: beforeTodo.map((todo:any) => ({
        id: todo.id.toString(),
        relationTodoCount: todo.relationtodocount.toString(),
        relationTodoStatusCount: todo.relationtodostatuscount.toString(),
        title: todo.title,
        description: todo.description,
        createdAt: todo.createdAt,
        deadline: todo.deadline,
        type: todo.type,
        senderName: todo.sendername,
        senderProfile: todo.senderprofile,
        receiverName: todo.receivername,
        receiverProfile: todo.receiverprofile,
        status: todo.status
      })),
      finished: finishedTodo.map((todo:any) => ({
        id: todo.id.toString(),
        relationTodoCount: todo.relationtodocount.toString(),
        relationTodoStatusCount: todo.relationtodostatuscount.toString(),
        title: todo.title,
        description: todo.description,
        createdAt: todo.createdAt,
        deadline: todo.deadline,
        type: todo.type,
        senderName: todo.sendername,
        senderProfile: todo.senderprofile,
        receiverName: todo.receivername,
        receiverProfile: todo.receiverprofile,
        status: todo.status
      }))
    }
  }, { status: 200 });
}

export const GET = withHandler({ method: "GET", fn: GetHandler });
export const POST = withHandler({ method: "POST", fn: PostHandler });