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
            <Link href='/survey'>
              <div className="font-bold text-3xl text-lightgray-100 cursor-pointer">설문조사</div>
            </Link>
            <Link href='/survey/list'>
              <div className="font-bold text-3xl text-zinc-800 cursor-pointer">내역</div>
            </Link>
          </div>
        </div>
        <div className="w-full h-[1px] mt-0 bg-lightgray-100"></div>
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
          <div className="w-full space-y-10">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-2xl text-zinc-800">제출 마감 전 내역 <span className="text-blue-500">1</span></div>
              </div>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-sm text-lightgray-200 bg-gray-50/50 border-t border-b border-lightgray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 !font-medium">
                        내용
                      </th>
                      <th scope="col" className="px-6 py-3 !font-medium">
                        담당 교사
                      </th>
                      <th scope="col" className="px-6 py-3 !font-medium">
                        대상
                      </th>
                      <th scope="col" className="px-6 py-3 !font-medium">
                      </th>
                      <th scope="col" className="px-6 py-3 !font-medium">
                        내 답변
                      </th>
                      <th scope="col" className="px-6 py-3 !font-medium">
                        수정하기
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white hover:bg-gray-50 transition-all cursor-pointer border-b text-zinc-800 dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-6 py-2">
                        ESG 영상 인기투표
                      </td>
                      <td className="px-6 py-2">
                        담당 교사
                      </td>
                      <td className="px-6 py-2">
                        전체 구성원
                      </td>
                      <td className="px-6 py-2">
                      </td>
                      <td className="px-6 py-2">
                        <div className="bg-blue-500 hover:bg-blue-600 text-sm transition-all font-bold text-white justify-center w-[140px] py-3 flex items-center cursor-pointer rounded-[10px]">
                          내 답변 확인하기
                        </div>
                      </td>
                      <td className="px-6 py-2">
                        <div className="bg-blue-500 hover:bg-blue-600 text-sm transition-all font-bold text-white justify-center w-[140px] py-3 flex items-center cursor-pointer rounded-[10px]">
                          <svg className="w-5 h-5 mr-2" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                          수정하기
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-2xl text-zinc-800">제출 마감된 내역</div>
              </div>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-sm text-lightgray-200 bg-gray-50/50 border-t border-b border-lightgray-100">
                    <tr>
                        <th scope="col" className="px-6 py-3 !font-medium">
                          내용
                        </th>
                        <th scope="col" className="px-6 py-3 !font-medium">
                          담당 교사
                        </th>
                        <th scope="col" className="px-6 py-3 !font-medium">
                          대상
                        </th>
                        <th scope="col" className="px-6 py-3 !font-medium">
                        </th>
                        <th scope="col" className="px-6 py-3 !font-medium">
                          내 답변
                        </th>
                        <th scope="col" className="px-6 py-3 !font-medium">
                          결과
                        </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white hover:bg-gray-50 transition-all cursor-pointer border-b text-zinc-800 dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-6 py-2">
                        ESG 영상 인기투표
                      </td>
                      <td className="px-6 py-2">
                        담당 교사
                      </td>
                      <td className="px-6 py-2">
                        전체 구성원
                      </td>
                      <td className="px-6 py-2">
                      </td>
                      <td className="px-6 py-2">
                        <div className="bg-blue-500 hover:bg-blue-600 text-sm transition-all font-bold text-white justify-center w-[140px] py-3 flex items-center cursor-pointer rounded-[10px]">
                          내 답변 확인하기
                        </div>
                      </td>
                      <td className="px-6 py-2">
                        <div className="bg-blue-500 hover:bg-blue-600 text-sm transition-all font-bold text-white justify-center w-[140px] py-3 flex items-center cursor-pointer rounded-[10px]">
                          결과 보기
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* <div className="w-[350px] space-y-3"></div> */}
        </div>
      </div>
    </main>
  );
}
