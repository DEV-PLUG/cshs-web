import type { NextPage } from 'next'
import Success from './success';
import { Metadata } from "next";

export const metadata:Metadata = {
  title: '로그인',
}

const Home: NextPage = () => {
  return (
    <div>
      <Success/>
    </div>
  )
}

export default Home