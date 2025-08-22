import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";
import formatedDate from "@libs/client/formated-date";

// Get seat of specific grade
async function GetHandler(request:Request) {
  const session = await getServerSessionCM();
  const searchParams = new URL(request.url).searchParams;
  const grade = searchParams.get('grade');

  const dateCondition = formatedDate(new Date().toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" }));

  if(!grade) return NextResponse.json({
    success: false,
    message: 'Invalid grade value'
  }, { status: 400 });

  const user = await client.user.findMany({
    where: {
      email: session.user.email
    },
    select: {
      affiliationSchoolId: true
    }
  });
  if(!user[0].affiliationSchoolId) return NextResponse.json({
    success: false,
    message: 'User not found'
  }, { status: 404 });

  const seat = await client.user.findMany({
    where: {
      grade: +grade,
      affiliationSchool: {
        id: user[0].affiliationSchoolId
      }
    },
    select: {
      id: true,
      name: true,
      grade: true,
      class: true,
      number: true,
      seat: true,
      profile: true,
    }
  });

  return NextResponse.json({
    success: true,
    seat
  }, { status: 200 });
}

// Post seat of specific grade
async function PostHandler(request:Request) {
  const session = await getServerSessionCM();
  const req = await request.json();
  const seat:{ id: number, seat: number | null }[] = req.seat;
  let seatData: { id: number, seat: number | null }[] = [];
  
  if (!Array.isArray(seat) || seat.length === 0) return NextResponse.json({
    success: false,
    message: 'Invalid seat data'
  }, { status: 400 });

  seat.forEach(s => {
    if (typeof s.id !== 'number' || (s.seat !== null && typeof s.seat !== 'number')) {
      return NextResponse.json({
        success: false,
        message: 'Invalid seat data format'
      }, { status: 400 });
    }
    seatData.push({ id: s.id, seat: s.seat });
  });

  const user = await client.user.findMany({
    where: {
      email: session.user.email
    },
    select: {
      affiliationSchoolId: true,
      admin: true
    }
  });
  if (!user[0]?.affiliationSchoolId || (Number(user[0]?.admin) & 1) !== 1) return NextResponse.json({
    success: false,
    message: 'User not found'
  }, { status: 404 });

  // 모든 좌석 업데이트가 끝난 후 응답 반환
  await Promise.all(
    seatData.map(s =>
      client.user.update({
        where: { id: s.id },
        data: { seat: s.seat }
      })
    )
  );

  return NextResponse.json({
    success: true
  }, { status: 200 });
}

export const GET = withHandler({ method: "GET", fn: GetHandler });
export const POST = withHandler({ method: "POST", fn: PostHandler });