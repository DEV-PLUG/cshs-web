'use client';

import Menu from "@components/menu";
import Image from "next/image";
import Link from "next/link";
import Todo from "./todo-this-week";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@libs/client/redux/hooks";
import { setNotification } from "@libs/client/redux/notification";
import displayDate from "@libs/client/time-display";
import { SubButton } from "@components/button";
import { OpacityAnimation } from "@components/animation";
import Modal from "@components/modal";
import ClassroomModal from "./todo/classroom-info";
import ClassroomConnectModal from "@components/info/classroom-connect";
import { AnimatePresence } from "framer-motion";

export default function Announcement() {
  const dispatch = useAppDispatch();
  const { data } = useSWR('/api/classroom/announcements');
  useEffect(() => {
    if(data?.success === false && data.message !== '구글 계정을 연결해주세요' && data.message !== '학생만 이용할 수 있어요') {
      dispatch(setNotification({ type: 'error', text: '공지사항 로드 중 오류가 발생했어요' }));
    }
  }, [data]);

  const [classroomModal, setClassroomModal] = useState(false);

  return (
    <>
      <AnimatePresence initial={false} mode="wait">
        { classroomModal && <Modal handleClose={() => setClassroomModal(false)}>
          <ClassroomConnectModal/>
        </Modal> }
      </AnimatePresence>
      <div className="flex items-center justify-between">
        <div className="font-bold text-2xl text-zinc-800">공지사항</div>
        {/* <Link href='/d/home/notice'>
          <div className="flex items-center space-x-0 hover:bg-blue-50 px-1 py-1 pl-2 transition-all cursor-pointer rounded-lg">
            <div className="text-sm text-blue-500 py-0 px-0 font-bold">모두 보기</div>
            <svg className="w-6 h-6 fill-blue-500 -mx-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path clipRule="evenodd" fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" />
            </svg>
          </div>
        </Link> */}
      </div>
      <div className="space-y-7 relative">
        { (data?.message === '학생만 이용할 수 있어요') && <OpacityAnimation>
          <div className="flex items-center justify-center h-[400px]">
            <div>
              <div className="flex items-center justify-center space-x-5">
                <div className="w-[80px] h-[80px] flex items-center justify-center bg-gray-100 rounded-full">
                  <Image src="/images/classroom/classroom-square-logo.png" width={45} height={45} alt="Classroom Logo" />
                </div>
              </div>
              <div className="text-lightgray-200 my-5">
                <div className="text-center font-bold text-lightgray-300 text-base mb-1">학생만 이용 가능한 기능입니다</div>
                <div className="text-center">학생이 클래스룸 계정을 연결하면 Glassy AI가 자동으로 할 일을 등록하고,<br/>손쉽게 정보를 검색할 수 있습니다.</div>
              </div>
              <div className="flex justify-center mt-6">
                <div className="bg-gray-100 rounded-lg p-1 px-2 text-sm text-lightgray-200">곧 이곳에 다른 기능을 표시할 예정입니다</div>
              </div>
            </div>
          </div>
        </OpacityAnimation> }
        { (data?.message === '구글 계정을 연결해주세요') && <OpacityAnimation>
          <div className="flex items-center justify-center h-[400px]">
            <div>
              <div className="flex items-center justify-center space-x-5">
                <div className="w-[80px] h-[80px] flex items-center justify-center bg-gray-100 rounded-full">
                  <Image src="/images/classroom/classroom-square-logo.png" width={45} height={45} alt="Classroom Logo" />
                </div>
              </div>
              <div className="text-lightgray-200 my-5">
                <div className="text-center font-bold text-lightgray-300 text-base mb-1">클래스룸 계정을 연결해주세요</div>
                <div className="text-center">클래스룸 계정을 연결하면 AI가 자동으로 할 일을 등록하고,<br/>손쉽게 정보를 검색할 수 있습니다.</div>
              </div>
              <div className="items-center justify-center md:flex hidden">
                <SubButton fn={() => setClassroomModal(true)} color="lightblue">연결하기</SubButton>
              </div>
              <div className="flex items-center justify-center text-red-500 font-bold text-center md:hidden">
                웹 브라우저에서 접속 후 연결해주세요
              </div>
              <div className="flex justify-center mt-6">
                <div className="bg-gray-100 rounded-lg p-1 px-2 text-sm text-lightgray-200">전자 활동 승인서는 사용자 인증 정보를 안전하게 보관 및 관리합니다.</div>
              </div>
            </div>
          </div>
        </OpacityAnimation> }
        { (data?.success === true && data.announcements.length <= 0) && <OpacityAnimation>
          <div className="flex items-center justify-center h-[400px]">
            <div>
              <div className="flex items-center justify-center space-x-5">
                <div className="w-[80px] h-[80px] flex items-center justify-center bg-gray-100 rounded-full relative">
                  <Image src="/images/classroom/classroom-square-logo.png" width={45} height={45} alt="Classroom Logo" />
                  <svg className="w-8 h-8 fill-red-500 absolute -bottom-0 -right-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path clipRule="evenodd" fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
                  </svg>
                </div>
              </div>
              <div className="text-lightgray-200 my-5">
                <div className="text-center font-bold text-lightgray-300 text-base mb-1">클래스룸 계정을 다시 연결해주세요</div>
                <div className="text-center">클래스룸 계정에 사용된 학교 구글 계정을 연결하지 않은 것 같습니다.<br/>개인 계정이 아닌 학교 계정을 선택하여 다시 연결해주세요.</div>
              </div>
              <div className="hidden md:flex items-center justify-center">
                <SubButton fn={() => setClassroomModal(true)} color="lightblue">다시 연결하기</SubButton>
              </div>
              <div className="flex items-center justify-center text-red-500 font-bold text-center md:hidden">
                웹 브라우저에서 접속 후 연결해주세요
              </div>
              <div className="flex justify-center mt-6">
                <div className="bg-gray-100 rounded-lg p-1 px-2 text-sm text-lightgray-200">전자 활동 승인서는 사용자 인증 정보를 안전하게 보관 및 관리합니다.</div>
              </div>
            </div>
          </div>
        </OpacityAnimation> }
        { (data && data.success === true) && <OpacityAnimation>
          <div className="space-y-7">
            { data.announcements.map((data:{writer:string, content:string, course:{name:string}, postCreationTime:string, id:number, title?:string, dueDate?:string, materials?:boolean, type?:number}) => {
              return (
                <div key={data.id} className="w-full space-y-3">
                  <div>
                    <div className="flex items-center space-x-3">
                      <div className="w-[45px] h-[45px] relative flex justify-center items-center bg-gray-100 border-[1px] border-lightgray-100 rounded-[17px]">
                        <svg className="w-8 h-8 fill-gray-300 stroke-gray-300" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                        { data.type === 1 && <div className="p-1 rounded-lg absolute -right-1 -bottom-1 flex items-center justify-center bg-blue-100">
                          <svg className="w-4 h-4 stroke-blue-500" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                          </svg>
                        </div> }
                      </div>
                      <div className="flex flex-col">
                        <div className="text-zinc-800 font-bold text-base">{data.writer}</div>
                        <div className="text-lightgray-200 text-sm flex items-center"><span className="">{ displayDate(new Date(data.postCreationTime), 'date-left') === '0' ? '오늘' : +displayDate(new Date(data.postCreationTime), 'date-left') < -7 ? displayDate(new Date(data.postCreationTime), 'date-without-year') : `${-(+displayDate(new Date(data.postCreationTime), 'date-left'))}일 전` } · </span> 
                        <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" />
                        </svg>{data.course.name}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    { data.title && <div className="text-base font-bold">{data.title}</div> }
                    { data.dueDate && <div className="text-sm">({displayDate(new Date(data.dueDate), 'datetime')} 마감)</div> }
                  </div>
                  <div className="whitespace-pre-wrap text-sm">{data.content}</div>
                  { data.materials === true && <div className="flex">
                    <div className="text-gray-400 bg-gray-100 px-1 text-xs rounded-md items-center flex space-x-1">
                      <svg className="w-3 h-3" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                      <div>첨부된 파일 또는 링크가 있음</div>
                    </div>
                  </div> }
                </div>
              )
            }) }
          </div>
        </OpacityAnimation> }
        { (!data) && [...new Array(10)].map((data, index) => {
          return (
            <div key={index} className="w-full space-y-3 animate-pulse">
              <div>
                <div className="flex items-center space-x-3">
                  <div className="w-[45px] h-[45px] flex justify-center overflow-hidden items-center bg-gray-100 rounded-[17px]"></div>
                  <div className="flex flex-col space-y-1">
                    <div className="bg-gray-100 w-[100px] h-5 rounded-lg font-bold text-base"></div>
                    <div className="bg-gray-100 w-[220px] h-3 rounded-lg text-base"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-2 md:block hidden">
                <div className="bg-gray-100 w-[320px] h-3 rounded-lg text-base"></div>
                <div className="bg-gray-100 w-[420px] h-3 rounded-lg text-base"></div>
                <div className="bg-gray-100 w-[100px] h-3 rounded-lg text-base"></div>
                <div className="bg-gray-100 w-[220px] h-3 rounded-lg text-base"></div>
                <div className="bg-gray-100 w-[350px] h-3 rounded-lg text-base"></div>
                <div className="bg-gray-100 w-[150px] h-3 rounded-lg text-base"></div>
                <div className="bg-gray-100 w-[170px] h-3 rounded-lg text-base"></div>
              </div>
              <div className="space-y-2 md:hidden block">
                <div className="bg-gray-100 w-[70%] h-3 rounded-lg text-base"></div>
                <div className="bg-gray-100 w-[80%] h-3 rounded-lg text-base"></div>
                <div className="bg-gray-100 w-[75%] h-3 rounded-lg text-base"></div>
                <div className="bg-gray-100 w-[50%] h-3 rounded-lg text-base"></div>
                <div className="bg-gray-100 w-[70%] h-3 rounded-lg text-base"></div>
                <div className="bg-gray-100 w-[65%] h-3 rounded-lg text-base"></div>
                <div className="bg-gray-100 w-[60%] h-3 rounded-lg text-base"></div>
              </div>
            </div>
          )
        }) }
      </div>
    </>
  );
}