'use client';

import { OpacityAnimation } from "@components/animation";
import Loading from "@components/loading";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Code() {
  const [status, setStatus] = useState(0);
  const [code, setCode] = useState("");

  const getCode = async () => {
    await fetch("/api/user/mobile/verification-code", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => response.json())
    .then((response) => {
      console.log(response)
      if(response.success === true) {
        setCode(response.code);
        setStatus(1);
      } else {
        if(response.message === "Unauthorized") {
          location.href = '/login?callbackUrl=/mobile/login';
          // setStatus(2);
        } else {
          setStatus(2);
        }
      }
    });
  }
  useEffect(() => {
    getCode();
  }, []);

  return (
    <div>
      { status === 0 && <div className="flex items-center justify-center flex-col w-[100vw] h-[100vh]">
        <div className="text-blue-500 relative flex justify-center items-center flex-col">
          <Loading size={35}/>
          <div className="text-center text-lightgray-200 mt-3">잠시 기다려주세요</div>
        </div>
      </div> }
      { status === 1 && <OpacityAnimation>
        <div className="flex items-center justify-center flex-col w-[100vw] h-[100vh]">
          <div className="text-center text-zinc-800 font-bold text-2xl md:text-3xl">모바일 앱 로그인</div>
          <div className="text-center text-lightgray-200">아래 코드를 기억하고, 이 창을 닫으세요</div>
          <div className="flex items-center mt-5 space-x-1 md:space-x-2">
            <div className="flex items-center justify-center text-center text-2xl md:text-4xl font-bold bg-gray-100 md:w-[60px] md:h-[80px] w-[50px] h-[60px] rounded-xl">{code[0]}</div>
            <div className="flex items-center justify-center text-center text-2xl md:text-4xl font-bold bg-gray-100 md:w-[60px] md:h-[80px] w-[50px] h-[60px] rounded-xl">{code[1]}</div>
            <div className="flex items-center justify-center text-center text-2xl md:text-4xl font-bold bg-gray-100 md:w-[60px] md:h-[80px] w-[50px] h-[60px] rounded-xl">{code[2]}</div>
            <div className="flex items-center justify-center text-center text-2xl md:text-4xl font-bold bg-gray-100 md:w-[60px] md:h-[80px] w-[50px] h-[60px] rounded-xl">{code[3]}</div>
            <div className="flex items-center justify-center text-center text-2xl md:text-4xl font-bold bg-gray-100 md:w-[60px] md:h-[80px] w-[50px] h-[60px] rounded-xl">{code[4]}</div>
            <div className="flex items-center justify-center text-center text-2xl md:text-4xl font-bold bg-gray-100 md:w-[60px] md:h-[80px] w-[50px] h-[60px] rounded-xl">{code[5]}</div>
          </div>
          <div className="text-center text-sm mt-7 text-red-500">이 코드를 타인에게 공유하지 마십시오</div>
        </div>
      </OpacityAnimation> }
      { status === 2 && <div className="flex items-center justify-center flex-col w-[100vw] h-[100vh]">
        <div className="relative flex justify-center items-center flex-col">
          <svg className="w-14 h-14 fill-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          <div className="text-center text-zinc-800 font-bold text-2xl md:text-3xl mt-5">창을 다시 열어주세요</div>
          <div className="text-center text-lightgray-200">서버가 부하를 겪어 일시적 장애가 발생했습니다<br/>잠시 후 창을 다시 열어주세요</div>
        </div>
      </div> }
    </div>
  );
}
