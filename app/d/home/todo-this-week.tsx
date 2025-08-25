'use client';

import Menu from "@components/menu";
import Modal from "@/components/modal";
import { AnimatePresence, useAnimationControls } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { OpacityAnimation, StaggerChildrenAnimation, StaggerParentAnimation } from "@components/animation";
import { useAppDispatch } from "@libs/client/redux/hooks";
import useSWR from "swr";
import { setNotification } from "@libs/client/redux/notification";
import displayDate from "@libs/client/time-display";

export default function Todo() {
  const [modal, setModal] = useState(false);
  const controls = useAnimationControls();
  const { data } = useSWR('/api/user/todo/this-week');
  const { data: userData } = useSWR('/api/user');
  useEffect(() => {
    controls.start('visible');
  }, [data]);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="font-bold text-2xl text-zinc-800 flex items-center">
          이번주 할 일
          <div>
            { (data && data.success === true && data.todos.length > 0) && <OpacityAnimation><div className="text-blue-500 ml-2">{data.todos.length}</div></OpacityAnimation> }
          </div>
        </div>
        <Link href='/d/home/todo'>
          <div className="flex items-center space-x-0 hover:bg-blue-50 px-1 py-1 pl-2 transition-all cursor-pointer rounded-lg">
            <div className="text-sm text-blue-500 py-0 px-0 font-bold">모두 보기</div>
            <svg className="w-6 h-6 fill-blue-500 -mx-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path clipRule="evenodd" fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" />
            </svg>
          </div>
        </Link>
      </div>
      <AnimatePresence initial={false} mode="wait">
        { modal && <Modal handleClose={() => setModal(false)}>
          <div className="w-[300px] h-auto">
            <div className="font-bold text-xl text-zinc-800">이 항목을 완료로 표시할까요?</div>
            <div className="flex items-center space-x-2 mt-5">
              <div onClick={() => setModal(false)} className="bg-gray-100 hover:bg-gray-200 text-base transition-all font-medium text-zinc-800 justify-center w-full py-3 flex items-center cursor-pointer rounded-xl">
                취소
              </div>
              <div onClick={() => setModal(false)} className="bg-blue-500 hover:bg-blue-600 text-base transition-all font-medium text-white justify-center w-full py-3 flex items-center cursor-pointer rounded-xl">
                완료로 표시하기
              </div>
            </div>
          </div>
        </Modal> }
      </AnimatePresence>
      { (data && data.success === true && data.todos.length <= 0) && <div className="my-14">
        <OpacityAnimation>
          <div className="text-lightgray-200 w-full flex items-center justify-center flex-col">
            <div className="w-10 h-10">
              <svg fill="none" strokeWidth={1.7} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
              </svg>
            </div>
            <div className="mt-1 text-center">이번 주 해야할 일이 없어요<br/>나에게 추가하면 잊지 않게 알려드릴게요</div>
          </div>
        </OpacityAnimation>
      </div> }
      <StaggerParentAnimation controls={controls}>
        { (data && data.success === true) && <div>
          { data.todos.map((item:any, index:number) => {
            return (
              <StaggerChildrenAnimation key={index}>
                <Link href={`/d/home/todo?id=${item.id}`}>
                  <div className="w-full relative flex items-center justify-between py-2 md:py-3 md:px-3 md:-mx-3 cursor-pointer rounded-xl hover:bg-gray-50 transition-all">
                    <div>
                      <div className="flex items-center space-x-3 md:space-x-5">
                        <div className="w-[50px] h-[50px] min-w-[50px] md:flex hidden justify-center overflow-hidden items-center bg-white border-[1px] border-lightgray-100 rounded-[20px]">
                          <div className="w-[50px] h-[50px] flex items-center justify-center">
                            <Image
                              src={item.sender.profile}
                              width={50}
                              height={50}
                              alt=""
                            />
                          </div>
                        </div>
                        <div className="w-[43px] h-[43px] md:hidden flex justify-center overflow-hidden items-center bg-white border-[1px] border-lightgray-100 rounded-[15px]">
                          <Image
                            src={item.sender.profile}
                            width={43}
                            height={43}
                            alt=""
                          />
                        </div>
                        <div className="text-zinc-800 font-bold text-base xl:block hidden">활동 완료 요청 - '{item.title}'</div>
                        <div className="text-zinc-800 font-bold text-base xl:hidden hidden md:block break-all max-w-[60vw] md:max-w-full">'{item.title}'</div>
                        <div className="text-zinc-800 font-bold text-base md:hidden block break-all max-w-[60vw]">{item.title}</div>
                        <div className="text-zinc-800 text-base md:block hidden break-normal">{ item.deadline ? displayDate(item.deadline, 'date-left') === 0 ? '오늘 마감' : `${displayDate(item.deadline, 'date-without-year')} 마감` : '마감 기한 없음' }</div>
                      </div>
                    </div>
                    <div className="space-x-5 transition-all xl:flex hidden">
                      <div className="text-lightgray-200 text-base">{item.sender.name}</div>
                      <div className="text-lightgray-200 text-base">{displayDate(item.createdAt, 'datetime')}</div>
                    </div>
                    {/* <div className="flex space-x-5 group-hover:opacity-100 absolute right-3 opacity-0 transition-all">
                      <div onClick={() => setModal(true)} className="bg-emerald-500 hover:bg-emerald-600 text-sm transition-all font-bold text-white justify-center w-[150px] py-3 flex items-center cursor-pointer rounded-[10px]">
                        <svg className="w-5 h-5 mr-2" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        완료로 표시하기
                      </div>
                    </div> */}
                  </div>
                </Link>
              </StaggerChildrenAnimation>
            )
          }) }
        </div> }
      </StaggerParentAnimation>
      { !data && [...Array(3)].map((value, index) => {
        return ( 
          <div key={index} className="w-full relative flex items-center justify-between py-2 px-3 md:py-3 md:px-3 md:-mx-3 rounded-xl">
            <div>
              <div className="items-center space-x-5 md:flex hidden">
                <div className="w-[50px] h-[50px] flex justify-center overflow-hidden items-center bg-gray-100 animate-pulse rounded-[20px]"></div>
                <div className="bg-gray-100 w-[200px] h-5 rounded-lg font-bold text-base"></div>
                <div className="bg-gray-100 w-[80px] h-5 rounded-lg text-base"></div>
              </div>
              <div className="items-center space-x-3 md:hidden flex">
                <div className="w-[43px] h-[43px] flex justify-center overflow-hidden items-center bg-gray-100 animate-pulse rounded-[15px]"></div>
                <div className="bg-gray-100 w-[50vw] h-5 rounded-lg font-bold text-base"></div>
              </div>
            </div>
            <div className="space-x-5 absolute right-3 transition-all md:flex hidden">
              <div className="bg-gray-100 w-[70px] h-5 rounded-lg text-base"></div>
              <div className="bg-gray-100 w-[170px] h-5 rounded-lg text-base"></div>
            </div>
          </div>
        )
      }) }
      { userData?.user?.password === false && (
        <OpacityAnimation>
          <div className="mt-20 py-8 px-8 rounded-xl bg-gradient-to-r from-white to-red-100">
            <div className="font-bold text-red-500 text-xl text-center">안전한 전자 활승 이용을 위해<br/>비밀번호를 변경해주세요.</div>
            <div className="text-red-500 text-center text-sm mt-2 md:block hidden">다른 사람이 내 계정으로 로그인 할 수 없도록 초기 비밀번호를 변경해주세요.<br/>비밀번호는 단방향 암호화되어, 관리자를 포함한 누구도 알 수 없도록 안전하게 저장됩니다.</div>
            <div className="text-red-500 text-center text-sm mt-2 md:hidden block">다른 사람이 내 계정으로 로그인 할 수 없도록 초기 비밀번호를 변경해주세요. 비밀번호는 단방향 암호화되어, 관리자를 포함한 누구도 알 수 없도록 안전하게 저장됩니다.</div>
          </div>
        </OpacityAnimation>
      )}
      <OpacityAnimation>
        <div className="mb-5 mt-5 py-8 px-8 rounded-xl bg-gradient-to-r from-white to-cyan-100">
          <div className="font-bold text-cyan-500 text-xl text-center">전자 활승을 태블릿, 모바일 기기에<br/>앱으로 설치해 사용할 수 있습니다.</div>
          <div className="text-cyan-500 text-center text-sm mt-2 md:block hidden">IOS/iPadOS, Andorid, Windows 기기에서 앱으로 전자활승을 설치하면<br/>더 편하게 전자활승을 이용하실 수 있습니다. 자세한 내용은 이용 가이드를 참고해주세요.</div>
          <div className="text-cyan-500 text-center text-sm mt-2 md:hidden block">더 편하게 전자활승을 이용하실 수 있습니다.</div>
        </div>
      </OpacityAnimation>
    </div>
  )
}