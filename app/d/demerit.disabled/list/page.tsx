import Menu from "@components/menu";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen">
      <Menu/>
      <div className="h-[100vh] bg-white w-full md:border-l-[1px] border-lightgray-100 drop-shadow-2xl p-10 overflow-auto">
        <div className="flex justify-between w-full mb-8">
          <div className="flex space-x-7 h-[46px] items-center">
            <Link href='/demerit'>
              <div className="font-bold text-3xl text-lightgray-100 cursor-pointer">벌점</div>
            </Link>
            <Link href='/demerit/list'>
              <div className="font-bold text-3xl text-zinc-800 cursor-pointer">내역</div>
            </Link>
          </div>
        </div>
        <div className="w-full h-[1px] mt-5 bg-lightgray-100"></div>
        <div className="flex justify-between my-2">
          <div className="flex space-x-2">
            <div className="flex rounded-full px-1 py-1 bg-gray-100 text-sm">
              <div className="rounded-full w-[50px] py-1 bg-white font-bold text-zinc-800 text-center cursor-pointer">일</div>
              <div className="rounded-full w-[50px] py-1 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-all">주</div>
              <div className="rounded-full w-[50px] py-1 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-all">월</div>
            </div>
            <div className="flex rounded-full px-1 py-1 border border-lightgray-100 text-sm space-x-2">
              <div className="rounded-full flex items-center justify-center w-[30px] py-1 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-all">
                <svg className="w-4 h-4 stroke-lightgray-200" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </div>
              <div className="flex flex-col items-center justify-center text-zinc-800">2024-05-02 (금)</div>
              <div className="rounded-full flex items-center justify-center w-[30px] py-1 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-all">
                <svg className="w-4 h-4 stroke-lightgray-200" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex space-x-1 -my-3 items-center">
            <div className="px-2 py-2 hover:bg-gray-100 transition-all rounded-md cursor-pointer">
              <svg className="w-5 h-5 stroke-lightgray-200" fill="none" strokeWidth={2.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <div className="px-2 py-2 hover:bg-gray-100 transition-all rounded-md cursor-pointer">
              <svg className="w-5 h-5 stroke-lightgray-200" fill="none" strokeWidth={2.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
              </svg>
            </div>
            <div className="px-2 py-2 hover:bg-gray-100 flex items-center cursor-pointer text-lightgray-200 space-x-2 text-sm font-bold transition-all rounded-md">
              <svg className="w-5 h-5 stroke-lightgray-200" fill="none" strokeWidth={2.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
              </svg>
              <div>필터</div>
            </div>
          </div>
        </div>
        <div className="w-full h-[1px] mb-5 bg-lightgray-100"></div>
        <div className="mt-8 flex justify-between space-x-5">
          <div className="relative overflow-x-auto w-full">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-sm text-lightgray-200 bg-gray-50/50 border-t border-b border-lightgray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 !font-medium">
                    카테고리
                  </th>
                  <th scope="col" className="px-6 py-3 !font-medium">
                    유형
                  </th>
                  <th scope="col" className="px-6 py-3 !font-medium">
                    내용
                  </th>
                  <th scope="col" className="px-6 py-3 !font-medium">
                    벌점
                  </th>
                  <th scope="col" className="px-6 py-3 !font-medium">
                    일시
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white hover:bg-gray-50 transition-all cursor-pointer border-b text-zinc-800">
                  <td className="px-6 py-4">
                    기숙사
                  </td>
                  <td className="px-6 py-4">
                    벌점 추가
                  </td>
                  <td className="px-6 py-4">
                    소등
                  </td>
                  <td className="px-6 py-4">
                    +0.5점
                  </td>
                  <td className="px-6 py-4">
                    2024-03-06 (금) 오후 02:14
                  </td>
                </tr>
                <tr className="bg-white hover:bg-gray-50 transition-all cursor-pointer border-b text-zinc-800">
                  <td className="px-6 py-4">
                    기숙사
                  </td>
                  <td className="px-6 py-4">
                    벌점 삭제
                  </td>
                  <td className="px-6 py-4">
                    봉사
                  </td>
                  <td className="px-6 py-4">
                    -0.5점
                  </td>
                  <td className="px-6 py-4">
                    2024-03-06 (금) 오후 02:14
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* <div className="w-[350px] space-y-3"></div> */}
        </div>
      </div>
    </main>
  );
}
