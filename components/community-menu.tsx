'use client';

import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import Modal from "./modal";

export default function Menu() {

  // const router = useRouter();
  // 메뉴 모달 컴포넌트 모듈화
  const [profile, setProfile] = useState(false);

  return (
    <div className="w-[320px]">
      <AnimatePresence initial={false} mode="wait">
        { profile && <Modal handleClose={() => setProfile(false)} backdropType="transparent">
          <div className="w-[272px] h-auto top-[155px] p-2 left-[24px] rounded-xl bg-white border-lightgray-100 drop-shadow-2xl absolute">
            <div className="px-3 py-2 flex items-center space-x-2 transition-all cursor-pointer rounded-lg hover:bg-gray-100 text-lightgray-300">
              <svg className="w-5 h-5" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <div className="text-base">구성원</div>
            </div>
            <div className="px-3 py-2 flex items-center space-x-2 transition-all cursor-pointer rounded-lg hover:bg-gray-100 text-lightgray-300">
              <svg className="w-5 h-5" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
              <div className="text-base">커뮤니티 설정</div>
            </div>
            <div className="w-full px-3">
              <div className="w-full h-[1px] my-2 bg-lightgray-100"></div>
            </div>
            <div className="px-3 py-2 flex items-center space-x-2 transition-all cursor-pointer rounded-lg hover:bg-gray-100 text-red-500">
              <svg className="w-5 h-5" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
              <div className="text-base">커뮤니티 나가기</div>
            </div>
          </div>
        </Modal> }
      </AnimatePresence>
      <div className="h-[100vh] bg-background-gray w-[320px] flex flex-col justify-between px-6 py-6">
        <div className="h-full">
          <Link href='/community'>
            <div className="flex text-lightgray-200 items-center cursor-pointer space-x-1 px-3 my-3">
              <svg className="w-5 h-5" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
              <div>목록으로 돌아가기</div>
            </div>
          </Link>
          <div onClick={() => setProfile(true)} className="flex mb-5 space-x-3 px-4 py-2 mt-2 rounded-2xl hover:bg-gray-100 active:bg-gray-200 transition-all cursor-pointer">
            <div className="w-[55px] h-[55px] flex justify-center overflow-hidden items-center bg-pink-500 border-[1px] border-pink-600 rounded-[20px]">
              <svg className="w-7 h-7 stroke-white" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
              </svg>
            </div>
            <div className="flex flex-col justify-center">
              <div>
                <div className="font-bold text-[17.5px] -mb-0 text-zinc-800">1학년 1반</div>
                <div className="text-lightgray-200">21명</div>
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] mt-5 mb-3 bg-lightgray-100"></div>
          <div className="relative">
            <div className="py-2">
              <Link href='/community/1234/1234'>
                <div className="px-4 py-[10px] transition-all rounded-xl flex items-center justify-between cursor-pointer hover:bg-gray-100 active:bg-gray-200">
                  <div className="flex items-center space-x-3">
                    <svg className="stroke-zinc-800 w-6 h-6" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
                    </svg>
                    <div className="text-[17.5px] font-bold text-zinc-800">자유게시판</div>
                  </div>
                  <div className="flex space-x-1">
                  </div>
                </div>
              </Link>
              <Link href='/community/1234/1235'>
                <div className="px-4 py-[10px] transition-all rounded-xl flex items-center justify-between cursor-pointer hover:bg-gray-100 active:bg-gray-200">
                  <div className="flex items-center space-x-3">
                    <svg className="stroke-lightgray-300 w-6 h-6" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
                    </svg>
                    <div className="text-[17.5px] font-bold text-lightgray-300">체육대회</div>
                  </div>
                  <div className="flex space-x-1">
                  </div>
                </div>
              </Link>
              {/* <Link href='/community/1234/1236'>
                <div className="px-4 py-[10px] transition-all rounded-xl flex items-center justify-between cursor-pointer hover:bg-gray-100 active:bg-gray-200">
                  <div className="flex items-center space-x-3">
                    <svg className="stroke-lightgray-300 w-6 h-6" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m7.875 14.25 1.214 1.942a2.25 2.25 0 0 0 1.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 0 1 1.872 1.002l.164.246a2.25 2.25 0 0 0 1.872 1.002h2.092a2.25 2.25 0 0 0 1.872-1.002l.164-.246A2.25 2.25 0 0 1 16.954 9h4.636M2.41 9a2.25 2.25 0 0 0-.16.832V12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 0 1 .382-.632l3.285-3.832a2.25 2.25 0 0 1 1.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0 0 21.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                    <div className="text-[17.5px] font-bold text-lightgray-300">질문 & 답변</div>
                  </div>
                  <div className="flex space-x-1">
                  </div>
                </div>
              </Link> */}
              <Link href='/community/1234/1236'>
                <div className="px-4 py-[10px] transition-all rounded-xl flex items-center justify-between cursor-pointer hover:bg-gray-100 active:bg-gray-200">
                  <div className="flex items-center space-x-3">
                    <svg className="stroke-lightgray-300 w-6 h-6" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                    <div className="text-[17.5px] font-bold text-lightgray-300">익명 게시판</div>
                  </div>
                  <div className="flex space-x-1">
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
