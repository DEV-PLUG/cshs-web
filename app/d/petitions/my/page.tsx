import Menu from "@components/menu";
import { Metadata } from "next";
import MobileBottomMenu from "@components/menu/mobile";
import Link from "next/link";
import MyPetitionsList from "../my-list";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '내 청원'
  }
}

export default async function MyPetitionsPage() {
  return (
    <main className="flex w-full min-h-screen relative overflow-hidden">
      <Menu />
      <div className="h-[100vh] z-10 w-full md:border-l-[1px] bg-white border-lightgray-100 p-5 md:p-10 overflow-auto">
        <div className="flex items-center mb-8 text-sm">
          <Link href='/d/petitions'>
            <div className="bg-gray-100 transition-colors cursor-pointer hover:bg-gray-200 px-4 pr-5 py-2 space-x-2 rounded-full text-gray-500 flex items-center">
              <svg className="w-4 h-4" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
              <div>청원 게시판으로 돌아가기</div>
            </div>
          </Link>
        </div>

        <MyPetitionsList />
        <MobileBottomMenu />
      </div>
    </main>
  );
}
