'use client';

import Button, { SubButton } from '@components/button';
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <div className='overflow-hidden'>
      <Head>
        <title>오류가 발생함</title>
      </Head>
      <div className="w-[90vw] md:w-[93vw] xl:w-[1000px] font-pretendard h-screen overflow-visible">
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-5'>
          <div className='text-center flex items-center justify-center flex-col text-gray-500 dark:text-gray-400'>
            <div>
              <svg className='text-gray-500 dark:text-gray-400 w-10 h-10' fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div className='text-xl font-bold mt-2'>오류가 발생하였습니다</div>
            <div className='mt-0'>알 수 없는 오류로 인해 불편을 드려 죄송합니다</div>
            <div className='mb-5'>이러한 오류가 지속된다면 관리자에게 문의해주시기 바랍니다</div>
            <Link href='/d/home'>
              <div>
                <SubButton color='lightblue'>홈으로 돌아가기</SubButton>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home