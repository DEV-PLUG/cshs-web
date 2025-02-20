'use client';

import Button from "@components/button";
import baseURL from "@libs/client/base-url";
import Image from 'next/image';
import Link from "next/link";

export default function ClassroomConnectModal() {
  const ouathURL = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${baseURL}/oauth/classroom&prompt=consent&response_type=code&client_id=991008680132-h2e5f4e590opnvcjlm6e4u2605aq8fqm.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fclassroom.announcements.readonly+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fclassroom.courses.readonly+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fclassroom.rosters.readonly+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fclassroom.coursework.me.readonly&access_type=offline`

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
          <div className="font-bold text-2xl">클래스룸 연결하기</div>
          <div className="text-base text-lightgray-200 mt-2">클래스룸을 연결하면 할 일을 직접 등록하지 않아도 됩니다.<br/>AI가 알아서 해야할 일을 알려주고,<br/>수업 교체 소식과 수행평가 일정을 알려줍니다.</div>
        </div>
        <div className='w-full space-x-2 flex items-start py-2 px-3 rounded-xl bg-gray-100 transition-all mt-10'>
          <div className='text-2xl tossface'>🛡️</div>
          <div>
            <div className='text-lightgray-200 text-sm'>
              모든 인증 정보는 암호화되며, 전자 활승은 평가(점수)<br/> 관련 정보를 저장하거나 수정할 권한이 없습니다.<br/>
              {/* <span className="text-lightgray-300 flex items-center mt-1">
                보안을 위한 전자 활동 승인서의 노력 알아보기
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path clipRule="evenodd" fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" />
                </svg>
              </span> */}
            </div>
          </div>
        </div>
        <Link href={ouathURL}>
          <Button color="blue">
            클래스룸 계정 연결하기
          </Button>
        </Link>
      </div>
    </div>
  )
}