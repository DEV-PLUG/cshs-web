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
            <Link href='/student-id'>
              <div className="font-bold text-3xl text-zinc-800 cursor-pointer">학생증</div>
            </Link>
            <Link href='/student-id/list'>
              <div className="font-bold text-3xl text-lightgray-100 cursor-pointer">내역</div>
            </Link>
          </div>
        </div>
        <div className="w-full h-[1px] my-5 bg-lightgray-100"></div>
        <div className="mt-8 flex justify-between space-x-5">
          <div className="w-full space-y-10">
            <div className="rounded-2xl absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl bg-white overflow-hidden w-[340px] h-[480px] border border-lightgray-100">
              <div className="bg-blue-900 text-white relative py-20 pt-14 text-center">
                <div className="opacity-20 absolute -top-20 -left-16">
                  <Image
                    src="/images/school/cshs-white.png"
                    width={250}
                    height={250}
                    alt=""
                  />
                </div>
                <div className="text-lightgray-100">온라인 학생증</div>
                <div className="font-bold text-2xl">창원과학고등학교</div>
                <div className="border-4 rounded-full overflow-hidden border-white absolute -bottom-14 left-1/2 -translate-x-1/2">
                  <Image
                    src="/images/school/cjh.jpg"
                    width={100}
                    height={100}
                    alt="프로필"
                  />
                </div>
              </div>
              <div className="mt-16">
                <div className="text-2xl text-zinc-800 text-center font-bold">최지환</div>
                <div className="text-base text-lightgray-200 text-center">1학년 1반 21번</div>
                <div className="text-base text-lightgray-200 text-center">124701498572310</div>
              </div>
              <div className="w-[90%] h-[1px] mx-auto my-6 bg-lightgray-100"></div>
              <div className="flex px-5 space-x-4">
                <svg className="w-16 h-16 rounded-xl p-1 border border-lightgray-100 stroke-zinc-800" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
                </svg>
                <div className="flex flex-col">
                  <div className="flex font-bold items-center space-x-1 text-sm">
                    <svg className="w-5 h-5 stroke-zinc-800" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <div>크게보기</div>
                  </div>
                  <div className="text-lightgray-200 text-sm mt-1">QR을 탭하여</div>
                  <div className="text-lightgray-200 text-sm">카메라에 스캔해주세요.</div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="w-[350px] space-y-3"></div> */}
        </div>
      </div>
    </main>
  );
}
