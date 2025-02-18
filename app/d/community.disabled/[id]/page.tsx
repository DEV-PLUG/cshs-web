import Menu from "@/components/community-menu";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen">
      <Menu/>
      <div className="h-[100vh] bg-white w-full md:border-l-[1px] border-lightgray-100 drop-shadow-2xl p-10 overflow-auto">
        <div className="flex justify-between w-full mb-8">
          <div className="flex space-x-7 h-[46px] items-center">
            <div className="font-bold text-3xl text-zinc-800 cursor-pointer">자유 게시판</div>
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
        </div>
        <div className="w-full h-[1px] mb-5 bg-lightgray-100"></div>
        <div className="mt-8 flex justify-between space-x-5">
          <div className="w-full space-y-10">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-2xl text-zinc-800">승인 대기 내역 <span className="text-blue-500">1</span></div>
              </div>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
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
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white hover:bg-gray-50 transition-all cursor-pointer border-b text-zinc-800">
                      <td className="px-6 py-2">
                        심리 상담
                      </td>
                      <td className="px-6 py-2">
                        심리 상담 예약
                      </td>
                      <td className="px-6 py-2">
                        상담 선생님
                      </td>
                      <td className="px-6 py-2">
                        검토 후 승인
                      </td>
                      <td className="px-6 py-2">
                        상담실
                      </td>
                      <td className="px-6 py-2">
                        2024-05-03 (금)<br/>오전 9시 ~ 오전 10시
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-2xl text-zinc-800">승인된 내역 <span className="text-blue-500">2</span></div>
              </div>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
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
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white hover:bg-gray-50 transition-all cursor-pointer border-b text-zinc-800">
                      <td className="px-6 py-2">
                        심리 상담
                      </td>
                      <td className="px-6 py-2">
                        심리 상담 예약
                      </td>
                      <td className="px-6 py-2">
                        상담 선생님
                      </td>
                      <td className="px-6 py-2">
                        검토 후 승인
                      </td>
                      <td className="px-6 py-2">
                        상담실
                      </td>
                      <td className="px-6 py-2">
                        2024-05-03 (금)<br/>오전 9시 ~ 오전 10시
                      </td>
                    </tr>
                    <tr className="bg-white hover:bg-gray-50 transition-all cursor-pointer border-b text-zinc-800">
                      <td className="px-6 py-2">
                        심리 상담
                      </td>
                      <td className="px-6 py-2">
                        심리 상담 예약
                      </td>
                      <td className="px-6 py-2">
                        상담 선생님
                      </td>
                      <td className="px-6 py-2">
                        검토 후 승인
                      </td>
                      <td className="px-6 py-2">
                        상담실
                      </td>
                      <td className="px-6 py-2">
                        2024-05-03 (금)<br/>오전 9시 ~ 오전 10시
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
