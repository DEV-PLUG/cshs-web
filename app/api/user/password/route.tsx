import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

const bcrypt = require('bcryptjs');
const saltRounds = 10;

// Change pw of user
async function PutHandler(request:Request) {
  const session = await getServerSessionCM();
  const req = await request.json();

  await bcrypt.genSalt(saltRounds, async function(err:any, salt:any) {
    await bcrypt.hash(req.password, salt, async function(err:any, hash:any) {
      await client.user.update({
        where: {
          email: session.user.email
        },
        data: {
          password: hash
        }
      });
    });
  });

  return NextResponse.json({
    success: true
  }, { status: 200 });
}

export const PUT = withHandler({ method: "PUT", fn: PutHandler });