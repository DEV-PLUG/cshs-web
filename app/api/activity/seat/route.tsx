import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

// Get activity of specific grade
async function GetHandler(request:Request) {
  const session = await getServerSessionCM();
  const searchParams = new URL(request.url).searchParams;
  const grade = searchParams.get('grade');
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
      number: true
    }
  });
  
  const activity = await client.activityRelation.findMany({
    where: {
      user: {
        grade: +grade
      },
      activity: {
        status: 1,
        date: new Date().toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" }).replaceAll('.', '').replaceAll(' ', ''),
      }
    },
    select: {
      activity: {
        select: {
          id: true,
          perio: true
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          grade: true,
          class: true,
          number: true
        }
      }
    }
  });

  const activityWriter = await client.activity.findMany({
    where: {
      date: new Date().toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" }).replaceAll('.', '').replaceAll(' ', ''),
      status: 1,
      writer: {
        grade: +grade
      }
    },
    select: {
      id: true,
      perio: true,
      writer: {
        select: {
          id: true,
          name: true,
          grade: true,
          class: true,
          number: true
        }
      }
    }
  });

  return NextResponse.json({
    success: true,
    activity,
    seat,
    activityWriter
  }, { status: 200 });
}

export const GET = withHandler({ method: "GET", fn: GetHandler });