import { NextResponse } from "next/server";
import client from "@libs/server/client";
import getServerSessionCM from "@libs/server/session";
import withHandler from "@libs/server/withHandler";

async function isAdmin(session: any) {
  if (!session?.user?.email) return false;
  const user = await client.user.findUnique({ where: { email: session.user.email } });
  return (Number(user?.admin) & 2) === 2;
}

async function PostHandler(request: Request) {
	const session = await getServerSessionCM();
	const { id } = await request.json();

	if (!(await isAdmin(session))) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 });
  }

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

	await client.activity.update({
		where: { id },
		data: { status: 0 }
	});

	return NextResponse.json({ success: true });
}

export const POST = withHandler({ method: "POST", fn: PostHandler });