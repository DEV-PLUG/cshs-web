import { NextResponse } from 'next/server';
import client from '@/libs/server/client';
import getServerSessionCM from '@/libs/server/session';
import papa from 'papaparse';

async function isAdmin(session: any) {
  if (!session?.user?.email) return false;
  const user = await client.user.findUnique({ where: { email: session.user.email } });
  return (Number(user?.admin) & 2) === 2;
}

// user.id, user.userId, user.name, user.grade, user.class, user.number || user.id, user.userId, user.name

export async function POST(req: Request) {
  const session = await getServerSessionCM();
  if (!(await isAdmin(session))) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 });
  }
  const formdata = await req.formData();
  const file = formdata.get('file') as File;
  if (!file) {
    return NextResponse.json({ error: '파일 없음' }, { status: 400 });
  }
  const csvText = await file.text();
  const result = papa.parse(csvText, { header: true,
    skipEmptyLines: true,
    dynamicTyping: true
  });
  result.data.forEach(data => {
    // TODO: csv 파일 양식 만들 것.
  });
}