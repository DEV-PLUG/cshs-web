'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileBottomMenu() {
  const pathname = usePathname();

  return (
    <div className="fixed md:hidden block z-30 bottom-0 right-0 left-0 py-2 border-t-[1px] rounded-t-xl border-lightgray-100 bg-white">
      <div className="w-full flex items-center justify-around px-3">
        <Link href='/d/home'>
          <div className="flex items-center justify-center flex-col cursor-pointer">
            <svg className={ pathname === '/d/home' ? "stroke-zinc-800 w-7 h-7" : "stroke-lightgray-100 fill-lightgray-100 w-7 h-7" } fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path clipRule="evenodd" fillRule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" />
            </svg>
            <div className={ pathname === '/d/home' ? "text-sm font-bold text-zinc-800" : "text-sm font-bold text-lightgray-100" }>홈 피드</div>
          </div>
        </Link>
        <Link href='/d/activity'>
          <div className="flex items-center justify-center flex-col cursor-pointer">
            <svg className={ pathname.includes('/d/activity') ? "stroke-zinc-800 w-7 h-7" : "stroke-lightgray-100 fill-lightgray-100 w-7 h-7" } fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M5.566 4.657A4.505 4.505 0 0 1 6.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0 0 15.75 3h-7.5a3 3 0 0 0-2.684 1.657ZM2.25 12a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3v-6ZM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 0 1 6.75 6h10.5a3 3 0 0 1 2.683 1.657A4.505 4.505 0 0 0 18.75 7.5H5.25Z" />
            </svg>
            <div className={ pathname.includes('/d/activity') ? "text-sm font-bold text-zinc-800" : "text-sm font-bold text-lightgray-100" }>활동 승인</div>
          </div>
        </Link>
        <Link href='/d/home/todo'>
          <div className="flex items-center justify-center flex-col cursor-pointer">
            <svg className={ pathname.includes('/d/home/todo') ? "stroke-zinc-800 w-7 h-7" : "stroke-lightgray-100 fill-lightgray-100 w-7 h-7" } fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
            <div className={ pathname.includes('/d/home/todo') ? "text-sm font-bold text-zinc-800" : "text-sm font-bold text-lightgray-100" }>할 일</div>
          </div>
        </Link>
        <Link href='/d/announcement'>
          <div className="flex items-center justify-center flex-col cursor-pointer">
            <svg className={ pathname === '/d/announcement' ? "stroke-zinc-800 w-7 h-7" : "stroke-lightgray-100 fill-lightgray-100 w-7 h-7" } fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" />
            </svg>
            <div className={ pathname === '/d/announcement' ? "text-sm font-bold text-zinc-800" : "text-sm font-bold text-lightgray-100" }>공지사항</div>
          </div>
        </Link>
        <Link href='/mobile/info'>
          <div className="flex items-center justify-center flex-col cursor-pointer">
            <svg className={ pathname === '/mobile/info' ? "stroke-zinc-800 w-7 h-7" : "stroke-lightgray-100 fill-lightgray-100 w-7 h-7" } fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path clipRule="evenodd" fillRule="evenodd" d="M2 3.75A.75.75 0 0 1 2.75 3h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 3.75ZM2 8a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 8Zm0 4.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z" />
            </svg>
            <div className={ pathname === '/mobile/info' ? "text-sm font-bold text-zinc-800" : "text-sm font-bold text-lightgray-100" }>전체</div>
          </div>
        </Link>
      </div>
    </div>
  )
}