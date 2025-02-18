import Button, { SubButton } from '@components/button';
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <div className='overflow-hidden'>
      <Head>
        <title>페이지를 찾을 수 없음</title>
      </Head>
      <div className="w-[90vw] md:w-[93vw] xl:w-[1000px] font-pretendard h-screen overflow-visible">
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-5'>
          <div className='text-center flex items-center justify-center flex-col text-gray-500'>
            <div>
              <svg className='text-gray-500 w-10 h-10' fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.25V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V8.25m-18 0V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v2.25m-18 0h18M5.25 6h.008v.008H5.25V6zM7.5 6h.008v.008H7.5V6zm2.25 0h.008v.008H9.75V6z" />
              </svg>
            </div>
            <div className='text-xl font-bold mt-2'>페이지를 찾을 수 없습니다</div>
            <div className='mt-0'>회원님께서 요청하신 페이지가 존재하지 않습니다</div>
            <div className='mb-2'>URL을 다시 한번 확인해주시기 바랍니다</div>
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