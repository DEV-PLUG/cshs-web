'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { mutate } from "swr";
import { AnimatePresence } from "framer-motion";
import Modal from "@components/modal";
import Button from "@components/button";
import { setNotification } from "@libs/client/redux/notification";
import { useAppDispatch } from "@libs/client/redux/hooks";
import errorMessage from "@libs/client/error-message";
import displayDate from "@libs/client/time-display";
import { OpacityAnimation } from "@components/animation";

export default function MemberDetailModal({ id, handleClose }:{ id:number, handleClose:()=>void }) {
  const dispatch = useAppDispatch();

  const [data, setData] = useState<any>(null);
  async function getTodoData() {
    await fetch(`/api/user/todo/send/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) => response.json())
    .then((response) => {
      if(response.success === true) {
        setData(response);
      } else {
        dispatch(setNotification({ type: 'error', text: errorMessage.unknown }));
      }
    });
  }

  useEffect(() => {
    getTodoData();
  }, []);

  return (  
    <div className="w-full md:w-[380px] h-[520px] mb-5">
      <div className="flex justify-end">
        <div onClick={handleClose} className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer">
          <svg className="w-6 h-6 p-1 rounded-full stroke-gray-400" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col justify-between h-full pb-8 mt-2 mb-5">
        <div className="pb-2">
          { !data && [...Array(20)].map((value, index) => {
            return ( 
              <div key={index} className="w-full h-16 rounded-xl px-5 flex items-center space-x-2 animate-pulse">
                <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
                <div className="space-y-1">
                  <div className="w-20 h-6 bg-gray-100 rounded-lg"></div>
                  <div className="w-40 h-3 bg-gray-100 rounded-md"></div>
                </div>
              </div>
            )
          }) }
          { (data && data.success === true) && data.todo.map((todo:any) => {
            return (
              <OpacityAnimation key={todo.id}>
                { <div className="w-full h-16 hover:bg-gray-50 transition-colors rounded-xl px-5 flex items-center justify-between space-x-2 cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-xl overflow-hidden">
                      <Image
                        src={todo.receiver.profile}
                        width={40}
                        height={40}
                        alt="프로필"
                      />
                    </div>
                    <div className="-space-y-0">
                      <div className="text-base font-bold">{todo.receiver.name}</div>
                      { todo.receiver.number ? <div className="text-sm text-lightgray-200">{todo.receiver.grade}학년 {todo.receiver.class}반 {todo.receiver.number}번</div> : <div className="text-sm text-lightgray-200">교사</div> }
                    </div>
                  </div>
                  { todo.status === 1 && <svg className="w-7 h-7 fill-emerald-500 !-mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path clipRule="evenodd" fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" />
                  </svg> }
                </div> }
              </OpacityAnimation>
            )
          }) }
        </div>
      </div>
    </div>
  )
}