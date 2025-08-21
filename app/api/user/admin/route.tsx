import { NextResponse } from 'next/server';
import client from '@/libs/server/client';
import getServerSessionCM from '@/libs/server/session';

async function isAdmin(session: any) {
  if (!session?.user?.email) return false;
  const user = await client.user.findUnique({ where: { email: session.user.email } });
  return !!user?.admin;
}

export async function GET(req: Request) {
  const session = await getServerSessionCM();
  if (!(await isAdmin(session))) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 });
  }
  const users = await client.user.findMany({
    orderBy: {
      userId: 'asc'
    }
  });
  return NextResponse.json({ users });
}

export async function PATCH(req: Request) {
  const session = await getServerSessionCM();
  if (!(await isAdmin(session))) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 });
  }
  const { id, data } = await req.json();
  // type 변환 처리 (student: 0, teacher: 1)
  if (data.type === 'student') data.type = 0;
  if (data.type === 'teacher') data.type = 1;
  const user = await client.user.update({
    where: { id },
    data
  });
  return NextResponse.json({ user });
}

export async function DELETE(req: Request) {
  const session = await getServerSessionCM();
  if (!(await isAdmin(session))) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 });
  }
  const { ids } = await req.json();
  await client.user.deleteMany({
    where: { id: { in: ids } }
  });
  return NextResponse.json({ ok: true });
}
