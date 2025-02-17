'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Modal from "@components/modal";
import { AnimatePresence } from "framer-motion";
import { signIn, signOut } from "next-auth/react";
import UpModal from "@components/up-modal";
import Button from "@components/button";
import { Textarea } from "@components/input";
import { Tooltip } from "@mui/material";
import { setNotification } from "@libs/client/redux/notification";
import { useAppDispatch } from "@libs/client/redux/hooks";
import useSWR from "@node_modules/swr/dist/core/index.mjs";
import { OpacityAnimation } from "@components/animation";

export default function ProfileMenu() {
  const [profile, setProfile] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [mobile, setMobile] = useState(false);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if(document?.cookie.includes('MobileAuthorization')) {
      setMobile(true);
    }
    if(document) setLoad(true);
  }, []);

  const dispatch = useAppDispatch();

  async function sendFeedback() {
    if(loading) return;

    if(feedback.length <= 0) {
      return dispatch(setNotification({ type: "error", text: "의견을 입력해주세요" }));
    }
    if(feedback.length > 500) {
      return dispatch(setNotification({ type: "error", text: "의견은 500자 이하여야 해요" }));
    }

    setLoading(true);
    await fetch(`/api/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: feedback
      })
    })
    .then((response) => response.json())
    .then((response) => {
      setLoading(false);
      if(response.success === true) {
        setFeedbackModal(false);
        dispatch(setNotification({ type: 'success', text: '서비스 개선에 함께해 주셔서 감사드립니다' }));
      }
    });
  }

  const { data } = useSWR('/api/user');
  useEffect(() => {
    if(data?.success === true) {
      document.cookie = `name=${data.user.name}; path=/;`;
      document.cookie = `type=${data.user.type}; path=/;`;
      if(data.user.type === 0) {
        document.cookie = `grade=${data.user.grade}; path=/;`;
        document.cookie = `class=${data.user.class}; path=/;`;
        document.cookie = `number=${data.user.number}; path=/;`;
      }
    }
  }, [data]);

  return (
    <>
      <AnimatePresence initial={false} mode="wait">
        { feedbackModal && <Modal handleClose={() => setFeedbackModal(false)}>
          <div className="w-full md:w-[380px] h-[520px]">
            <div className="flex justify-end">
              <div onClick={() => setFeedbackModal(false)} className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer">
                <svg className="w-6 h-6 p-1 rounded-full stroke-gray-400" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col justify-between h-full pb-8">
              <div>
                <div className='w-full space-x-2 flex items-start py-2 px-3 rounded-xl bg-gray-100 transition-all mt-5 mb-5'>
                  <div className='text-2xl tossface'>💡</div>
                  <div>
                    <div className='text-lightgray-200 text-sm'>
                      전자 활동 승인서는 학교 구성원이 함께 만들어 나가는 공간입니다.<br/>서비스 개선에 함께해 주셔서 감사드립니다.<br/>
                    </div>
                  </div>
                </div>
                <div className="mb-1">어떤 의견이 있으신가요?</div>
                <Textarea placeholder="의견을 입력해주세요" fn={(value:string) => setFeedback(value)} />
              </div>
              <div>
                <div className="flex items-center w-full justify-center mb-5">
                  <Tooltip title="이 정보는 전송한 사용자를 식별할 수 없도록 별도의 저장소에 저장되므로 익명이 보장됩니다." placement="top" arrow>
                    <div className="bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors p-1 rounded-full flex items-center px-2 space-x-1">
                      <svg className="w-5 h-5 stroke-gray-400" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                      <div className="text-sm text-gray-400">이 정보는 익명으로 전송됩니다</div>
                    </div>
                  </Tooltip>
                </div>
                <Button color="blue" loading={loading} fn={() => sendFeedback()}>
                  의견 보내기
                </Button>
              </div>
            </div>
          </div>
        </Modal> }
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait">
        { profile && <UpModal handleClose={() => setProfile(false)}>
          <div className="w-[272px] h-auto top-[55px] xl:top-[85px] p-2 left-[0px] rounded-xl bg-white border-lightgray-100 drop-shadow-2xl absolute">
            {/* <div className="px-3 py-2 flex items-center space-x-2 transition-all cursor-pointer rounded-lg hover:bg-gray-100 text-lightgray-300">
              <svg className="w-5 h-5" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <div className="text-base">프로필 설정</div>
            </div> */}
            <div onClick={() => {
              setFeedbackModal(true);
              setProfile(false);
              setFeedback('');
            }} className="px-3 py-2 flex items-center space-x-2 transition-all cursor-pointer rounded-lg hover:bg-gray-100 text-lightgray-300">
              <svg className="w-5 h-5" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
              <div className="text-base">의견 보내기</div>
            </div>
            <div className="w-full px-3">
              <div className="w-full h-[1px] my-2 bg-lightgray-100"></div>
            </div>
            <div onClick={() => signOut()} className="px-3 py-2 flex items-center space-x-2 transition-all cursor-pointer rounded-lg hover:bg-gray-100 text-red-500">
              <svg className="w-5 h-5" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
              <div className="text-base">로그아웃</div>
            </div>
          </div>
        </UpModal> }
      </AnimatePresence>
      <div onClick={() => setProfile(true)} className="hidden xl:flex mb-5 space-x-3 px-4 py-2 mt-2 rounded-2xl hover:bg-gray-100 active:bg-gray-200 transition-all cursor-pointer">
        <div className="w-[55px] h-[55px] relative flex justify-center items-center bg-gray-100 border-[1px] border-lightgray-100 rounded-[17px]">
          <svg className="w-10 h-10 fill-gray-300 stroke-gray-300" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </div>
        <div className="flex flex-col justify-center">
          <div>
            { load && <OpacityAnimation>
              <div className="font-bold text-[17.5px] -mb-0 text-zinc-800">{document?.cookie.split('; ').find(row => row.startsWith('name='))?.split('=')[1]}</div>
            </OpacityAnimation> }
            { load && <OpacityAnimation>
              { document.cookie.split('; ').find(row => row.startsWith('type='))?.split('=')[1] === '0' ? <div className="text-lightgray-200">{document.cookie.split('; ').find(row => row.startsWith('grade='))?.split('=')[1]}학년 {document.cookie.split('; ').find(row => row.startsWith('class='))?.split('=')[1]}반 {document.cookie.split('; ').find(row => row.startsWith('number='))?.split('=')[1]}번</div> : <div className="text-lightgray-200">교사</div> }
            </OpacityAnimation> }
          </div>
        </div>
      </div>
      <div onClick={() => setProfile(true)} className="w-[45px] h-[45px] xl:hidden visible flex justify-center overflow-hidden items-center bg-white border-[1px] border-lightgray-100 rounded-[15px] curpos-pointer mx-[3px] mb-3 cursor-pointer">
        <div className="w-[45px] h-[45px] relative flex justify-center items-center bg-gray-100 border-lightgray-100 rounded-[17px]">
          <svg className="w-8 h-8 fill-gray-300 stroke-gray-300" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </div>
      </div>
    </>
  )
}