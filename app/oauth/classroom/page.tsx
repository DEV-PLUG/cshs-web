'use client';

import { OpacityAnimation } from "@components/animation";
import { SubButton } from "@components/button";
import Loading from "@components/loading";
import baseURL from "@libs/client/base-url";
import { setNotification } from "@libs/client/redux/notification";
import { CircularProgress } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, use, useEffect, useState } from "react";
import { Metadata } from "next";
import Head from "next/head";

export default function HomeContainer() {
  return (
    <Suspense>
      <Home/>
    </Suspense>
  )
}

function Home() {
  const[step, setStep] = useState(0);
  const searchParams = useSearchParams();

  useEffect(() => {
    if(!searchParams.get('scope')) return;
    // console.log(searchParams.get('scope')?.split(' '))

    if(!searchParams.get('scope')?.split(' ').includes('https://www.googleapis.com/auth/classroom.announcements.readonly') || !searchParams.get('scope')?.split(' ').includes('https://www.googleapis.com/auth/classroom.courses.readonly') || !searchParams.get('scope')?.split(' ').includes('https://www.googleapis.com/auth/classroom.rosters.readonly') || (!searchParams.get('scope')?.split(' ').includes('https://www.googleapis.com/auth/classroom.coursework.me.readonly') && !searchParams.get('scope')?.split(' ').includes('https://www.googleapis.com/auth/classroom.student-submissions.me.readonly'))) {
      setStep(1);
    }
    else if(searchParams.get('error')) {
      setStep(2);
    }
    else if(searchParams.get('code')) {
      setStep(0);
      fetch('/api/oauth/classroom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: searchParams.get('code')
        })
      })
      .then((response) => response.json())
      .then((response) => {
        if(response.success === true) {
          // window.location.href = '/d/home';
          setStep(3);
        } else {
          setStep(2);
        }
      });
    }
  }, [searchParams]);

  const ouathURL = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${baseURL}/oauth/classroom&prompt=consent&response_type=code&client_id=991008680132-h2e5f4e590opnvcjlm6e4u2605aq8fqm.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fclassroom.announcements.readonly+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fclassroom.courses.readonly+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fclassroom.rosters.readonly+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fclassroom.coursework.me.readonly&access_type=offline`

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Head>
        <title>클래스룸 계정 연결</title>
      </Head>
      { step === 0 && <OpacityAnimation>
        <div>
          <div className="flex items-center justify-center space-x-5">
            <div className="w-[80px] h-[80px] flex items-center justify-center bg-gray-100 rounded-full">
              <Image src="/images/classroom/classroom-square-logo.png" width={45} height={45} alt="Classroom Logo" />
            </div>
            <div className="w-[100px] h-1 rounded-full bg-gradient-to-r from-lightgray-200/70 to-lightgray-100"></div>
            <div className="w-[80px] h-[80px] flex items-center justify-center bg-gray-100 rounded-full">
              <svg className="stroke-gray-500 w-[45px] h-[45px]" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
              </svg>
            </div>
          </div>
          <div className="text-lightgray-200 my-5">
            <div className="text-center">클래스룸 계정을 연결하는 중</div>
            <div className="text-center">계정을 연결하는 동안 잠시 기다려 주세요</div>
          </div>
          <div className="flex items-center justify-center text-blue-500 space-x-3">
            <CircularProgress color="inherit" size={20} />
            <div className="text-black">토큰 정보를 전송하는 중</div>
          </div>
        </div>
      </OpacityAnimation> }
      { step === 1 && <OpacityAnimation>
        <div>
          <div className="flex items-center justify-center space-x-5">
            <div className="w-[80px] h-[80px] flex items-center justify-center bg-gray-100 rounded-full">
              <Image src="/images/classroom/classroom-square-logo.png" width={45} height={45} alt="Classroom Logo" />
            </div>
            <div className="w-[100px] h-1 rounded-full bg-gradient-to-r from-lightgray-200/70 to-lightgray-100"></div>
            <div className="w-[80px] h-[80px] flex items-center justify-center bg-gray-100 rounded-full">
              <svg className="stroke-lightgray-200 w-[45px] h-[45px]" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
              </svg>
            </div>
          </div>
          <div className="text-lightgray-200 mt-5 mb-10">
            <div className="text-center">클래스룸 계정을 다시 연결해주세요</div>
            <div className="text-center">요청하는 모든 권한을 허용해야 전체 기능을 원할하게 이용할 수 있습니다</div>
            <div className="flex items-center justify-center mt-3">
              <a href={ouathURL}>
                <SubButton color="lightblue">
                  다시 연결하기
                </SubButton>
              </a>
              {/* Google Secure Policy에 의해 Link 태그 사용 제한 */}
            </div>
          </div>
          <div className='w-[550px] space-x-3 flex items-start py-5 px-5 rounded-3xl bg-gray-100 transition-all'>
            <div className='text-4xl tossface'>🛡️</div>
            <div>
              <div className='text-lg font-bold'>보안 및 개인 정보 보호</div>
              <div className='text-gray-500 text-sm'>전자 활승은 구글에서 지정한 민감하지 않은 범위의<br/> 데이터에 한하여 최소한의 권한을 요청합니다.<br/><br/>모든 인증 정보는 암호화되어 전송 및 보관되며, 어떠한 경우에도 클래스룸에서<br/> 평가(점수) 관련 데이터를 저장하거나 수정할 권한을 가지지 않습니다.</div>
            </div>
          </div>
        </div>
      </OpacityAnimation> }
      { step === 2 && <OpacityAnimation>
        <div>
          <div className="flex items-center justify-center space-x-5">
            <div className="w-[80px] h-[80px] flex items-center justify-center bg-gray-100 rounded-full">
              <Image src="/images/classroom/classroom-square-logo.png" width={45} height={45} alt="Classroom Logo" />
            </div>
            <div className="w-[100px] h-1 rounded-full bg-gradient-to-r from-lightgray-200/70 to-lightgray-100"></div>
            <div className="w-[80px] h-[80px] flex items-center justify-center bg-gray-100 rounded-full">
              <svg className="stroke-lightgray-200 w-[45px] h-[45px]" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
              </svg>
            </div>
          </div>
          <div className="text-lightgray-200 mt-5 mb-10">
            <div className="text-center">클래스룸 계정을 다시 연결해주세요</div>
            <div className="text-center">오류가 발생하여 클래스룸 계정 연결에 실패했습니다</div>
            <div className="flex items-center justify-center mt-3">
              <a href={ouathURL}>
                <SubButton color="lightblue">
                  다시 연결하기
                </SubButton>
              </a>
              {/* Google Secure Policy에 의해 Link 태그 사용 제한 */}
            </div>
          </div>
          <div className='w-[550px] space-x-3 flex items-start py-5 px-5 rounded-3xl bg-gray-100 transition-all'>
            <div className='text-4xl tossface'>🛡️</div>
            <div>
              <div className='text-lg font-bold'>보안 및 개인 정보 보호</div>
              <div className='text-gray-500 text-sm'>전자 활승은 구글에서 지정한 민감하지 않은 범위의<br/> 데이터에 한하여 최소한의 권한을 요청합니다.<br/><br/>모든 인증 정보는 암호화되어 전송 및 보관되며, 어떠한 경우에도 클래스룸에서<br/> 평가(점수) 관련 데이터를 저장하거나, 수정할 권한을 가지지 않습니다.</div>
            </div>
          </div>
        </div>
      </OpacityAnimation> }
      { step === 3 && <OpacityAnimation>
        <div>
          <div className="flex items-center justify-center space-x-5">
            <div className="w-[80px] h-[80px] flex items-center justify-center bg-gray-100 rounded-full">
              <Image src="/images/classroom/classroom-square-logo.png" width={45} height={45} alt="Classroom Logo" />
            </div>
            <div className="w-[100px] h-1 rounded-full bg-gradient-to-r from-lightgray-200/70 to-lightgray-100"></div>
            <div className="w-[80px] h-[80px] flex items-center justify-center bg-gray-100 rounded-full">
              <svg className="stroke-gray-500 w-[45px] h-[45px]" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
              </svg>
            </div>
          </div>
          <div className="text-lightgray-200 my-5">
            <div className="text-center">클래스룸 계정을 연결했습니다.</div>
            <div className="text-center">이제 할 일과 수업 교체, 수행평가 일정을 Glassy AI가 알려드릴게요</div>
          </div>
          <div className="flex items-center justify-center text-blue-500 space-x-3">
            <Link href='/d/home'>
              <SubButton color="lightblue">
                홈으로 이동하기
              </SubButton>
            </Link>
          </div>
        </div>
      </OpacityAnimation> }
    </div>
  )
}