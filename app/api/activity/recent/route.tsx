import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

// Get recent activities of the user
async function GetHandler() {
  const session = await getServerSessionCM();
  
  const activity = await client.activity.findMany({
    where: {
      writer: {
        email: session.user.email
      },
      status: {
        not: 2
      }
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
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
      relation: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              profile: true,
              grade: true,
              class: true,
              number: true
            }
          }
        }
      },
      perio: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 3
  });

  return NextResponse.json({
    success: true,
    activity
  }, { status: 200 });
}

export const GET = withHandler({ method: "GET", fn: GetHandler });