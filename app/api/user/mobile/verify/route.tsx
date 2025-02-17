import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { NextResponse } from "next/server";

function generateRandomString(length:number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// Get mobile authorization token
async function PostHandler(request:Request) {
  const req = await request.json();

  const verificationCode = await client.verificationCode.findMany({
    where: {
      code: req.code
    },
    select: {
      userId: true
    }
  });
  if(verificationCode.length <= 0) return NextResponse.json({
    success: false,
    message: "인증 코드가 올바르지 않아요"
  }, { status: 400 });

  const user = await client.user.findUnique({
    where: {
      id: verificationCode[0].userId
    },
    select: {
      mobileToken: true
    }
  });
  if(!user) return NextResponse.json({
    success: false,
    message: "사용자 정보를 찾을 수 없어요"
  }, { status: 404 });

  const randomString = generateRandomString(30);

  await client.user.update({
    where: {
      id: verificationCode[0].userId
    },
    data: {
      mobileToken: randomString,
      verificationCode: {
        delete: true
      }
    }
  });

  return NextResponse.json({
    success: true,
    token: randomString
  }, { status: 200 });
}

export const POST = withHandler({ method: "POST", fn: PostHandler, isPrivate: false });