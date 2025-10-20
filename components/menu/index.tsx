import Link from "next/link";
import School from "./school";
import ProfileMenu from "./profile";
import SearchMenu from "./search";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import client from "@libs/server/client";
import { signIn } from "next-auth/react";
import SignInButton from "./login";
import { ReactNode } from "react";
import MenuButtons from "./button";
import NotificationMenu from "./notification";

export default async function Menu() {

  return (
    <div className="xl:w-[320px] w-[70px] md:block hidden">
      <div className="h-[100vh] bg-background-gray w-[320px] flex flex-col justify-between xl:px-6 xl:py-6 px-[10px] py-[10px]">
        <div className="h-full">
          <ProfileMenu/>
          <SearchMenu/>
          <NotificationMenu/>
          <div className="px-0">
            <div className="w-[50px] xl:w-full h-[1px] my-3 xl:my-5 bg-lightgray-100"></div>
          </div>
          <div className="relative">
            <div className="overflow-auto h-[calc(100vh-450px)] py-2">
              <div className="h-2 w-full bg-gradient-to-b absolute top-0 left-0 right-0 from-background-gray"></div>
              <div className="h-2 w-full bg-gradient-to-t absolute bottom-0 left-0 right-0 from-background-gray"></div>
              <MenuButtons/>
            </div>
          </div>
        </div>
        <School/>
      </div>
    </div>
  );
}
