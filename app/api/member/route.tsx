import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

// Get all members of the user's school
async function GetHandler() {
  const session = await getServerSessionCM();
  
  const members = await client.user.findMany({
    where: {
      affiliationSchool: {
        member: {
          some: {
            email: session.user.email
          }
        }
      },
      type: 0 // 학생만 선택
    },
    select: {
      id: true,
      email: true,
      profile: true,
      name: true,
      grade: true,
      class: true,
      number: true,
      type: true
    },
    orderBy: {
      userId: 'asc',
      name: 'asc'
    }
  });

  return NextResponse.json({
    success: true,
    members
  }, { status: 200 });
}

export const GET = withHandler({ method: "GET", fn: GetHandler });