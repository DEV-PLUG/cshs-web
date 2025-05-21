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
  const time = searchParams.get('time');
  const date = searchParams.get('date');

  const dateCondition = date ? new Date(date).toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" }).replaceAll('.', '').replaceAll(' ', '') : new Date().toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" }).replaceAll('.', '').replaceAll(' ', '');

  if(!grade) return NextResponse.json({
    success: false,
    message: 'Invalid grade value'
  }, { status: 400 });
  if(!time) return NextResponse.json({
    success: false,
    message: 'Invalid time value'
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

  const activity = await client.activity.findMany({
    where: {
      date: dateCondition,
      perio: {
        contains: time
      },
      status: 1,
      OR: [
        {
          writer: {
            grade: +grade
          },
        },
        {
          relation: {
            some: {
              user: {
                grade: +grade
              }
            }
          }
        }
      ]
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
          number: true,
          profile: true
        }
      },
      content: true,
      relation: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              grade: true,
              class: true,
              number: true,
              profile: true
            }
          }
        }
      },
      place: {
        select: {
          id: true,
          place: true
        }
      },
      teacher: {
        select: {
          id: true,
          name: true,
          profile: true
        }
      },
      status: true,
    }
  });

  return NextResponse.json({
    success: true,
    seat,
    activity
  }, { status: 200 });
}

export const GET = withHandler({ method: "GET", fn: GetHandler });