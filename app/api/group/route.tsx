import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

// Get all groups of the user's school
async function GetHandler() {
  // id 1인 사용자는 관리자 계정으로 가정
  const groups = await client.group.findMany({
    where: {
      user: {
        id: 1
      }
    },
    select: {
      id: true,
      name: true,
      relation: {
        select: {
          user: {
            select: {
              id: true,
              email: true,
              profile: true,
              name: true,
              grade: true,
              class: true,
              number: true,
              type: true
            }
          }
        }
      }
    },
    orderBy: {
      id: "asc"
    }
  });

  return NextResponse.json({
    success: true,
    groups
  }, { status: 200 });
}

export const GET = withHandler({ method: "GET", fn: GetHandler });