'use client';

import Button, { CircleButton, SubButton } from "@components/button";
import Input, { DateInput, InputButton, Textarea } from "@components/input";
import Modal from "@components/modal";
import { setNotification } from "@libs/client/redux/notification";
import displayDate from "@libs/client/time-display";
import dayjs from "dayjs";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useSWR, { mutate } from "swr";
import { useAppDispatch, useAppSelector } from "@libs/client/redux/hooks";
import Loading from "@components/loading";
import { OpacityAnimation } from "@components/animation";

export default function ApproveAllButton() {

  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [keyModal, setKeyModal] = useState(false);

  const userInfo = useAppSelector(state => state.userInfo);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'Enter' && userInfo.type === 1) {
        setModal(true);
      }
      if (event.key === 'Enter' && modal && !event.ctrlKey && !loading) {
        approveActivity();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modal, userInfo]);

  const dispatch = useAppDispatch();

  async function approveActivity() {
    if(loading) return;
    setLoading(true);

    await fetch(`/api/activity/approve/all`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) => response.json())
    .then((response) => {
      setLoading(false);
      if(response.success === true) {
        dispatch(setNotification({ type: "success", text: '요청을 일괄 승인했습니다' }));
        mutate('/api/activity/me?');
        setModal(false);
      } else {
        dispatch(setNotification({ type: "error", text: response.message }));
      }
    });
  }

  const { data } = useSWR(`/api/activity/me?`);

  return (
    <div>
      <AnimatePresence initial={false} mode="wait">
        { keyModal && <Modal handleClose={() => setKeyModal(false)}>
          <div className="w-full md:w-[380px] h-[520px]">
            <div className="flex justify-end">
              <div onClick={() => setKeyModal(false)} className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer">
                <svg className="w-6 h-6 p-1 rounded-full stroke-gray-400" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col justify-between h-full pb-0">
              <div className="mt-5">
                <div className="font-bold text-2xl">단축키 도움말</div>
                <div className="text-base text-lightgray-200 mt-2">쉽고 빠른 활승 승인을 위한 단축키를 확인해주세요</div>
                <div className="mt-5">
                  <div className="flex space-x-1 items-start">
                    <div className="border border-lightgray-100 bg-white px-[6px] drop-shadow-sm rounded-md text-base text-lightgray-200">Ctrl</div>
                    <div className="border border-lightgray-100 bg-white px-[6px] drop-shadow-sm rounded-md text-base text-lightgray-200">Enter</div>
                  </div>
                  <div className="text-sm text-lightgray-200 mt-1">활동 승인 요청을 일괄 승인할 것인지 확인하는 창을 표시할 수 있습니다. 이 페이지에서만 유효한 단축키입니다.</div>
                </div>
                <div className="mt-5">
                  <div className="flex space-x-1 items-start">
                    <div className="border border-lightgray-100 bg-white px-[6px] drop-shadow-sm rounded-md text-base text-lightgray-200">Enter</div>
                  </div>
                  <div className="text-sm text-lightgray-200 mt-1">확인 여부를 묻는 창에서 확인을 클릭합니다.</div>
                </div>
                <div className="mt-5">
                  <div className="flex space-x-1 items-start">
                    <div className="border border-lightgray-100 bg-white px-[6px] drop-shadow-sm rounded-md text-base text-lightgray-200">ESC</div>
                  </div>
                  <div className="text-sm text-lightgray-200 mt-1">작업을 취소하고 창을 닫습니다.</div>
                </div>
              </div>
            </div>
          </div>
        </Modal> }
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait">
        { modal && <Modal handleClose={() => setModal(false)}>
          <div className="md:w-[300px] h-auto">
            <div className="font-bold text-xl text-zinc-800">{data?.success === true && data.activity.before.length}개 항목을 모두 승인할까요?</div>
            <div className="flex items-center space-x-2 mt-5">
              <div onClick={() => setModal(false)} className="bg-gray-100 hover:bg-gray-200 text-base transition-all font-medium text-zinc-800 justify-center w-full py-3 flex items-center cursor-pointer rounded-xl">
                취소
              </div>
              { loading === false ? <div onClick={() => approveActivity()} className="bg-blue-500 hover:bg-blue-600 text-base transition-all font-medium text-white justify-center w-full py-3 flex items-center cursor-pointer rounded-xl">
                승인하기
              </div> : <div onClick={() => approveActivity()} className="bg-blue-500/50 text-base transition-all font-medium text-white justify-center w-full py-3 flex items-center rounded-xl h-[48px]">
                <div className="flex items-center justify-center">
                  <Loading size={20} />
                </div>
              </div> }
            </div>
          </div>
        </Modal> }
      </AnimatePresence>
      { userInfo.type === 1 && <div className="md:flex hidden items-center space-x-2">
          <SubButton color="white" fn={() => setKeyModal(true)}>
            <div className="flex items-center space-x-1">
              <svg className="stroke-gray-400 w-5 h-5" fill="none" strokeWidth={1.7} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
              </svg>
              <div className="font-bold">단축키 도움말</div>
            </div>
          </SubButton>
          <SubButton color="blue" fn={() => {
            if(data?.success === true && data.activity.before.length <= 0) return dispatch(setNotification({ type: "info", text: '승인 대기중인 요청이 없습니다' }));
            setModal(true);
          }}>
            <div className="flex items-center ml-4 mr-5">
              <svg className="w-5 h-5 mr-1" fill="none" strokeWidth={1.7} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              요청 일괄 승인
            </div>
          </SubButton>
        </div> }
      { userInfo.type === 1 && <OpacityAnimation>
        <div className="md:hidden block fixed bottom-20 right-4 z-30">
          <CircleButton color="blue" fn={() => {
            if(data?.success === true && data.activity.before.length <= 0) return dispatch(setNotification({ type: "info", text: '승인 대기중인 요청이 없습니다' }));
            setModal(true);
          }}>
            <div className="flex items-center mx-3">
              <svg className="w-6 h-6 m-[5px]" fill="none" strokeWidth={1.7} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
          </CircleButton>
        </div>
      </OpacityAnimation> }
    </div>
  )
}