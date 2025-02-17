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
            <Link href='/dormitory'>
              <div className="font-bold text-3xl text-zinc-800 cursor-pointer">기숙사</div>
            </Link>
            <Link href='/dormitory/list'>
              <div className="font-bold text-3xl text-lightgray-100 cursor-pointer">내역</div>
            </Link>
          </div>
        </div>
        <div className="w-full h-[1px] my-5 bg-lightgray-100"></div>
        <div className="mt-8 flex justify-between space-x-5">
          <div className="w-full space-y-10">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-2xl text-zinc-800">요청하기</div>
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
                      </th>
                      <th scope="col" className="px-6 py-3 !font-medium">
                      </th>
                      <th scope="col" className="px-6 py-3 !font-medium">
                        요청하기
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white hover:bg-gray-50 transition-all cursor-pointer border-b text-zinc-800 dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-6 py-2">
                        수리 요청
                      </td>
                      <td className="px-6 py-2">
                        기숙사 사감 선생님
                      </td>
                      <td className="px-6 py-2">
                      </td>
                      <td className="px-6 py-2">
                      </td>
                      <td className="px-6 py-2">
                        <div className="bg-blue-500 hover:bg-blue-600 text-sm transition-all font-bold text-white justify-center w-[140px] py-3 flex items-center cursor-pointer rounded-[10px]">
                          <svg className="w-5 h-5 mr-2" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                          </svg>
                          요청하기
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-2xl text-zinc-800">보고하기</div>
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
                        조건
                      </th>
                      <th scope="col" className="px-6 py-3 !font-medium">
                        보고 시간
                      </th>
                      <th scope="col" className="px-6 py-3 !font-medium">
                        보고하기
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white hover:bg-gray-50 transition-all cursor-pointer border-b text-zinc-800 dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-6 py-2">
                        귀교 보고
                      </td>
                      <td className="px-6 py-2">
                        기숙사 사감 선생님
                      </td>
                      <td className="px-6 py-2">
                        학교 주변 100m 이내
                      </td>
                      <td className="px-6 py-2">
                        주중: 오후 04시 00분 ~ 오후 6시 00분<br/>
                        주말: 오후 01시 00분 ~ 오후 3시 00분
                      </td>
                      <td className="px-6 py-2">
                        <div className="bg-blue-500 hover:bg-blue-600 text-sm transition-all font-bold text-white justify-center w-[140px] py-3 flex items-center cursor-pointer rounded-[10px]">
                          <svg className="w-5 h-5 mr-2" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                          </svg>
                          보고하기
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
