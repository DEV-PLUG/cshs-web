import client from "@libs/server/client";
import { error } from "console";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    async signIn(data:any) {
      const dbUser = await client.user.findMany({
        where: {
          email: data.user.email
        },
        select: {
          id: true
        }
      });
      if(dbUser.length > 0) {
        await client.log.create({
          data: {
            type: "Login",
            relation: dbUser[0].id
          }
        });

        await client.user.update({
          where: {
            email: data.user.email
          },
          data: {
            profile: data.user.image
          }
        });

        return true;
      } else {
        return false;
      }
    },
    async session({ session, toekn }:any) {
      const dbUser = await client.user.count({
       where: {
         email: session.user.email
       }
      });
      if(dbUser > 0) {
        session.signup = true;
      }
      else {
        session.signup = false;
      }
      
      return session === undefined ? null : session;
    }
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login/error",
  }
}