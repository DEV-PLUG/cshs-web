import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { act } from "@node_modules/@types/react";

// Check Overlap Time
async function PostHandler(request:Request) {
  const session = await getServerSessionCM();
  const req = await request.json();

  if(!req.content || req.content.length <= 0 || req.content.length > 20 || typeof(req.content) !== "string") return NextResponse.json({
    success: false,
    message: "활동 내용이 올바르지 않아요"
  }, { status: 400 });
  if(!req.to || !Array.isArray(req.to) || !req.to.every((item:number) => typeof item === 'number')) return NextResponse.json({
    success: false,
    message: "추가 구성원이 올바르지 않아요"
  }, { status: 400 });
  if(!req.teacher || !Array.isArray(req.teacher) || !req.teacher.every((item:number) => typeof item === 'number')) return NextResponse.json({
    success: false,
    message: "담당 교사가 올바르지 않아요"
  }, { status: 400 });
  if(!req.place || typeof req.place !== 'number') return NextResponse.json({
    success: false,
    message: "장소 올바르지 않아요"
  }, { status: 400 });
  if(!req.place || typeof req.place !== 'number') return NextResponse.json({
    success: false,
    message: "장소 올바르지 않아요"
  }, { status: 400 });
  if(!req.time || !Array.isArray(req.time) || !req.time.every((item:number) => typeof item === 'number')) return NextResponse.json({
    success: false,
    message: "시간이 올바르지 않아요"
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

  let overlappingActivities:any = [];
  let i = 0
  for (const userId of req.to) {
    const user = await client.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        name: true
      }
    });
    overlappingActivities.push({
      id: userId,
      name: user?.name,
      activity: []
    });
    for (const time of req.time) {
      const activity = await client.activity.findFirst({
        where: {
          relation: {
            some: {
              userId: userId
            }
          },
          perio: {
            contains: time + ''
          },
        },
        select: {
          id: true,
          content: true
        }
      });
      overlappingActivities[i].activity.push(activity);
    }
    i++;
  }

  return NextResponse.json({
    success: true,
    overlappingActivities
  }, { status: 200 });
}

export const POST = withHandler({ method: "POST", fn: PostHandler });