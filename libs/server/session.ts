import { authOptions } from "@app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { cookies, headers } from "next/headers";
import client from "./client";

export default async function getServerSessionCM() {
  const cookie:any = Object.fromEntries(
    (await cookies()).getAll().map((c) => [c.name, c.value])
  );

  if(cookie.MobileAuthorization) {
    const user = await client.user.findMany({
      where: {
        mobileToken: cookie.MobileAuthorization.includes('MobileAuthorization') === false ? cookie.MobileAuthorization : cookie.MobileAuthorization.split('MobileAuthorization=')[1]
      },
      select: {
        id: true,
        email: true,
        profile: true
      }
    });
    
    if(user.length > 0) {
      return {
        user: {
          id: user[0].id,
          email: user[0].email,
          profile: user[0].profile
        }
      };
    } else {
      return {
        user: {
          id: 0,
          email: '',
          profile: ''
        }
      };
    }
  }
  if(headers().get('MobileAuthorization')) {
    const user = await client.user.findMany({
      where: {
        mobileToken: headers().get('MobileAuthorization')
      },
      select: {
        id: true,
        email: true,
        profile: true
      }
    });
    
    if(user.length > 0) {
      return {
        user: {
          id: user[0].id,
          email: user[0].email,
          profile: user[0].profile
        }
      };
    } else {
      return {
        user: {
          id: 0,
          email: '',
          profile: ''
        }
      };
    }
  }

  const session = await getServerSession(authOptions);

  return session;
}