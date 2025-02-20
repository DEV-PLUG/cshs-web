'use client';

import Button from "@components/button";
import Image from 'next/image';

export default function ClassroomModal({ fn }:{ fn:()=>void }) {
  return (
    <div className="w-full md:w-[380px] h-[520px]">
      <div className="absolute w-full h-[200px] bg-gradient-to-b from-gray-200 to-white -m-5 rounded-t-xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center space-x-5">
          <div className="w-[60px] h-[60px] flex items-center justify-center bg-lightgray-100 rounded-full">
            <Image src="/images/classroom/classroom-square-logo.png" width={35} height={35} alt="Classroom Logo" />
          </div>
          <div className="w-[100px] h-1 rounded-full bg-gradient-to-r from-lightgray-200/70 to-lightgray-100"></div>
          <div className="w-[60px] h-[60px] flex items-center justify-center bg-lightgray-100 rounded-full">
            <svg className="stroke-gray-500 w-[35px] h-[35px]" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between h-full pb-0">
        <div className="mt-[200px]">
          <div className="font-bold text-2xl">클래스룸에서<br/>게시물을 작성하셨나요?</div>
          <div className="text-base text-lightgray-200 mt-2">클래스룸에서 게시물을 작성한 경우<br/>할 일을 따로 보내지 않아도 됩니다.<br/><br/>AI가 클래스룸 게시물을 분석하고<br/>자동으로 구성원의 할 일로 등록합니다.</div>
        </div>
        <Button color="blue" fn={fn}>
          확인 후, 다시 보지 않기
        </Button>
      </div>
    </div>
  )
}