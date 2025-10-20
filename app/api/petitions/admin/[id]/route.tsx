import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

// 청원 상세 조회 (관리자용)
async function GetHandler(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSessionCM();
  const petitionId = Number(params.id);

  const user = await client.user.findFirst({
    where: { email: session.user.email },
    select: { affiliationSchoolId: true, admin: true }
  });

  if (!user?.affiliationSchoolId) {
    return NextResponse.json({ success: false, message: "사용자 정보를 찾을 수 없습니다." }, { status: 404 });
  }

  if ((Number(user.admin) & 4) !== 4) {
    return NextResponse.json({ success: false, message: "권한이 없습니다." }, { status: 403 });
  }

  const petition = await client.petition.findFirst({
    where: {
      id: petitionId,
      schoolId: user.affiliationSchoolId
    },
    include: {
      supports: {
        select: { id: true, userId: true }
      },
      writer: {
        select: {
          id: true,
          name: true,
          grade: true,
          class: true,
          number: true,
          email: true
        }
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
      supporters: petition.supports.map(s => s.userId),
      writer: petition.writer,
      createdAt: petition.createdAt,
      updatedAt: petition.updatedAt
    }
  });
}

// 청원 상태 및 답변 업데이트 (관리자용)
async function PutHandler(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSessionCM();
  const petitionId = Number(params.id);
  const { status, response, responder, isPublic } = await request.json();

  const user = await client.user.findFirst({
    where: { email: session.user.email },
    select: { affiliationSchoolId: true, admin: true, name: true }
  });

  if (!user?.affiliationSchoolId) {
    return NextResponse.json({ success: false, message: "사용자 정보를 찾을 수 없습니다." }, { status: 404 });
  }

  if ((Number(user.admin) & 4) !== 4) {
    return NextResponse.json({ success: false, message: "권한이 없습니다." }, { status: 403 });
  }

  const petition = await client.petition.findFirst({
    where: {
      id: petitionId,
      schoolId: user.affiliationSchoolId
    }
  });

  if (!petition) {
    return NextResponse.json({ success: false, message: "청원을 찾을 수 없습니다." }, { status: 404 });
  }

  const updateData: any = {};

  if (status) {
    updateData.status = status;
  }

  if (response !== undefined) {
    updateData.response = response;
    updateData.responder = responder || user.name;
  }

  if (isPublic !== undefined) {
    // isPublic은 따로 필드가 없으므로 status 변경으로 대체
    // 공개(open)와 비공개(closed)를 status로 관리
    if (isPublic) {
      updateData.status = 'open';
    } else {
      updateData.status = 'closed';
    }
  }

  const updated = await client.petition.update({
    where: { id: petitionId },
    data: updateData,
    include: {
      supports: {
        select: { id: true }
      },
      writer: {
        select: {
          id: true,
          name: true,
          grade: true,
          class: true,
          number: true,
          email: true
        }
      }
    }
  });

  return NextResponse.json({
    success: true,
    petition: {
      id: updated.id,
      title: updated.title,
      content: updated.content,
      status: updated.status,
      expiresAt: updated.expiresAt,
      reason: updated.reason,
      responder: updated.responder,
      response: updated.response,
      supportCount: updated.supports.length,
      writer: updated.writer,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt
    }
  });
}

export const GET = withHandler({ method: "GET", fn: GetHandler });
export const PUT = withHandler({ method: "PUT", fn: PutHandler });
