import Menu from "@components/menu";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen">
      <Menu/>
      <div className="h-[100vh] bg-white w-full md:border-l-[1px] border-lightgray-100 drop-shadow-2xl p-10 overflow-auto">
        <div className="flex justify-between w-full mb-8">
          <div className="flex space-x-7 items-center">
            <Link href='/d/home'>
              <div className="font-bold text-3xl text-lightgray-100 cursor-pointer">피드</div>
            </Link>
            {/* <Link href='/d/home/notice'>
              <div className="font-bold text-3xl text-zinc-800 cursor-pointer">학교 소식</div>
            </Link> */}
            <Link href='/d/home/todo'>
              <div className="font-bold text-3xl text-lightgray-100 cursor-pointer">할 일</div>
            </Link>
          </div>
          <div>
            <div className="bg-blue-500 hover:bg-blue-600 text-sm transition-all font-bold text-white justify-center h-[46px] w-[160px] py-3 flex items-center cursor-pointer rounded-[10px]">
              <svg className="w-5 h-5 mr-1" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              게시글 작성하기
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex space-x-6">
            <div className="border-b-2 border-zinc-800 pb-3 cursor-pointer">
              <div className="font-bold">전체 게시글</div>
            </div>
            <div className="border-b-0 border-zinc-800 pb-3 cursor-pointer">
              <div className="font-bold text-lightgray-200">내가 쓴 게시글</div>
            </div>
          </div>
          <div className="flex space-x-1 -mt-3 items-center">
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
          <div className="w-full">
            <div className="space-y-3">
              <div className="space-y-7">
                <div className="w-full space-y-3">
                  <div>
                    <div className="flex items-center space-x-3">
                      <div className="w-[45px] h-[45px] flex justify-center overflow-hidden items-center bg-white border-[1px] border-lightgray-100 rounded-[17px]">
                        <Image
                          src="/images/school/cjh.jpg"
                          width={45}
                          height={45}
                          alt=""
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="text-zinc-800 font-bold text-base">보건 선생님</div>
                        <div className="text-lightgray-200 text-sm flex items-center"><span className="">1일 전 · </span> 
                        <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" />
                        </svg>1학년</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    안녕하세요.<br/>
                    오늘 8,9교시에 대학탐방 관련 학생 안전교육이 있을 예정입니다.<br/>
                    1학년 학생들은 모두 소강당으로 모여주시기 바랍니다.<br/><br/>
                    30분 가량 간략하게 교육을 진행하고, 이후에 자습 시간 갖도록 하겠습니다.
                    <br/>
                  </div>
                </div>
                <div className="w-full space-y-3">
                  <div>
                    <div className="flex items-center space-x-3">
                      <div className="w-[45px] h-[45px] flex justify-center overflow-hidden items-center bg-white border-[1px] border-lightgray-100 rounded-[17px]">
                        <Image
                          src="/images/school/cjh.jpg"
                          width={45}
                          height={45}
                          alt=""
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="text-zinc-800 font-bold text-base">보건 선생님</div>
                        <div className="text-lightgray-200 text-sm flex items-center"><span className="">1일 전 · </span> 
                        <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" />
                        </svg>1학년</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    안녕하세요.<br/>
                    오늘 8,9교시에 대학탐방 관련 학생 안전교육이 있을 예정입니다.<br/>
                    1학년 학생들은 모두 소강당으로 모여주시기 바랍니다.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[350px]">
          </div>
        </div>
      </div>
    </main>
  );
}
