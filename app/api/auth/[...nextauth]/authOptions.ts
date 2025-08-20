import client from "@libs/server/client";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const bcrypt = require('bcryptjs');

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const user = await client.user.findUnique({
          where: {
            userId: req.body?.id
          }
        });
        if(user === null) {
          throw new Error("Incorrect-ID-or-PW");
        }

        // 임시 로그인용 - 실제 서비스 시 삭제할것!
        if(req.body?.password === user.userId && user.password === '') {
          return { id: user.userId, email: user.email };
        }

        const isValidPassword = await bcrypt.compare(req.body?.password, user.password);
        if(isValidPassword) {
          return { id: user.userId, email: user.email };
        } else {
          throw new Error("Incorrect-ID-or-PW");
        }
      }
    })
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