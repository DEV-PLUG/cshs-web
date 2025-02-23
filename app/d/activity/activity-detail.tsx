'use client';

import Input, { DateInput, InputButton, Textarea } from "@components/input";
import { setNotification } from "@libs/client/redux/notification";
import { useEffect, useState } from "react";
import errorMessage from "@libs/client/error-message";
import { useAppDispatch } from "@libs/client/redux/hooks";
import useSWR from "swr";
import { OpacityAnimation } from "@components/animation";
import Button from "@components/button";

export default function ActivityDetail({ data, fn }:{ data:any, fn():void }) {

  const dispatch = useAppDispatch();

  const { data:user, error } = useSWR('/api/user');

  const [loading, setLoading] = useState(false);
  async function deleteActivity() {
    if(loading) return;
    setLoading(true);

    await fetch(`/api/activity`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: data.id
      })
    })
    .then((response) => response.json())
    .then((response) => {
      setLoading(false);
      if(response.success === true) {
        fn();
        dispatch(setNotification({ type: 'success', text: '해당 내역을 삭제했어요' }));
        data.mutateActivity();
      } else {
        dispatch(setNotification({ type: 'error', text: errorMessage.unknown }));
      }
    });
  }
  async function quitActivity() {
    if(loading) return;
    setLoading(true);

    await fetch(`/api/activity/quit`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: data.id
      })
    })
    .then((response) => response.json())
    .then((response) => {
      setLoading(false);
      if(response.success === true) {
        fn();
        dispatch(setNotification({ type: 'success', text: '해당 활승에서 제외됐어요' }));
        data.mutateActivity();
      } else {
        dispatch(setNotification({ type: 'error', text: errorMessage.unknown }));
      }
    });
  }

  return (
    <div>
      <div className="w-full md:w-[380px] h-[520px]">
        <div className="flex justify-end">
          <div onClick={() => fn()} className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer">
            <svg className="w-6 h-6 p-1 rounded-full stroke-gray-400" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className="pb-0">
            <div className="flex justify-between items-end">
              <div>
                <div className="font-bold text-zinc-800 text-2xl mt-5">활동 승인 내역</div>
                <div className="flex mt-1">
                  { data.status === 0 && <div className="px-2 text-sm bg-orange-500/10 text-orange-500 rounded-lg">승인 대기중</div> }
                  { data.status === 1 && <div className="px-2 text-sm bg-green-500/10 text-green-500 rounded-lg">승인됨</div> }
                </div>
              </div>
              <div className="flex space-x-1">
                { user?.success === true && data.writer.id === user.user.id && <OpacityAnimation>
                  <div onClick={() => deleteActivity()} className="w-7 h-7 bg-blue-500/20 hover:bg-blue-600/20 transition-colors cursor-pointer flex items-center justify-center rounded-lg">
                    <svg className="w-5 h-5 stroke-blue-500" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </div>
                </OpacityAnimation> }
                { user?.success === true && data.relation.some((relation:{ user: { id: number } }) => relation.user.id === user.user.id) && <OpacityAnimation>
                  <div onClick={() => quitActivity()} className="w-7 h-7 bg-blue-500/20 hover:bg-blue-600/20 transition-colors cursor-pointer flex items-center justify-center rounded-lg">
                    <svg className="w-5 h-5 stroke-blue-500" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                    </svg>
                  </div>
                </OpacityAnimation> }
              </div>
            </div>
            <div>
              <div className="text-zinc-800 mb-1 mt-5">활동 내용</div>
              <Input value={data.content} disabled />
            </div>
            <div>
              <div className="text-zinc-800 mb-1 mt-5">활동 장소</div>
              <InputButton value={data.place.place}/>
            </div>
            <div>
              <div className="text-zinc-800 mb-1 mt-5">활동 시간</div>
              <div className="flex rounded-full px-1 py-1 bg-gray-100">
                <div className={ data.perio.split(',').indexOf('1') === -1 ? "rounded-full w-[100px] py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-all text-sm" : `${data.perio.split(',').indexOf('2') === -1 ? 'rounded-full' : 'rounded-l-full'} w-[100px] py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer transition-all text-sm` }>7교시</div>
                <div className={ data.perio.split(',').indexOf('2') === -1 ? "rounded-full w-[100px] py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-all text-sm" : `${data.perio.split(',').indexOf('1') === -1 && 'rounded-l-full'} ${data.perio.split(',').indexOf('3') === -1 && 'rounded-r-full'} w-[100px] py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer text-sm` }>8교시</div>
                <div className={ data.perio.split(',').indexOf('3') === -1 ? "rounded-full w-[100px] py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-all text-sm" : `${data.perio.split(',').indexOf('2') === -1 && 'rounded-l-full'} ${data.perio.split(',').indexOf('4') === -1 && 'rounded-r-full'} w-[100px] py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer text-sm` }>야자 1</div>
                <div className={ data.perio.split(',').indexOf('4') === -1 ? "rounded-full w-[100px] py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-all text-sm" : `${data.perio.split(',').indexOf('3') === -1 && 'rounded-l-full'} ${data.perio.split(',').indexOf('5') === -1 && 'rounded-r-full'} w-[100px] py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer text-sm` }>야자 2</div>
                <div className={ data.perio.split(',').indexOf('5') === -1 ? "rounded-full w-[100px] py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-all text-sm" : `${data.perio.split(',').indexOf('4') === -1 ? 'rounded-full' : 'rounded-r-full'} w-[100px] py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer transition-all text-sm` }>야자 3</div>
              </div>
            </div>
            <div>
              <div className="text-zinc-800 mb-1 mt-5">담당 교사</div>
              <InputButton value={ data.teacher.name }/>
            </div>
            <div className="mb-3">
              <div className="text-zinc-800 mb-1 mt-5">추가 구성원</div>
              <InputButton value={ data.relation.length <= 0 ? '없음' : data.relation.length === 1 ? data.relation[0].user.name : data.relation.length === 2 ? `${data.relation[0].user.name}, ${data.relation[1].user.name}` : `${data.relation[0].user.name}, ${data.relation[1].user.name} 외 ${data.relation.length - 2}명` }/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}