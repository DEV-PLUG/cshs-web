'use client';

import Image from "next/image";
import { useState } from "react";
import { mutate } from "swr";
import { AnimatePresence } from "framer-motion";
import Modal from "@components/modal";
import Button from "@components/button";
import { setNotification } from "@libs/client/redux/notification";
import { useAppDispatch } from "@libs/client/redux/hooks";
import errorMessage from "@libs/client/error-message";
import displayDate from "@libs/client/time-display";
import MemberDetailModal from "./member-detail";

export default function TodoDetailModal({ data, open, handleClose, handleOpen }:{ data:any, open:boolean, handleClose:()=>void, handleOpen:()=>void }) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  async function deleteTodo() {
    if(loading) return;
    setLoading(true);

    await fetch(`/api/user/todo/send/${data.detail.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) => response.json())
    .then((response) => {
      setLoading(false);
      if(response.success === true) {
        handleClose();
        dispatch(setNotification({ type: 'success', text: '해당 내역을 삭제했어요' }));
        data.mutateTodo();
      } else {
        dispatch(setNotification({ type: 'error', text: errorMessage.unknown }));
      }
    });
  }

  const [memberModal, setMemberModal] = useState(false);

  return (  
    <>
      <AnimatePresence initial={false} mode="wait">
        { open && <Modal handleClose={handleClose}>
          <div className="w-full md:w-[380px] h-[520px]">
            <div className="flex justify-end">
              <div onClick={handleClose} className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer">
                <svg className="w-6 h-6 p-1 rounded-full stroke-gray-400" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col justify-between h-full pb-8">
              <div>
                <div className="text-3xl font-bold text-zinc-800 mt-5 mb-0">{data.detail.title}</div>
                <div className="text-lightgray-200 text-base mb-1">{displayDate(data.detail.deadline, 'date-without-year')} 마감 { displayDate(data.detail.deadline, 'date-left') === 0 ? '(오늘 마감)' : +displayDate(data.detail.deadline, 'date-left') > 0 ? `(${displayDate(data.detail.deadline, 'date-left')}일 남음)` : `(${-(+displayDate(data.detail.deadline, 'date-left'))}일 전)` }</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-[22px] h-[22px] flex justify-center overflow-hidden items-center bg-white rounded-[20px]">
                      <Image
                        src={data.detail.senderProfile}
                        width={22}
                        height={22}
                        alt=""
                      />
                    </div>
                    <div className="text-lightgray-200 text-base ml-2">{data.detail.senderName}</div>
                  </div>
                  <div className="flex space-x-1">
                    {/* <div className="w-7 h-7 bg-blue-500/20 hover:bg-blue-600/20 transition-colors cursor-pointer flex items-center justify-center rounded-lg">
                      <svg className="w-5 h-5 stroke-blue-500" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                      </svg>
                    </div> */}
                    <div onClick={() => deleteTodo()} className="w-7 h-7 bg-blue-500/20 hover:bg-blue-600/20 transition-colors cursor-pointer flex items-center justify-center rounded-lg">
                      <svg className="w-5 h-5 stroke-blue-500" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="w-full h-[1px] bg-lightgray-100 my-4"></div>
                <div className="text-lightgray-200 text-base whitespace-pre-wrap">{data.detail.description}</div>
              </div>
              { <Button color="blue" loading={loading} fn={() => {
                handleClose();
                setTimeout(() => {
                  setMemberModal(true);
                }, 150);
              }}>
                완료 여부 자세히 보기
              </Button> }
            </div>
          </div>
        </Modal> }
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait">
        { memberModal && <Modal scroll handleClose={() => {
          setMemberModal(false);
          setTimeout(() => {
            handleOpen();
          }, 150);
        }}>
          <MemberDetailModal id={data.detail.id} handleClose={() => {
            setMemberModal(false);
            setTimeout(() => {
              handleOpen();
            }, 150);
          }} />
        </Modal> }
      </AnimatePresence>
    </>
  )
}