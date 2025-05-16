import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

async function GetHandler(request:Request) {
  const session = await getServerSessionCM();
  const searchParams = new URL(request.url).searchParams;
  const time = searchParams.get('time');
  if (!time) {
    return NextResponse.json({ success: false, activity: null }, { status: 200 });
  }

  const today = new Date().toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" }).replaceAll('.', '').replaceAll(' ', '');

  const activity = await client.activity.findFirst({
    where: {
      OR: [
        {
          relation: {
            some: {
              user: {
                email: session.user.email
              }
            }
          }
        },
        {
          writer: {
            email: session.user.email
          }
        }
      ],
      date: today,
      perio: {
        contains: time
      },
      status: 1
    }
  });

  return NextResponse.json({
    success: true,
    activity: activity ? activity : null
  }, { status: 200 });
}

export const GET = withHandler({ method: "GET", fn: GetHandler });