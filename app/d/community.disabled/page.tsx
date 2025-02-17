import Menu from "@components/menu";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen">
      <Menu/>
      <div className="h-[100vh] bg-white w-full md:border-l-[1px] border-lightgray-100 drop-shadow-2xl p-7 overflow-auto">
        <div className="flex justify-between w-full mb-8 px-3 pt-3">
          <div className="flex space-x-7 h-[46px] items-center">
            <Link href='/community'>
              <div className="font-bold text-3xl text-zinc-800 cursor-pointer">커뮤니티</div>
            </Link>
          </div>
          <div>
            <div className="bg-blue-500 hover:bg-blue-600 text-sm transition-all font-bold text-white justify-center h-[46px] w-[160px] py-3 flex items-center cursor-pointer rounded-[10px]">
              <svg className="w-5 h-5 mr-1" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              커뮤니티 생성하기
            </div>
          </div>
        </div>
        <div className="px-3">
          <div className="w-full h-[1px] my-5 bg-lightgray-100"></div>
        </div>
        <div className="mt-8 flex justify-between pr-3 space-x-5">
          <div className="w-full space-y-0">
            <Link href='/community/1234'>
              <div className="w-full relative group flex items-center justify-between py-3 px-3 cursor-pointer rounded-xl hover:bg-gray-50 transition-all">
                <div>
                  <div className="flex items-center space-x-5">
                    <div className="w-[50px] h-[50px] flex justify-center overflow-hidden items-center bg-lime-500 border-[1px] border-lime-600 rounded-[20px]">
                      <svg className="w-7 h-7 stroke-white" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                      </svg>
                    </div>
                    <div className="text-zinc-800 font-bold text-base">14기 소통 커뮤니티</div>
                    <div className="text-zinc-800 text-base">81명</div>
                  </div>
                </div>
                <div className="flex space-x-5 absolute right-3 transition-all">
                  <div className="text-white px-2 rounded-full text-sm bg-red-500">2</div>
                </div>
              </div>
            </Link>
            <Link href='/community/1234/1234'>
              <div className="w-full relative group flex items-center justify-between py-3 px-3 cursor-pointer rounded-xl hover:bg-gray-50 transition-all">
                <div>
                  <div className="flex items-center space-x-5">
                    <div className="w-[50px] h-[50px] flex justify-center overflow-hidden items-center bg-pink-500 border-[1px] border-pink-600 rounded-[20px]">
                      <svg className="w-7 h-7 stroke-white" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                      </svg>
                    </div>
                    <div className="text-zinc-800 font-bold text-base">1학년 1반</div>
                    <div className="text-zinc-800 text-base">21명</div>
                  </div>
                </div>
                <div className="flex space-x-5 absolute right-3 transition-all">
                  <div className="text-white px-2 rounded-full text-sm bg-red-500">2</div>
                </div>
              </div>
            </Link>
            <Link href='/community/1234'>
              <div className="w-full relative group flex items-center justify-between py-3 px-3 cursor-pointer rounded-xl hover:bg-gray-50 transition-all">
                <div>
                  <div className="flex items-center space-x-5">
                    <div className="w-[50px] h-[50px] flex justify-center overflow-hidden items-center bg-blue-500 border-[1px] border-blue-600 rounded-[20px]">
                      <svg className="w-7 h-7 stroke-white" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                      </svg>
                    </div>
                    <div className="text-zinc-800 font-bold text-base">14기 키이스트</div>
                    <div className="text-zinc-800 text-base">9명</div>
                  </div>
                </div>
                <div className="flex space-x-5 absolute right-3 transition-all">
                  <div className="text-white px-2 rounded-full text-sm bg-red-500">2</div>
                </div>
              </div>
            </Link>
          </div>
          <div className="w-[350px] space-y-3">
            <div className="border border-lightgray-100 rounded-2xl w-[350px] px-5 py-5">
              <div className="font-bold text-zinc-800">최근 업로드</div>
              <div className="text-lightgray-200 mt-2">없음</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
