import Menu from "@components/menu";
import Link from "next/link";
import TodoSendList from "./list";
import AddToMeButton from "../add-to-me";
import AddToPeopleButton from "../add-to-people";
import { Metadata } from "next";
import MobileBottomMenu from "@components/menu/mobile";

export const metadata:Metadata = {
  title: '홈 피드 - 보낸 할 일',
}

export default function Home() {
  return (
    <main className="flex w-full min-h-screen relative overflow-hidden">
      <Menu/>
      <div className="w-full absolute left-[320px] drop-shadow-2xl z-10 h-[100vh] bg-white"></div>
      <div className="h-[100vh] bg-white z-10 w-full md:border-l-[1px] border-lightgray-100 p-5 md:p-10 overflow-auto">
        <div className="flex justify-between w-full mb-2 md:mb-8">
          <div className="hidden space-x-7 items-center md:flex">
            <Link href='/d/home'>
              <div className="font-bold text-3xl text-lightgray-100 cursor-pointer">피드</div>
            </Link>
            {/* <Link href='/d/home/notice'>
              <div className="font-bold text-3xl text-lightgray-100 cursor-pointer">학교 소식</div>
            </Link> */}
            <Link href='/d/home/todo'>
              <div className="font-bold text-3xl text-zinc-800 cursor-pointer">할 일</div>
            </Link>
          </div>
          <div className="font-bold block md:hidden text-2xl md:text-3xl text-zinc-800 cursor-pointer mb-6">할 일</div>
          <div className="flex space-x-2">
            <AddToMeButton/>
            <AddToPeopleButton/>
          </div>
          <MobileBottomMenu/>
        </div>
        <div className="flex justify-between space-x-5">
          <TodoSendList/>
        </div>
      </div>
    </main>
  );
}
