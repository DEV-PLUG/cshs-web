import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

async function GetHandler(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSessionCM();
  const petitionId = Number(params.id);

  const user = await client.user.findFirst({
    where: { email: session.user.email },
    select: { affiliationSchoolId: true }
  });

  if (!user?.affiliationSchoolId) {
    return NextResponse.json({ 
      success: false, 
      message: "사용자 정보를 찾을 수 없습니다." 
    }, { status: 404 });
  }

  const petition = await client.petition.findFirst({
    where: {
      id: petitionId,
      schoolId: user.affiliationSchoolId
    },
    include: {
      supports: {
        select: { id: true }
      },
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

  if (!petition) {
    return NextResponse.json({ 
      success: false, 
      message: "청원을 찾을 수 없습니다." 
    }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    ...petition,
    supportCount: petition.supports.length,
    supports: undefined
  });
}

export const GET = withHandler({ method: "GET", fn: GetHandler });
