import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

// Get informations of the member
async function GetHandler() {
  const session = await getServerSessionCM();
  
  const user = await client.user.findMany({
    where: {
      email: session.user.email
    },
    select: {
      id: true,
      email: true,
      profile: true,
      name: true,
      grade: true,
      class: true,
      number: true,
      type: true,
      allowNotification: true,
      allowAI: true,
      allowNightNotification: true,
      admin: true,
      affiliationSchool: {
        select: {
          id: true,
          ATPT_OFCDC_SC_CODE: true,
          SD_SCHUL_CODE: true
        }
      }
    }
  });
  if(user.length <= 0) {
    return NextResponse.json({
      success: false,
      message: '사용자 정보를 찾을 수 없어요'
    }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    user: user[0]
  }, { status: 200 });
}

// Change settings of user
async function PutHandler(request:Request) {
  const session = await getServerSessionCM();
  const req = await request.json();

  await client.user.update({
    where: {
      email: session.user.email
    },
    data: {
      allowNotification: req.notification,
      allowAI: req.ai,
      allowNightNotification: req.nightNotification
    }
  });

  return NextResponse.json({
    success: true
  }, { status: 200 });
}

export const GET = withHandler({ method: "GET", fn: GetHandler });
export const PUT = withHandler({ method: "PUT", fn: PutHandler });