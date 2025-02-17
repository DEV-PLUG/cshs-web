import Menu from "@components/menu";
import Image from "next/image";
import Link from "next/link";
import SurveyList from "./list";
import MobileBottomMenu from "@components/menu/mobile";
import { Metadata } from "next";

export const metadata:Metadata = {
  title: '설문조사 ',
}

export default function Home() {
  return (
    <main className="flex min-h-screen">
      <Menu/>
      <div className="w-full absolute left-[320px] drop-shadow-2xl z-10 h-[100vh] bg-white"></div>
      <div className="h-[100vh] bg-white z-10 w-full md:border-l-[1px] border-lightgray-100 p-5 md:p-10 overflow-auto">
        <div className="md:flex justify-between w-full mb-8">
          <div className="flex space-x-3 md:space-x-7 items-center">
            <Link href='/d/survey'>
              <div className="font-bold text-2xl md:text-3xl text-zinc-800 cursor-pointer">설문조사</div>
            </Link>
            <Link href='/d/survey/list'>
              <div className="font-bold text-2xl md:text-3xl text-lightgray-100 cursor-pointer">내역</div>
            </Link>
          </div>
          <div className="w-2 h-[44px] md:block hidden">
            {/* 정렬을 위한 것이므로 삭제하지 마세요 */}
          </div>
          <MobileBottomMenu/>
        </div>
        <SurveyList/>
      </div>
    </main>
  );
}
