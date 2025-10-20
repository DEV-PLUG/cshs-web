import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

// 사용자가 작성한 청원 목록 조회
async function GetHandler(request: Request) {
  const session = await getServerSessionCM();
  const searchParams = new URL(request.url).searchParams;
  const page = Number(searchParams.get('page')) || 1;
  const perPage = 20;

  const user = await client.user.findFirst({
    where: { email: session.user.email },
    select: { id: true, affiliationSchoolId: true }
  });

  if (!user?.affiliationSchoolId || !user.id) {
    return NextResponse.json({ success: false, message: "사용자 정보를 찾을 수 없습니다." }, { status: 404 });
  }

  const [petitions, total] = await Promise.all([
    client.petition.findMany({
      where: {
        writerId: user.id,
        schoolId: user.affiliationSchoolId
      },
      include: {
        supports: {
          select: { id: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: perPage,
      skip: (page - 1) * perPage,
    }),
    client.petition.count({
      where: {
        writerId: user.id,
        schoolId: user.affiliationSchoolId
      }
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
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
    })),
    total,
    page,
    totalPages: Math.ceil(total / perPage)
  });
}

export const GET = withHandler({ method: "GET", fn: GetHandler });
