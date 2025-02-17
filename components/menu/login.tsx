'use client';

import { useEffect } from "react";
import { signIn } from "next-auth/react";

export default function SignInButton() {
  return (
    <div onClick={() => signIn('google')} className="px-4 py-[10px] transition-all rounded-xl flex items-center justify-between cursor-pointer hover:bg-gray-100 active:bg-gray-200">
      <div className="flex items-center space-x-3">
        <svg className="stroke-gray-500 w-6 h-6" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        {/* <svg className="stroke-zinc-800 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path clipRule="evenodd" fillRule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" />
        </svg> */}
        <div className="text-[17.5px] font-bold text-gray-500">계속하려면 로그인하세요.</div>
      </div>
      <div className="flex space-x-1">
      </div>
    </div>
  )
}