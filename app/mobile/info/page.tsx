'use client';

import { OpacityAnimation } from "@components/animation";
import Loading from "@components/loading";
import MobileBottomMenu from "@components/menu/mobile";
import ProfileMenu from "@components/menu/profile";

export default function Code() {
  return (
    <div>
      <MobileBottomMenu/>
      <OpacityAnimation>
        <ProfileMenu/>
        {/* <div className="flex items-center justify-center flex-col w-[100vw] h-[100vh]">
          <div className="text-center text-zinc-800 font-bold text-2xl md:text-3xl">전자 활동 승인서 모바일</div>
          <div className="text-center text-lightgray-200">ⓒ 2025. JiHwan Choi. all rights reserved.</div>
        </div> */}
        <div className="fixed text-lightgray-200 text-sm bottom-20 px-5">
          <div>
            <div className="flex items-start space-x-1">
              <div>
                개발: 
              </div>
              <div>
                <a className="underline" target="_blank" href="https://github.com/DEV-PLUG">14기 최지환</a>
              </div>
            </div>
            <div className="flex items-start space-x-1">
              <div>
                운영: 
              </div>
              <div>
                13기 - 김준희, 박찬경, 이재준<br/>
                14기 - 성인혁, 지민겸<br/>
                15기 - 권승찬
              </div>
            </div><br/><br/>
            창원과학고등학교 전자 활동 승인서
          </div>
        </div>
      </OpacityAnimation>
    </div>
  );
}
