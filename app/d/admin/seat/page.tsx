import Menu from "@components/menu";
import Image from "next/image";
import Link from "next/link";
import Seat from "./seat";
import { Metadata } from "next";
import MobileBottomMenu from "@components/menu/mobile";

export const metadata:Metadata = {
  title: '관리자 - 자리 배치 수정',
}

export default function Home() {
  return (
    <main className="md:flex w-full min-h-screen relative overflow-hidden">
      <Menu/>
      <div className="w-full absolute left-[320px] drop-shadow-2xl z-10 h-[100vh] bg-white md:block hidden"></div>
      <div className="h-[100vh] bg-white z-10 w-full md:border-l-[1px] border-lightgray-100 p-5 md:p-10 overflow-auto">
        <div className="md:flex justify-between w-full mb-8">
          <div className="flex space-x-3 md:space-x-7 items-center">
            <Link href='/d/admin/seat'>
              <div className="font-bold text-2xl md:text-3xl text-zinc-800 cursor-pointer">자리 배치</div>
            </Link>
          </div>
          <div className="flex">
            <div className="md:block flex md:h-[44px]">
            </div>
          </div>
          <MobileBottomMenu/>
        </div>
        <Seat/>
      </div>
    </main>
  );
}
