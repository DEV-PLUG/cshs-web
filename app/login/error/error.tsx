'use client';

import type { NextPage } from 'next'
import Head from 'next/head'
import { signIn, signOut } from "next-auth/react";
import { useEffect, useState } from 'react'
import Loading from '@components/loading';
import Link from 'next/link';

const Error: NextPage = () => {
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setSuccess(true);
  }, []);

  return (
    <div className='overflow-hidden'>
      <Head>
        <title>로그인</title>
      </Head>
      <div className="w-[100vw] h-[100vh] min-h-[800px] font-pretendard">
        <div style={{
          backgroundImage: 'linear-gradient(to top, #ffffff 0%, #bfdbfe 99%, #bfdbfe 100%)'
        }} className="w-full h-[100vh] bg-cover opacity-70 bg-opacity-0 overflow-hidden min-h-[800px]"></div>
        <div className='absolute z-20 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 h-[250px] w-[93vw] md:w-[400px] px-5 py-5 bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden'>
          <div className={ success === true ? "flex flex-col justify-center items-center overflow-hidden h-[210px] right-[400px] w-[80vw] md:w-[360px] absolute transition-all ease-[cubic-bezier(0.22, 1, 0.36, 1)] duration-500 mx-auto" : "flex flex-col justify-center items-center overflow-hidden h-[210px] right-0 relative w-[80vw] md:w-[360px] transition-all ease-[cubic-bezier(0.22, 1, 0.36, 1)] duration-500 mx-auto" }>
            <div className='font-bold text-center text-lg md:text-xl'>로그인을 완료하는 중</div>
            <div className='text-center text-sm md:text-base text-gray-500'>잠시 기다리면 로그인이 완료됩니다</div>
            <div className='text-center text-sm md:text-base text-gray-500'>이 창을 닫지 마세요</div>
            <div className='text-gray-500 mt-5'>
              <Loading size={25} />
            </div>
          </div>
          <div className={ success === true ? "flex flex-col justify-center items-center overflow-hidden h-[210px] left-0 w-[80vw] md:w-[360px] relative transition-all ease-[cubic-bezier(0.22, 1, 0.36, 1)] duration-500 mx-auto" : "flex flex-col justify-center items-center overflow-hidden h-[210px] left-[400px] absolute w-[80vw] md:w-[360px] transition-all ease-[cubic-bezier(0.22, 1, 0.36, 1)] duration-500 mx-auto" }>
            <svg className="w-14 h-14 fill-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            <div className='font-bold text-center text-lg md:text-xl mt-1'>학교 구성원이 아닙니다</div>
            <div className='text-center text-sm md:text-base text-gray-500 mt-1'>학교 구글 계정으로 로그인했는지 확인해주세요.<br/><Link href='/login'>
            <span className='cursor-pointer underline'>이곳을 눌러 다른 계정으로 로그인</span></Link></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Error