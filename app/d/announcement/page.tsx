import type { Metadata } from 'next';
import AnnouncementPage from './announce-page';
import Image from '@node_modules/next/image';
import Menu from "@components/menu";
import NotificationMenu from "@components/menu/notification";
import MobileBottomMenu from '@components/menu/mobile';

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
      </div>
      <Menu/>
      <MobileBottomMenu/>
      <div className="w-full absolute left-[320px] drop-shadow-2xl z-10 h-[100vh] bg-white md:block hidden"></div>
      <AnnouncementPage/>
    </main>
  )
}