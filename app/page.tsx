'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    location.href = '/login'
  }, []);

  return (
    <main className="pretendard">
      {/* <div className="fixed top-0 right-0 left-0 w-full h-[110vh]">
        <Image alt="배경 이미지" src="/images/tree.jpg" layout="fill" objectFit="cover" />
      </div>
      <div className="fixed z-0 top-0 left-0 right-0 from-black/50 to-black/0 h-[100px] bg-gradient-to-b"></div>
      <div className="fixed top-0 w-full">
        <div className="flex items-center justify-center w-full">
          <div className="w-[1000px] py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-16">
                <div className="font-bold text-2xl">Ground</div>
                <div className="flex items-center space-x-5">
                  <div className="px-2 py-1 rounded-lg text-sm font-bold hover:bg-white/20 transition-colors cursor-pointer">블로그</div>
                  <div className="px-2 py-1 rounded-lg text-sm font-bold hover:bg-white/20 transition-colors cursor-pointer">가격</div>
                  <div className="px-2 py-1 rounded-lg text-sm font-bold hover:bg-white/20 transition-colors cursor-pointer">리소스</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Link href='/login'>
                  <div className="px-4 py-2 rounded-lg border text-sm font-bold border-white cursor-pointer hover:bg-white/10 transition-colors">로그인</div>
                </Link>
                <div className="px-4 py-2 text-black rounded-lg border border-white text-sm font-bold bg-white hover:bg-white cursor-pointer">도입 문의하기</div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-[1px] bg-white/20 relative"></div>
      </div>
      <div className="relative mt-[50vh] w-[1000px] mx-auto">
        <div className="font-bold text-6xl text-white leading-[4.5rem]">우리 학교를 위한<br/>인트라넷을 시작하세요</div>
        <div className="flex items-center space-x-4 mt-10">
          <div className="px-8 py-5 bg-blue-500 text-lg rounded-2xl flex items-center cursor-pointer transition-colors hover:bg-[#3b73f6]">
            Ground 도입 문의하기
            <svg className="w-5 h-5 ml-2" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </div>
          <div className="px-8 py-5 bg-white/30 backdrop-blur-lg text-lg rounded-2xl flex items-center cursor-pointer transition-colors hover:bg-white/40">
            무료 체험하기
          </div>
        </div>
      </div> */}
    </main>
  );
}
