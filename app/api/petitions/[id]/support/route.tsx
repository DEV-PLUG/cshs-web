import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

// 청원 동의 여부 확인
async function GetHandler(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSessionCM();
  const petitionId = Number(params.id);

  const user = await client.user.findFirst({
    where: { email: session.user.email },
    select: { id: true }
  });

  if (!user?.id) {
    return NextResponse.json({ success: false, message: "사용자 정보를 찾을 수 없습니다." }, { status: 404 });
  }

  const support = await client.petitionSupport.findFirst({
    where: {
      petitionId,
      userId: user.id
    }
  });

  return NextResponse.json({
    success: true,
    supported: !!support
  });
}

// 청원 동의/취소
async function PostHandler(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSessionCM();
  const petitionId = Number(params.id);

  const user = await client.user.findFirst({
    where: { email: session.user.email },
    select: { id: true }
  });

  if (!user?.id) {
    return NextResponse.json({ success: false, message: "사용자 정보를 찾을 수 없습니다." }, { status: 404 });
  }

  // 청원 상태 확인
  const petition = await client.petition.findUnique({
    where: { id: petitionId }
  });

  if (!petition) {
    return NextResponse.json({ success: false, message: "청원을 찾을 수 없습니다." }, { status: 404 });
  }

  if (petition.status !== 'open') {
    return NextResponse.json({ success: false, message: "마감된 청원입니다." }, { status: 400 });
  }

  // 이미 동의한 경우 동의 취소, 아닌 경우 동의 추가
  const existingSupport = await client.petitionSupport.findFirst({
    where: {
      petitionId,
      userId: user.id
    }
  });

  if (existingSupport) {
    await client.petitionSupport.delete({
      where: { id: existingSupport.id }
    });
    return NextResponse.json({
      success: true,
      message: "청원 동의가 취소되었습니다.",
      supported: false
    });
  }

  await client.petitionSupport.create({
    data: {
      petitionId,
      userId: user.id
    }
  });

  return NextResponse.json({
    success: true,
    message: "청원에 동의했습니다.",
    supported: true
  });
}

export const GET = withHandler({ method: "GET", fn: GetHandler });
export const POST = withHandler({ method: "POST", fn: PostHandler });
