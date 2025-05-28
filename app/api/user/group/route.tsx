import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

// Get all groups of the user's
async function GetHandler() {
  const session = await getServerSessionCM();
  
  const groups = await client.group.findMany({
    where: {
      user: {
        email: session.user.email
      }
    },
    select: {
      id: true,
      name: true,
      relation: {
        select: {
          user: {
            select: {
              id: true,
              email: true,
              profile: true,
              name: true,
              grade: true,
              class: true,
              number: true,
              type: true
            }
          }
        }
      }
    }
  });

  return NextResponse.json({
    success: true,
    groups
  }, { status: 200 });
}

// Create custom group
async function PostHandler(request:Request) {
  const session = await getServerSessionCM();
  const req = await request.json();

  if(!req.name || req.name.length <= 0 || req.name.length > 20 || typeof(req.name) !== "string") return NextResponse.json({
    success: false,
    message: "활동 내용이 올바르지 않아요"
  }, { status: 400 });
  if(!req.to || !Array.isArray(req.to) || !req.to.every((item:number) => typeof item === 'number')) return NextResponse.json({
    success: false,
    message: "구성원이 올바르지 않아요"
  }, { status: 400 });

  const sender = await client.user.findUnique({
    where: {
      email: session.user.email
    },
    select: {
      id: true,
      name: true
    }
  });
  if(!sender) return NextResponse.json({
    success: false,
    message: "사용자 정보를 찾을 수 없어요"
  }, { status: 404 });

  const group = await client.group.create({
    data: {
      name: req.name,
      user: {
        connect: {
          email: session.user.email
        }
      },
      school: {
        connect: {
          id: 1
        }
      }
    }
  });

  const groupData = req.to.map((receiverId:number) => ({
    groupId: group.id,
    userId: receiverId
  }));
  await client.groupRelation.createMany({
    data: groupData
  });

  return NextResponse.json({
    success: true
  }, { status: 200 });
}

// Update custom group
async function PutHandler(request:Request) {
  const session = await getServerSessionCM();
  const req = await request.json();

  if(!req.name || req.name.length <= 0 || req.name.length > 20 || typeof(req.name) !== "string") return NextResponse.json({
    success: false,
    message: "활동 내용이 올바르지 않아요"
  }, { status: 400 });
  if(!req.to || !Array.isArray(req.to) || !req.to.every((item:number) => typeof item === 'number')) return NextResponse.json({
    success: false,
    message: "구성원이 올바르지 않아요"
  }, { status: 400 });
  if(!req.id || typeof(req.id) !== "number") return NextResponse.json({
    success: false,
    message: "그룹 ID가 올바르지 않아요"
  }, { status: 400 });

  const group = await client.group.findUnique({
    where: {
      user: {
        email: session.user.email
      },
      id: req.id
    }
  });
  if(!group) return NextResponse.json({
    success: false,
    message: "그룹 정보를 찾을 수 없어요"
  }, { status: 404 });

  // 기존 그룹 정보 업데이트
  await client.group.update({
    where: {
      id: req.id,
      user: {
        email: session.user.email
      }
    },
    data: {
      name: req.name
    }
  });

  // 기존 relation 목록 조회
  const prevRelations = await client.groupRelation.findMany({
    where: { groupId: req.id },
    select: { userId: true }
  });
  const prevUserIds = prevRelations.map(r => r.userId);

  // 추가해야 할 userId, 삭제해야 할 userId 계산
  const toAdd = req.to.filter((id:number) => !prevUserIds.includes(id));
  const toRemove = prevUserIds.filter((id:number) => !req.to.includes(id));

  // relation 추가
  if (toAdd.length > 0) {
    await client.groupRelation.createMany({
      data: toAdd.map((userId:number) => ({
        groupId: req.id,
        userId
      }))
    });
  }

  // relation 삭제
  if (toRemove.length > 0) {
    await client.groupRelation.deleteMany({
      where: {
        groupId: req.id,
        userId: { in: toRemove }
      }
    });
  }

  return NextResponse.json({
    success: true
  }, { status: 200 });
}

// Delete custom group
async function DeleteHandler(request:Request) {
  const session = await getServerSessionCM();
  const req = await request.json();

  if(!req.id || typeof(req.id) !== "number") return NextResponse.json({
    success: false,
    message: "그룹 ID가 올바르지 않아요"
  }, { status: 400 });

  const group = await client.group.findUnique({
    where: {
      user: {
        email: session.user.email
      },
      id: req.id
    }
  });
  if(!group) return NextResponse.json({
    success: false,
    message: "그룹 정보를 찾을 수 없어요"
  }, { status: 404 });

  await client.group.delete({
    where: {
      id: req.id,
      user: {
        email: session.user.email
      }
    }
  });

  return NextResponse.json({
    success: true
  }, { status: 200 });
}

export const GET = withHandler({ method: "GET", fn: GetHandler });
export const POST = withHandler({ method: "POST", fn: PostHandler });
export const PUT = withHandler({ method: "PUT", fn: PutHandler });
export const DELETE = withHandler({ method: "DELETE", fn: DeleteHandler });