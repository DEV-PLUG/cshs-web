import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";
import updateCourse from "@libs/server/classroom/update-course";
import CryptoJS from "crypto-js";

// Change google token to access token and refresh token
async function PostHandler(request: Request) {
  const session = await getServerSessionCM();
  const req = await request.json();

  if (!req.code || req.code.length <= 0 || typeof(req.code) !== "string") {
    return NextResponse.json({
      success: false,
      message: "코드가 올바르지 않아요"
    }, { status: 400 });
  }

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      code: req.code,
      redirect_uri: process.env.NEXTAUTH_URL + '/oauth/classroom',
      client_id: process.env.GOOGLE_CLASSROOM_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLASSROOM_CLIENT_SECRET!,
      scope: "",
      grant_type: 'authorization_code'
    })
  });

  if (!tokenResponse.ok) {
    // return NextResponse.json({
    //   success: false,
    //   message: "토큰을 가져오는 데 실패했습니다"
    // }, { status: 400 });
    console.log(tokenResponse)
    return NextResponse.json({
      success: false,
      message: `${JSON.stringify(tokenResponse)}`
    }, { status: 400 });
  }
  console.log(tokenResponse, 'success')

  const tokenData = await tokenResponse.json();

  const encryptedAccessToken = CryptoJS.AES.encrypt(tokenData.access_token, process.env.CLASSROOM_CRYPTO_KEY!).toString();
  const encryptedRefreshToken = CryptoJS.AES.encrypt(tokenData.refresh_token, process.env.CLASSROOM_CRYPTO_KEY!).toString();

  const user = await client.user.findUnique({
    where: {
      email: session.user.email
    },
    select: {
      id: true
    }
  });
  if(!user) return NextResponse.json({
    success: false,
    message: "사용자를 찾을 수 없어요"
  }, { status: 400 });

  await client.google.upsert({
    where: {
      userId: user.id
    },
    create: {
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      expire: new Date(Date.now() + tokenData.expires_in * 1000),
      user: {
        connect: {
          id: user.id
        }
      }
    },
    update: {
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      expire: new Date(Date.now() + tokenData.expires_in * 1000)
    }
  });

  updateCourse(session.user.email);

  return NextResponse.json({
    success: true
  }, { status: 200 });
}

export const POST = withHandler({ method: "POST", fn: PostHandler });