'use client';

import Button from "@components/button";

export default function PasscardModal({ fn }:{ fn:()=>void }) {
  return (
    <div className="w-full md:w-[380px] h-[520px]">
      <div className="absolute w-full h-[200px] -m-5 rounded-t-xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center space-x-5">
          <div className="w-[60px] h-[60px] flex items-center justify-center bg-blue-50 rounded-full">
            <div className="text-4xl tossface">🪪</div>
          </div>
          <div className="w-[100px] h-1 rounded-full bg-gradient-to-r from-blue-200/70 to-green-200/70"></div>
          <div className="w-[60px] h-[60px] flex items-center justify-center bg-green-100 rounded-full">
            <svg className="stroke-green-500 w-[35px] h-[35px]" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between h-full pb-0">
        <div className="mt-[200px]">
          <div className="font-bold text-2xl">패스카드로 활동 승인 여부를<br/>빠르게 확인하세요</div>
          <div className="text-base text-lightgray-200 mt-2">패스카드는 활동이 승인된 학생이 인원 점검 시<br/>자신의 기기로 직접 제시하는 카드입니다.<br/><br/>활동이 승인되어 있는 교시에만 패스카드가 자동으로 활성화되므로,  담당교사는 패스카드만으로 해당 학생의 활동 승인 여부를 판단할 수 있습니다.</div>
        </div>
        <Button color="blue" fn={fn}>
          확인 후, 다시 보지 않기
        </Button>
      </div>
    </div>
  )
}