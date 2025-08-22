'use client';

import Input, { DateInput, InputButton, Textarea } from "@components/input";
import { setNotification } from "@libs/client/redux/notification";
import { useEffect, useState } from "react";
import errorMessage from "@libs/client/error-message";
import { useAppDispatch, useAppSelector } from "@libs/client/redux/hooks";
import useSWR from "swr";
import { OpacityAnimation } from "@components/animation";
import Button from "@components/button";
import { AnimatePresence } from "framer-motion";
import Modal from "@components/modal";
import displayPerio, { isWeekend } from "@libs/client/perio-display";

export default function ActivityDetail({ data, fn }:{ data:any, fn():void }) {

  const dispatch = useAppDispatch();
  const { data:user } = useSWR('/api/user');

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
        if(data?.mutateActivity) data?.mutateActivity();
        else location.reload();
      } else {
        dispatch(setNotification({ type: 'error', text: errorMessage.unknown }));
      }
    });
  }
  
  const [fullMemberModal, setFullMemberModal] = useState(false);

  const userInfo = useAppSelector(state => state.userInfo);

  // 승인하기 버튼 로직 추가
  const [approveLoading, setApproveLoading] = useState(false);
  async function approveActivity() {
    if (approveLoading) return;
    setApproveLoading(true);
    await fetch(`/api/activity/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: data.id })
    })
    .then(res => res.json())
    .then(res => {
      setApproveLoading(false);
      if (res.success) {
        dispatch(setNotification({ type: 'success', text: '해당 활동을 승인했습니다' }));
        if(data?.mutateActivity) data?.mutateActivity();
        fn();
      } else {
        dispatch(setNotification({ type: 'error', text: res.message || '승인에 실패했습니다.' }));
      }
    });
  }

  return (
    <div>
      <AnimatePresence initial={false} mode="wait">
        { fullMemberModal && <Modal modalType="left" backdropType="transparent" handleClose={() => setFullMemberModal(false)}>
          <div className="w-full md:w-[320px] h-[340px] -m-4">
            <div className="flex flex-col h-full p-5 pr-3">
              <div className="font-bold text-sm text-gray-400 mb-3">추가 구성원 모두 보기</div>
              <div className="custom-scroll overflow-auto">
                {
                  data.relation.map((relation:{ user: { id: number; profile: string; name: string, grade: number, class: number, number: number } }) => (
                    <div key={relation.user.id} className="flex items-center space-x-2 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                        { relation.user.profile && <img src={relation.user.profile} alt="" className="w-full h-full object-cover" /> }
                      </div>
                      <div>
                        <div className="text-zinc-800 font-bold">{ relation.user.name }</div>
                        <div className="text-gray-400 text-sm">{relation.user.grade}학년 {relation.user.class}반 {relation.user.number}번</div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </Modal> }
      </AnimatePresence>
      { (location.href.includes("seat") && userInfo.type === 1) && <div onClick={() => data?.addTeacherActivity && data?.addTeacherActivity()} className="absolute -top-14 left-0 bg-blue-100 px-3 pl-4 p-3 rounded-xl transition-colors hover:bg-blue-200 flex items-center justify-between w-full space-x-2 text-blue-500 cursor-pointer">
        <div className="text-sm">해당 학생 결석, 지각, 외출 등 기록하기</div>
        <svg className="w-5 h-5" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </div> }
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
                  { data.status === 2 && <div className="px-2 text-sm bg-yellow-500/10 text-yellow-500 rounded-lg">교사 기록</div> }
                  { data.status === 0 && <div className="px-2 text-sm bg-orange-500/10 text-orange-500 rounded-lg">승인 대기중</div> }
                  { data.status === 1 && <div className="px-2 text-sm bg-green-500/10 text-green-500 rounded-lg">승인됨</div> }
                </div>
              </div>
              <div className="flex space-x-1">
                { (user?.success === true && ((data.writer.id === user.user.id && data.status !== 2) || (data.teacher.id === user.user.id && data.status === 2))) && <OpacityAnimation>
                  <div onClick={() => deleteActivity()} className="w-7 h-7 bg-blue-500/20 hover:bg-blue-600/20 transition-colors cursor-pointer flex items-center justify-center rounded-lg">
                    <svg className="w-5 h-5 stroke-blue-500" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </div>
                </OpacityAnimation> }
              </div>
            </div>
            { data.status === 2 && <div className="text-yellow-500 bg-yellow-100 text-sm p-2 rounded-xl mt-5">
              해당 활동은 담당 교사가 기록한 것으로, 학생이 해당 기록을 임의로 삭제할 수 없습니다.
            </div> }
            <div>
              <div className="text-zinc-800 mb-1 mt-5">활동 내용</div>
              <Input value={data.content} disabled />
            </div>
            { data.status !== 2 && <div>
              <div className="text-zinc-800 mb-1 mt-5">활동 장소</div>
              <InputButton value={data.place.place}/>
            </div> }
            <div>
              <div className="text-zinc-800 mb-1 mt-5">활동 시간</div>
              <div className="flex rounded-full px-1 py-1 bg-gray-100">
                <div className={ data.perio.split(',').indexOf('1') === -1 ? "rounded-full w-[100px] py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-all text-sm" : `${data.perio.split(',').indexOf('2') === -1 ? 'rounded-full' : 'rounded-l-full'} w-[100px] py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer transition-all text-sm` }>{displayPerio(1)}</div>
                <div className={ data.perio.split(',').indexOf('2') === -1 ? "rounded-full w-[100px] py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-all text-sm" : `${data.perio.split(',').indexOf('1') === -1 && 'rounded-l-full'} ${data.perio.split(',').indexOf('3') === -1 && 'rounded-r-full'} w-[100px] py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer text-sm` }>{displayPerio(2)}</div>
                <div className={ data.perio.split(',').indexOf('3') === -1 ? "rounded-full w-[100px] py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-all text-sm" : `${data.perio.split(',').indexOf('2') === -1 && 'rounded-l-full'} ${data.perio.split(',').indexOf('4') === -1 && 'rounded-r-full'} w-[100px] py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer text-sm` }>{displayPerio(3, 2)}</div>
                <div className={ data.perio.split(',').indexOf('4') === -1 ? "rounded-full w-[100px] py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-all text-sm" : `${data.perio.split(',').indexOf('3') === -1 && 'rounded-l-full'} ${data.perio.split(',').indexOf('5') === -1 && 'rounded-r-full'} w-[100px] py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer text-sm` }>{displayPerio(4, 2)}</div>
                { !isWeekend() &&  <div className={ data.perio.split(',').indexOf('5') === -1 ? "rounded-full w-[100px] py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-all text-sm" : `${data.perio.split(',').indexOf('4') === -1 ? 'rounded-full' : 'rounded-r-full'} w-[100px] py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer transition-all text-sm` }>야자 3</div> }
              </div>
            </div>
            { data.status !== 2 && <div className="mb-3">
              <div className="text-zinc-800 mb-1 mt-5">추가 구성원</div>
              <InputButton fn={() => data.relation.length > 0 && setFullMemberModal(true)} value={ data.relation.length <= 0 ? '없음' : data.relation.length === 1 ? data.relation[0].user.name : data.relation.length === 2 ? `${data.relation[0].user.name}, ${data.relation[1].user.name}` : `${data.relation[0].user.name}, ${data.relation[1].user.name} 외 ${data.relation.length - 2}명` }/>
            </div> }
            <div className="mb-3">
              <div className="text-zinc-800 mb-1 mt-5">담당 교사</div>
              <InputButton value={ data.teacher.name }/>
            </div>
            {/* 승인하기 버튼 추가 */}
            {user?.success === true && data.status === 0 && user.user.name === data.teacher.name && <div className="w-full h-20"></div> }
            {user?.success === true && data.status === 0 && user.user.name === data.teacher.name && (
              <div className="mt-4 absolute bottom-0 flex items-center flex-col right-7 left-5">
                <div className="w-full relative z-10">
                  <Button color="blue" loading={approveLoading} fn={approveActivity}>
                    <div className="w-full">승인하기</div>
                  </Button>
                </div>
                <div className="h-7 w-full bg-white relative bottom-2"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}