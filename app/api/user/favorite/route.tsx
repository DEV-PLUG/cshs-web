import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

// Get all favorites of the user
async function GetHandler() {
  const session = await getServerSessionCM();
  
  const favorites = await client.favorite.findMany({
    where: {
      from: {
        email: session.user.email
      }
    },
    select: {
      id: true,
      to: {
        select: {
          id: true,
          email: true,
          profile: true,
          name: true,
          grade: true,
          class: true,
          number: true,
          type: true
        }
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  return NextResponse.json({
    success: true,
    favorites
  }, { status: 200 });
}

// Add a new favorite to the user
async function PostHandler(request:Request) {
  const session = await getServerSessionCM();
  const req = await request.json();

  const favorite = await client.favorite.count({
    where: {
      from: {
        email: session.user.email
      },
      to: {
        id: req.to
      }
    }
  });
  if(favorite > 0) return NextResponse.json({
    success: false,
    message: "이미 즐겨찾기에 추가된 사용자에요"
  }, { status: 400 });

  await client.favorite.create({
    data: {
      from: {
        connect: {
          email: session.user.email
        }
      },
      to: {
        connect: {
          id: req.to
        }
      }
    }
  });

  return NextResponse.json({
    success: true
  }, { status: 200 });
}

// Delete a favorite from the user
async function DeleteHandler(request:Request) {
  const session = await getServerSessionCM();
  const req = await request.json();

  const favorite = await client.favorite.count({
    where: {
      from: {
        email: session.user.email
      },
      to: {
        id: req.to
      }
    }
  });
  if(favorite <= 0) return NextResponse.json({
    success: false,
    message: "이미 즐겨찾기에 없는 사용자에요"
  }, { status: 400 });

  await client.favorite.deleteMany({
    where: {
      from: {
        email: session.user.email
      },
      to: {
        id: req.to
      }
    }
  });

  return NextResponse.json({
    success: true
  }, { status: 200 });
}

export const GET = withHandler({ method: "GET", fn: GetHandler });
export const POST = withHandler({ method: "POST", fn: PostHandler });
export const DELETE = withHandler({ method: "DELETE", fn: DeleteHandler });