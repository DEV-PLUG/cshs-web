import { NextResponse } from "next/server";
import client from "@libs/server/client";
import getServerSessionCM from "@libs/server/session";
import withHandler from "@libs/server/withHandler";

async function PostHandler(request: Request) {
  const session = await getServerSessionCM();
  const { id } = await request.json();

  const activity = await client.activity.findUnique({
    where: { id },
    select: {
      teacher: { select: { email: true } },
      status: true
    }
  });

  if (!activity) {
    return NextResponse.json({ success: false, message: "활동을 찾을 수 없습니다." }, { status: 404 });
  }
  if (activity.teacher.email !== session.user.email) {
    return NextResponse.json({ success: false, message: "담당 교사만 승인 취소할 수 있습니다." }, { status: 403 });
  }

  await client.activity.update({
    where: { id },
    data: { status: 0 }
  });

  return NextResponse.json({ success: true });
}

export const POST = withHandler({ method: "POST", fn: PostHandler });