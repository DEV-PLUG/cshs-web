import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

// 사용자가 작성한 청원 상세 조회
async function GetHandler(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSessionCM();
  const petitionId = Number(params.id);

  const user = await client.user.findFirst({
    where: { email: session.user.email },
    select: { id: true, affiliationSchoolId: true }
  });

  if (!user?.affiliationSchoolId || !user.id) {
    return NextResponse.json({ success: false, message: "사용자 정보를 찾을 수 없습니다." }, { status: 404 });
  }

  const petition = await client.petition.findFirst({
    where: {
      id: petitionId,
      writerId: user.id,
      schoolId: user.affiliationSchoolId
    },
    include: {
      supports: {
        select: { id: true }
      }
    }
  });

  if (!petition) {
    return NextResponse.json({ success: false, message: "청원을 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    petition: {
      id: petition.id,
      title: petition.title,
      content: petition.content,
      status: petition.status,
      expiresAt: petition.expiresAt,
      reason: petition.reason,
      responder: petition.responder,
      response: petition.response,
      supportCount: petition.supports.length,
      createdAt: petition.createdAt,
      updatedAt: petition.updatedAt
    }
  });
}

export const GET = withHandler({ method: "GET", fn: GetHandler });
