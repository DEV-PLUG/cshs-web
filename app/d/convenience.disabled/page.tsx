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
            <Link href='/convenience'>
              <div className="font-bold text-3xl text-zinc-800 cursor-pointer">편의기능</div>
            </Link>
          </div>
        </div>
        <div className="w-full h-[1px] mb-5 bg-lightgray-100"></div>
        <div className="mt-8 flex justify-between space-x-5">
          <div className="w-full space-y-10">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-2xl text-zinc-800">수업</div>
              </div>
              <div className='w-[640px] cursor-pointer space-x-6 flex items-center px-8 h-[110px] rounded-3xl bg-gray-100 hover:bg-gray-200 transition-all'>
                <div className='text-5xl tossface'>👥</div>
                <div>
                  <div className='text-lg font-bold'>랜덤 학생 뽑기</div>
                  <div className='text-gray-500 dark:text-gray-400 text-sm'>무작위 학생을 선택할 수 있습니다.<br/>원하는 인원, 중복 선택 여부 등을 선택하여 사용할 수 있습니다.</div>
                </div>
              </div>
              <Link href='/convenience/class/random-group'>
                <div className='w-[640px] cursor-pointer mt-3 space-x-6 flex items-center px-8 h-[110px] rounded-3xl bg-gray-100 hover:bg-gray-200 transition-all'>
                  <div className='text-5xl tossface'>📇</div>
                  <div>
                    <div className='text-lg font-bold'>랜덤 조 편성</div>
                    <div className='text-gray-500 dark:text-gray-400 text-sm'>무작위 조를 편성할 수 있습니다.<br/>원하는 인원, 조 개수 등을 선택하여 사용할 수 있습니다.</div>
                  </div>
                </div>
              </Link>
            </div>
            {/* <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-2xl text-zinc-800">방송</div>
              </div>
              <Link href='/convenience/broadcast'>
                <div className='w-[640px] cursor-pointer space-x-6 flex items-center px-8 h-[110px] rounded-3xl bg-gray-100 hover:bg-gray-200 transition-all'>
                  <div className='text-5xl tossface'>📻</div>
                  <div>
                    <div className='text-lg font-bold'>방송 녹음기</div>
                    <div className='text-gray-500 dark:text-gray-400 text-sm'>방송 내용을 텍스트로 변환 후 해당하는<br/>구성원에게 알림을 전송합니다.</div>
                  </div>
                </div>
              </Link>
            </div> */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-2xl text-zinc-800">데이터</div>
              </div>
              <div className='w-[640px] cursor-pointer space-x-6 flex items-center px-8 h-[110px] rounded-3xl bg-gray-100 hover:bg-gray-200 transition-all'>
                <div className='text-5xl tossface'>🗂️</div>
                <div>
                  <div className='text-lg font-bold'>데이터 요청</div>
                  <div className='text-gray-500 dark:text-gray-400 text-sm'>커스텀 필터를 적용하거나, 과거 데이터를 조회하고 싶은 경우 등<br/>원하는 조건 및 범위의 데이터를 요청할 수 있습니다.</div>
                </div>
              </div>
              <Link href='/convenience/class/random-group'>
                <div className='w-[640px] cursor-pointer mt-3 space-x-6 flex items-center px-8 h-[110px] rounded-3xl bg-gray-100 hover:bg-gray-200 transition-all'>
                  <div className='text-5xl tossface'>💻</div>
                  <div>
                    <div className='text-lg font-bold'>API 요청</div>
                    <div className='text-gray-500 dark:text-gray-400 text-sm'>프로그래밍 방식으로 데이터를 제어하고 싶은 경우,<br/>API 키 및 데이터베이스 구조를 요청할 수 있습니다.</div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-2xl text-zinc-800">추가</div>
              </div>
              <div className='w-[640px] cursor-pointer space-x-6 flex items-center px-8 h-[110px] rounded-3xl bg-gray-100 hover:bg-gray-200 transition-all'>
                <div className='text-5xl tossface'>💡</div>
                <div>
                  <div className='text-lg font-bold'>원하는 편의기능이 있으신가요?</div>
                  <div className='text-gray-500 dark:text-gray-400 text-sm'>그라운드는 학교 구성원이 함께 만들어나가는 공간입니다.<br/>원하는 기능이 있으시다면 언제든 이곳을 눌러 알려주세요.</div>
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
