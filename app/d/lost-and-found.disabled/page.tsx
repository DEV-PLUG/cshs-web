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
            <Link href='/lost-and-found'>
              <div className="font-bold text-3xl text-zinc-800 cursor-pointer">분실물</div>
            </Link>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex space-x-6">
            <div className="border-b-2 border-zinc-800 pb-3 cursor-pointer">
              <div className="font-bold">찾은 물건</div>
            </div>
            <div className="border-b-0 border-zinc-800 pb-3 cursor-pointer">
              <div className="font-bold text-lightgray-200">분실한 물건</div>
            </div>
          </div>
        </div>
        <div className="w-full h-[1px] mb-5 bg-lightgray-100"></div>
        <div className="mt-8 flex justify-between space-x-5">
          <div className="w-full space-y-10">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-2xl text-zinc-800">찾은 물건</div>
              </div>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                  <thead className="text-sm text-lightgray-200 bg-gray-50/50 border-t border-b border-lightgray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 !font-medium">
                        사진
                      </th>
                      <th scope="col" className="px-6 py-3 !font-medium">
                        이름
                      </th>
                      <th scope="col" className="px-6 py-3 !font-medium">
                        설명
                      </th>
                      <th scope="col" className="px-6 py-3 !font-medium">
                        발견 일시
                      </th>
                      <th scope="col" className="px-6 py-3 !font-medium">
                        연락처
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white hover:bg-gray-50 transition-all cursor-pointer border-b text-zinc-800">
                      <td className="px-6 py-2">
                        <div className="w-24 h-24 rounded-xl bg-gray-100"></div>
                      </td>
                      <td className="px-6 py-2">
                        지갑
                      </td>
                      <td className="px-6 py-2">
                        갈색 지갑입니다.
                      </td>
                      <td className="px-6 py-2">
                        2024-03-06 (금) 오후 02:14
                      </td>
                      <td className="px-6 py-2">
                        2층 교무실
                      </td>
                    </tr>
                    <tr className="bg-white hover:bg-gray-50 transition-all cursor-pointer border-b text-zinc-800">
                      <td className="px-6 py-2">
                        <div className="w-24 h-24 rounded-xl bg-gray-100"></div>
                      </td>
                      <td className="px-6 py-2">
                        모자
                      </td>
                      <td className="px-6 py-2">
                        검은색 모자입니다.
                      </td>
                      <td className="px-6 py-2">
                        2024-03-06 (금) 오후 02:14
                      </td>
                      <td className="px-6 py-2">
                        2층 교무실
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
