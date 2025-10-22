import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

// 청원 목록 조회
async function GetHandler(request: Request) {
  const session = await getServerSessionCM();
  const searchParams = new URL(request.url).searchParams;
  const page = Number(searchParams.get('page')) || 1;
  const status = searchParams.get('status') || 'open';
  const perPage = 100;

  if(status !== 'closed' && status !== 'open') {
    return NextResponse.json({ success: false, message: "잘못된 청원 상태입니다." }, { status: 400 });
  }

  const user = await client.user.findFirst({
    where: { email: session.user.email },
    select: { affiliationSchoolId: true }
  });

  if (!user?.affiliationSchoolId) {
    return NextResponse.json({ success: false, message: "사용자 정보를 찾을 수 없습니다." }, { status: 404 });
  }

  const [petitions, total] = await Promise.all([
    client.petition.findMany({
      where: {
        schoolId: user.affiliationSchoolId,
        expiresAt: status === 'open' ? {
          gte: new Date()
        } : {
          lt: new Date()
        },
        status: {
          not: {
            notIn: ['rejected', 'pending']
          }
        },
        isPublic: true
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
        schoolId: user.affiliationSchoolId,
        status,
      }
    })
  ]);

  return NextResponse.json({
    success: true,
    petitions: petitions.map(p => ({
      ...p,
      supportCount: p.supports.length,
      supports: undefined
    })),
    total,
    page,
    totalPages: Math.ceil(total / perPage)
  });
}

// 새 청원 작성
async function PostHandler(request: Request) {
  const session = await getServerSessionCM();
  const { title, content, reason } = await request.json();

  if (!title || !content || !reason) {
    return NextResponse.json({ success: false, message: "필수 항목이 누락되었습니다." }, { status: 400 });
  }

  const user = await client.user.findFirst({
    where: { email: session.user.email },
    select: { id: true, affiliationSchoolId: true, type: true }
  });

  if (!user?.affiliationSchoolId) {
    return NextResponse.json({ success: false, message: "사용자 정보를 찾을 수 없습니다." }, { status: 404 });
  }
  if(user.type !== 0) {
    return NextResponse.json({ success: false, message: "청원은 학생만 작성 가능합니다." }, { status: 403 });
  }

  // 30일 후 만료
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const petition = await client.petition.create({
    data: {
      title,
      content,
      writerId: user.id,
      schoolId: user.affiliationSchoolId,
      expiresAt,
      reason
    }
  });

  return NextResponse.json({ success: true, petition });
}

// 청원 상태 변경 (관리자용)
async function PutHandler(request: Request) {
  const session = await getServerSessionCM();
  const { id, status } = await request.json();

  const user = await client.user.findFirst({
    where: { email: session.user.email },
    select: { admin: true }
  });

  if ((Number(user?.admin) & 4) !== 4) {
    return NextResponse.json({ success: false, message: "권한이 없습니다." }, { status: 403 });
  }

  await client.petition.update({
    where: { id },
    data: { status }
  });

  return NextResponse.json({ success: true });
}

export const GET = withHandler({ method: "GET", fn: GetHandler });
export const POST = withHandler({ method: "POST", fn: PostHandler });
export const PUT = withHandler({ method: "PUT", fn: PutHandler });