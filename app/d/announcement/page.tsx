import Menu from "@components/menu";
import Image from "next/image";
import Link from "next/link";
import Announcements from "./announcements";
import AddAnnouncementButton from "./add-announcement";
import type { Metadata } from 'next';
import MobileBottomMenu from "@components/menu/mobile";
import NotificationMenu from "@components/menu/notification";

export const metadata:Metadata = {
  title: '공지사항',
}

export default function Announcement() {
  return (
    <main className="md:flex w-full min-h-screen relative overflow-hidden">
      <div className="w-full z-20 fixed top-0 border-b border-lightgray-100 py-2 px-5 md:hidden flex items-center justify-between backdrop-blur-lg bg-white/70">
        <div>
          <Image
            src={ '/images/logo.png' }
            width={40}
            height={40}
            alt=""
          />
        </div>
        <div>
          <NotificationMenu/>
        </div>
      </div>
      <Menu/>
      <div className="w-full absolute left-[320px] drop-shadow-2xl z-10 h-[100vh] bg-white md:block hidden"></div>
      <div className="h-[100vh] bg-white z-10 w-full md:border-l-[1px] border-lightgray-100 p-5 md:p-10 overflow-auto">
        <div className="w-full mb-8 md:flex hidden justify-between">
          <div className="md:flex space-x-3 md:space-x-7 h-[46px] items-center">
            <div className="font-bold text-3xl text-zinc-800 cursor-pointer">공지사항</div>
          </div>
          <div className="flex">
            <div className="md:block flex md:h-[44px]">
              <AddAnnouncementButton/>
            </div>
          </div>
          <MobileBottomMenu/>
        </div>
        <div className="w-full h-[1px] my-5 bg-lightgray-100 xl:block hidden"></div>
        <Announcements/>
      </div>
    </main>
  )
}