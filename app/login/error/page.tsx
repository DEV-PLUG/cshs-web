import type { NextPage } from 'next'
import Error from './error';
import { Metadata } from "next";
import { Suspense } from 'react';

export const metadata:Metadata = {
  title: '로그인',
}

const Home: NextPage = () => {
  return (
    <div>
      <Suspense>
        <Error/>
      </Suspense>
    </div>
  )
}

export default Home