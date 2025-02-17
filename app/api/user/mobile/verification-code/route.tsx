import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/authOptions";
import { NextResponse } from "next/server";

// Get one-time verification code for mobile app
function generateVerificationCode() {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789'; // Exclude 'O' and '0'
  let randomCode = '';
  for (let i = 0; i < 6; i++) {
    randomCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomCode;
}

async function GetHandler() {
  const session = await getServerSession(authOptions);
  const code = generateVerificationCode();

  const user = await client.user.findUnique({
    where: { email: session.user.email }
  });
  if(!user) return NextResponse.json({
    success: false,
    message: "User not found"
  }, { status: 404 });

  await client.verificationCode.upsert({
    where: { 
      userId: user.id
    },
    update: {
      code: code
    },
    create: {
      code: code,
      userId: user.id
    },
  });

  return NextResponse.json({
    success: true,
    code
  }, { status: 200 });
}

export const GET = withHandler({ method: "GET", fn: GetHandler });