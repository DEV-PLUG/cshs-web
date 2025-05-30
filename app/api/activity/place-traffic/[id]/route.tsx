import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { NextResponse } from "next/server";
import formatedDate from "@libs/client/formated-date";

// Get traffic of the selected place
async function GetHandler(request:Request, {params}:{params:{id:string}}) {
  const { id } = params;

  if(!id || id === 'undefined' || typeof parseInt(id) !== 'number') return NextResponse.json({
    success: false,
    message: "장소 정보가 올바르지 않아요"
  }, { status: 400 });

  const activity = await client.activity.findMany({
    where: {
      placeId: parseInt(id),
      date: formatedDate(new Date().toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" }))
    },
    select: {
      id: true,
      relation: {
        select: {
          id: true
        }
      },
      perio: true
    }
  });

  return NextResponse.json({
    success: true,
    activity
  }, { status: 200 });
}

export const GET = withHandler({ method: "GET", fn: GetHandler });