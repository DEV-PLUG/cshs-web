import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

// 관리자용 청원 목록 조회 (모든 상태)
async function GetHandler(request: Request) {
  const session = await getServerSessionCM();
  const searchParams = new URL(request.url).searchParams;
  const page = Number(searchParams.get('page')) || 1;
  const status = searchParams.get('status') || 'all'; // all, pending, open, closed, rejected
  const perPage = 20;

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

  const whereCondition: any = {
    schoolId: user.affiliationSchoolId,
  };

  if (status !== 'all') {
    whereCondition.status = status;
  }

  const [petitions, total] = await Promise.all([
    client.petition.findMany({
      where: whereCondition,
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
      },
      orderBy: { createdAt: 'desc' },
      take: perPage,
      skip: (page - 1) * perPage,
    }),
    client.petition.count({
      where: whereCondition
    })
  ]);

  return NextResponse.json({
    success: true,
    petitions: petitions.map(p => ({
      id: p.id,
      title: p.title,
      content: p.content,
      status: p.status,
      expiresAt: p.expiresAt,
      reason: p.reason,
      responder: p.responder,
      response: p.response,
      supportCount: p.supports.length,
      writer: p.writer,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
    })),
    total,
    page,
    totalPages: Math.ceil(total / perPage)
  });
}

export const GET = withHandler({ method: "GET", fn: GetHandler });
