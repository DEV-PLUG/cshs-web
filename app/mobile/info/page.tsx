'use client';

import { OpacityAnimation } from "@components/animation";
import Loading from "@components/loading";
import MobileBottomMenu from "@components/menu/mobile";

export default function Code() {
  return (
    <div>
      <MobileBottomMenu/>
      <OpacityAnimation>
        <div className="flex items-center justify-center flex-col w-[100vw] h-[100vh]">
          <div className="text-center text-zinc-800 font-bold text-2xl md:text-3xl">전자 활동 승인서 모바일</div>
          <div className="text-center text-lightgray-200">ⓒ 2025. JiHwan Choi. all rights reserved.</div>
        </div>
      </OpacityAnimation>
    </div>
  );
}
