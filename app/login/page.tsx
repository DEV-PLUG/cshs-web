import type { NextPage } from 'next'
import Login from './login';
import { Metadata } from "next";

export const metadata:Metadata = {
  title: '로그인',
}

const Home: NextPage = () => {
  return (
    <div>
      <Login/>
    </div>
  )
}

export default Home