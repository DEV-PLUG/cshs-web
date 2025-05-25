import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

// Place 테이블에서 id 100인 '기타' 장소를 삭제하지 말 것.
// 이를 삭제할 경우 이 기능이 제대로 동작하지 않음.

// Add Activity of Teacher
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
  if(!req.time || !Array.isArray(req.time) || !req.time.every((item:number) => typeof item === 'number')) return NextResponse.json({
    success: false,
    message: "시간이 올바르지 않아요"
  }, { status: 400 });

  const sender = await client.user.findUnique({
    where: {
      email: session.user.email,
      type: 1 // 교사만 가능
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

  // Place 테이블에서 id 100인 '기타' 장소를 삭제하지 말 것.
  // 이를 삭제할 경우 이 기능이 제대로 동작하지 않음.
  const activity = await client.activity.create({
    data: {
      content: req.content,
      writer: {
        connect: {
          id: req.to[0]
        }
      },
      place: {
        connect: {
          id: 100
        }
      },
      perio: req.time.join(','),
      date: new Date().toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" }).replaceAll('.', '').replaceAll(' ', ''),
      teacher: {
        connect: {
          email: session.user.email
        }
      },
      status: 2 // 교사 기록
    }
  });

  return NextResponse.json({
    success: true
  }, { status: 200 });
}

export const POST = withHandler({ method: "POST", fn: PostHandler });