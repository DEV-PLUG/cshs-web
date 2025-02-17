'use client';

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Modal from "@components/modal";

export default function SearchMenu() {
  const [searchModal, setSearchModal] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <>
      <AnimatePresence initial={false} mode="wait">
        { searchModal && <Modal handleClose={() => setSearchModal(false)}>
          <div className="w-[550px] h-[255px] relative">
            {/* <div className="flex items-center space-x-3">
              <svg className="stroke-lightgray-200 w-7 h-7" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input placeholder="빠른 검색하기" className="outline-none w-full h-[30px] text-xl" />
            </div>
            <div className="w-full h-[1px] mb-3 bg-lightgray-100 mt-4"></div>
            <div className="flex items-center justify-between px-2 py-3 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
              <div className="flex">
                전자현미경 예약 - 예약하기
              </div>
              <div className="text-lightgray-200">
                최근 검색
              </div>
            </div>
            <div className="flex items-center justify-between px-2 py-3 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
              <div className="flex">
                ESG 영상 인기투표 - 설문조사
              </div>
              <div className="text-lightgray-200">
                최근 검색
              </div>
            </div>
            <div className="flex items-center justify-between px-2 py-3 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
              <div className="flex">
                '창의체험전 준비' - 활동 승인
              </div>
              <div className="text-lightgray-200">
                최근 검색
              </div>
            </div>
            <div className="flex items-center justify-between px-2 py-3 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
              <div className="flex">
                'R&E' - 활동 승인
              </div>
              <div className="text-lightgray-200">
                최근 검색
              </div>
            </div> */}
            <div className="flex flex-col items-center justify-center w-full h-full absolute text-lightgray-200">
              <svg className="w-10 h-10" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <div className="font-bold text-base mt-1">기능을 준비하고 있습니다</div>
              <div className="mt-1 text-sm text-center">곧 해당 기능을 만나보실 수 있도록 준비중이에요<br/>해당 기능이 준비되면 알림으로 알려드릴게요</div>
            </div>
          </div>
        </Modal> }
      </AnimatePresence>
      <div onClick={() => setSearchModal(true)} className="px-4 py-[10px] xl:flex hidden transition-all rounded-xl items-center justify-between cursor-pointer hover:bg-gray-100 active:bg-gray-200">
        <div className="flex items-center space-x-3">
          <svg className="stroke-lightgray-300 w-6 h-6" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <div className="text-[17.5px] font-bold text-lightgray-300">AI 검색</div>
        </div>
        <div className="flex space-x-1">
          <div className="border border-lightgray-100 bg-white px-[6px] drop-shadow-sm rounded-md text-sm text-lightgray-200">Ctrl</div>
          <div className="border border-lightgray-100 bg-white px-[6px] drop-shadow-sm rounded-md text-sm text-lightgray-200">K</div>
        </div>
      </div>
      <div onClick={() => setSearchModal(true)} className="px-3 justify-center py-[10px] xl:hidden transition-all rounded-xl flex items-center cursor-pointer hover:bg-gray-100 active:bg-gray-200 w-[50px]">
        <div className="flex items-center space-x-3">
          <svg className="stroke-lightgray-300 w-6 h-6" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
      </div>
    </>
  )
}