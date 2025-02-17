import Menu from "@components/menu";
import Image from "next/image";
import Link from "next/link";

export default function SurveyList() {
  return (
    <div>
      <div className="flex justify-between">
        <div className="flex space-x-6">
          <div className="border-b-2 border-zinc-800 pb-3 cursor-pointer">
            <div className="font-bold">요청 받은 설문조사</div>
          </div>
          <div className="border-b-0 border-zinc-800 pb-3 cursor-pointer">
            <div className="font-bold text-lightgray-200">내가 생성한 설문조사</div>
          </div>
        </div>
      </div>
      <div className="w-full h-[1px] mb-5 bg-lightgray-100"></div>
      <div className="mt-8 flex justify-between space-x-5">
        <div className="w-full space-y-10">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-bold text-2xl text-zinc-800">참여 대기 내역 <span className="text-blue-500">1</span></div>
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
                      생성 일시
                    </th>
                    <th scope="col" className="px-6 py-3 !font-medium">
                      참여하기
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
                      2024-03-06 (금) 오후 02:14
                    </td>
                    <td className="px-6 py-2">
                      <div className="bg-blue-500 hover:bg-blue-600 text-sm transition-all font-bold text-white justify-center w-[140px] py-3 flex items-center cursor-pointer rounded-[10px]">
                        <svg className="w-5 h-5 mr-2" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                        참여하기
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
  );
}
