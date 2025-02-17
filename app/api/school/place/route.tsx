import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

// Get places of school
async function GetHandler() {
  const session = await getServerSessionCM();

  const user = await client.user.findUnique({
    where: {
      email: session.user.email
    },
    select: {
      affiliationSchool: {
        select: {
          id: true,
          place: {
            select: {
              id: true,
              place: true,
              code: true
            },
            where: {
              type: 0
            }
          }
        }
      }
    }
  });
  if (!user || !user.affiliationSchool) {
    return NextResponse.json({
      success: false,
      message: '사용자 정보를 찾을 수 없어요'
    }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    place: user.affiliationSchool.place
  }, { status: 200 });
}

export const GET = withHandler({ method: "GET", fn: GetHandler });