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
            <Link href='/booking'>
              <div className="font-bold text-3xl text-zinc-800 cursor-pointer">예약</div>
            </Link>
            <Link href='/booking/list'>
              <div className="font-bold text-3xl text-lightgray-100 cursor-pointer">내역</div>
            </Link>
          </div>
        </div>
        <div className="w-full h-[1px] my-5 bg-lightgray-100"></div>
        <div className="mt-8 flex justify-between space-x-5">
          <div className="w-full space-y-10">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-2xl text-zinc-800">예약하기</div>
              </div>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-sm text-lightgray-200 bg-gray-50/50 border-t border-b border-lightgray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 !font-medium">
                        예약 대상
                      </th>
                      <th scope="col" className="px-6 py-3 !font-medium">
                        내용
                      </th>
                      <th scope="col" className="px-6 py-3 !font-medium">
                        담당 교사
                      </th>
                      <th scope="col" className="px-6 py-3 !font-medium">
                        승인 유형
                      </th>
                      <th scope="col" className="px-6 py-3 !font-medium">
                        장소
                      </th>
                      <th scope="col" className="px-6 py-3 !font-medium">
                        이용 시간
                      </th>
                      <th scope="col" className="px-6 py-3 !font-medium">
                        예약 시간
                      </th>
                      <th scope="col" className="px-6 py-3 !font-medium">
                        예약하기
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white hover:bg-gray-50 transition-all cursor-pointer border-b text-zinc-800 dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-6 py-2">
                        전자현미경
                      </td>
                      <td className="px-6 py-2">
                        전자현미경 실험 관련 예약
                      </td>
                      <td className="px-6 py-2">
                        이규호
                      </td>
                      <td className="px-6 py-2">
                        검토 후 승인
                      </td>
                      <td className="px-6 py-2">
                        첨단기자재실
                      </td>
                      <td className="px-6 py-2">
                        오전 9시 ~ 오후 6시
                      </td>
                      <td className="px-6 py-2">
                        최소 이용 1일 전
                      </td>
                      <td className="px-6 py-2">
                        <div className="bg-blue-500 hover:bg-blue-600 text-sm transition-all font-bold text-white justify-center w-[140px] py-3 flex items-center cursor-pointer rounded-[10px]">
                          <svg className="w-5 h-5 mr-2" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                          </svg>
                          예약하기
                        </div>
                      </td>
                    </tr>
                    <tr className="bg-white hover:bg-gray-50 transition-all cursor-pointer border-b text-zinc-800 dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-6 py-2">
                        AI솦창의랩 스터디실
                      </td>
                      <td className="px-6 py-2">
                        스터디실 사용 예약
                      </td>
                      <td className="px-6 py-2">
                        박정희
                      </td>
                      <td className="px-6 py-2">
                        자동 승인
                      </td>
                      <td className="px-6 py-2">
                        AI솦창의랩
                      </td>
                      <td className="px-6 py-2">
                        오전 9시 ~ 오후 6시
                      </td>
                      <td className="px-6 py-2">
                        이용 당일부터
                      </td>
                      <td className="px-6 py-2">
                        <div className="bg-blue-500 hover:bg-blue-600 text-sm transition-all font-bold text-white justify-center w-[140px] py-3 flex items-center cursor-pointer rounded-[10px]">
                          <svg className="w-5 h-5 mr-2" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                          </svg>
                          예약하기
                        </div>
                      </td>
                    </tr>
                    <tr className="bg-white hover:bg-gray-50 transition-all cursor-pointer border-b text-zinc-800 dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-6 py-2">
                        심리 상담
                      </td>
                      <td className="px-6 py-2">
                        심리 상담 예약
                      </td>
                      <td className="px-6 py-2">
                        홍대성
                      </td>
                      <td className="px-6 py-2">
                        검토 후 승인
                      </td>
                      <td className="px-6 py-2">
                        상담실
                      </td>
                      <td className="px-6 py-2">
                        오전 9시 ~ 오후 4시
                      </td>
                      <td className="px-6 py-2">
                        제한 없음
                      </td>
                      <td className="px-6 py-2">
                        <div className="bg-blue-500 hover:bg-blue-600 text-sm transition-all font-bold text-white justify-center w-[140px] py-3 flex items-center cursor-pointer rounded-[10px]">
                          <svg className="w-5 h-5 mr-2" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                          </svg>
                          예약하기
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
