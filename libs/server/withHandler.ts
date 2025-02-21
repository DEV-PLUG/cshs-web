import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";

export interface ResponseType {
  success: boolean;
  [key : string]: any;
}

interface ConfigType {
  method: "GET" | "POST" | "DELETE" | "PUT" | null;
  fn: ((req:Request, res:Response) => void) | ((req:Request, params:any) => void);
  isPrivate?: boolean;
}

export default function withHandler({ method, isPrivate = true, fn }: ConfigType) {
  return async function (req:Request, res:Response) : Promise<any> {
    const session = await getServerSessionCM();
    const cookie = Object.fromEntries(
      (await cookies()).getAll().map((c) => [c.name, c.value])
    );

    if(method !== null && req.method !== method) {
      return NextResponse.json({ success: false }, { status: 405 });
    }
    else if(isPrivate && (!session || session?.signup === false) && !cookie.MobileAuthorization && !req.headers.get('MobileAuthorization')) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    else {
      try {
        return await fn(req, res);
      } catch(error) {
        const err:any = error;
        console.log(err); // 디버깅용 코드 - Build시 삭제
        
        await client?.log.create({
          data: {
            type: 'Unknown Error',
            description: JSON.stringify(err)
          }
        });

        if(err.message.toLowerCase().indexOf('prisma') !== -1) return NextResponse.json({ success:false, message: 'Unknown Error (101)' }, { status: 500 });
        else return NextResponse.json({ success: false, message: 'Unknown Error' }, { status: 500 });
      }
    }
  }
};