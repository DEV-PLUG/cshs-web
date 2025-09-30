'use client';

export default function Shit() {
  return (
    <div className="px-2 pt-1">
      <div className="flex space-x-1 items-center">
        <div className="w-[25px] h-[25px] relative flex justify-center items-center bg-gray-100 border-[1px] border-lightgray-100 rounded-lg">
          <svg className="w-5 h-5 fill-gray-300 stroke-gray-300" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"></path>
          </svg>
        </div>
        <div className="text-sm font-bold">유현호</div>
        <div className="text-sm text-lightgray-300">·</div>
        <div className="text-sm text-lightgray-300">?시간 전</div>
      </div>
      <div className="font-bold text-lg my-1">
        제목제목제목
      </div>
      <div>
        내용내용내용내용<br/>내용용용용
      </div>
    </div>
  )
}