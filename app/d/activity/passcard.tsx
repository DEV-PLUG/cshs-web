'use client';

import Button, { CircleButton, SubButton } from "@components/button";
import Input, { DateInput, InputButton, Textarea } from "@components/input";
import Modal from "@components/modal";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function PasscardButton() {
  const [modal, setModal] = useState(false);

  const dispatch = useDispatch();

  return (
    <div>
      <AnimatePresence initial={false} mode="wait">
        { modal && <Modal handleClose={() => setModal(false)}>
          <div className="w-full md:w-[380px] h-[520px] relative">
            <div className="-top-5 -left-5 -right-5 -bottom-5 rounded-2xl absolute bg-gradient-to-b from-green-100 to-white p-5">
              <div className="flex justify-end">
                <div onClick={() => setModal(false)} className="p-1 rounded-full bg-green-200/50 hover:bg-green-200s transition-all cursor-pointer">
                  <svg className="w-6 h-6 p-1 rounded-full stroke-green-500" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col justify-between h-full">
                <div className="pb-20">
                  <div className="font-bold text-green-800 text-2xl mt-5">8교시 활동 승인됨</div>
                  <div className="text-green-800 text-base mt-1">이 카드를 제시하면 담당 교사가 승인 여부를 즉시 확인할 수 있습니다.</div>
                </div>
              </div>
            </div>
          </div>
        </Modal> }
      </AnimatePresence>
      <div className="md:block hidden">
      <SubButton color="lightgreen" fn={() => {
        setModal(true);
      }}>
        <div className="flex items-center ml-4 mr-5">
          <svg className="w-5 h-5 mr-1" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
          </svg>
          패스카드 사용하기
        </div>
      </SubButton>
    </div>
    </div>
  )
}