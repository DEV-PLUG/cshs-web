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
import SelectMember from "@components/member";
import Switch from "@components/switch";
import SelectPlace from "@components/place";
import { OpacityAnimation } from "@components/animation";
import PasscardButton from "./passcard";
import { useAppSelector } from "@libs/client/redux/hooks";
import displayPerio, { isWeekend } from "@libs/client/perio-display";

export function AddTeacherActivityContent({ fn, contentInput = '결석', timeInput = [], selectedInput = [], memberFn }:{ fn():void, contentInput?:string, timeInput?:number[], selectedInput?:{ id: number; class: number; grade: number; number: number; profile: string; name: string; }[], memberFn:(value:boolean) => void }) {
  const [content, setContent] = useState(contentInput);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  async function postActivity() {
    if(loading) return;

    if(content.length <= 0 || content.length > 20) {
      return dispatch(setNotification({ type: "error", text: "활동 내용은 비어있거나 20자 이상일 수 없어요" }));
    }
    if(time.length <= 0) {
      return dispatch(setNotification({ type: "error", text: "시간을 선택하세요" }));
    }
    if(selected.length <= 0) {
      return dispatch(setNotification({ type: "error", text: "학생을 선택하세요" }));
    }
    if (time.length > 1) {
      const sortedTime = [...time].sort((a, b) => a - b);
      for (let i = 1; i < sortedTime.length; i++) {
        if (sortedTime[i] !== sortedTime[i - 1] + 1) {
          return dispatch(setNotification({ type: "error", text: "시간은 연속적이어야 해요" }));
        }
      }
    }

    setLoading(true);
    await fetch(`/api/activity/teacher`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content,
        to: selected.map((member) => member.id),
        time
      })
    })
    .then((response) => response.json())
    .then((response) => {
      setLoading(false);
      if(response.success === true) {
        dispatch(setNotification({ type: "success", text: '활동을 기록했어요' }));
        if(fn) fn();
        setTimeout(() => {
          location.reload();
        }, 500);
      } else {
        dispatch(setNotification({ type: "error", text: response.message }));
      }
    });
  }

  const [selected, setSelected] = useState<{ id: number; class: number; grade: number; number: number; profile: string; name: string; }[]>(selectedInput);

  const [time, setTime] = useState<number[]>(timeInput);

  return (
    <div>
      <div className="w-full md:w-[380px] h-[580px]">
        <div className="flex justify-end">
          <div onClick={() => fn && fn()} className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer">
            <svg className="w-6 h-6 p-1 rounded-full stroke-gray-400" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className="pb-20">
            <div className="font-bold text-zinc-800 text-2xl mt-5">활동 기록하기</div>
            <div className="text-blue-500 bg-blue-100 text-sm p-2 rounded-xl mt-5">
              기록하면 해당 학생의 좌석이 주황색으로 표시되며, 학생이 해당 기록을 임의로 삭제할 수 없습니다.
            </div>
            <div>
              <div className="text-zinc-800 mb-1 mt-5">내용</div>
              <div className="my-1 flex items-center space-x-1">
                <div onClick={() => setContent('결석')} className={ content === '결석' ? "p-1 px-2 bg-blue-100 text-blue-500 hover:bg-blue-200 transition-colors rounded-lg cursor-pointer" : "p-1 px-2 bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors rounded-lg cursor-pointer" }>결석</div>
                <div onClick={() => setContent('지각')} className={ content === '지각' ? "p-1 px-2 bg-blue-100 text-blue-500 hover:bg-blue-200 transition-colors rounded-lg cursor-pointer" : "p-1 px-2 bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors rounded-lg cursor-pointer" }>지각</div>
                <div onClick={() => setContent('병원')} className={ content === '병원' ? "p-1 px-2 bg-blue-100 text-blue-500 hover:bg-blue-200 transition-colors rounded-lg cursor-pointer" : "p-1 px-2 bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors rounded-lg cursor-pointer" }>병원</div>
                <div onClick={() => setContent('외출')} className={ content === '외출' ? "p-1 px-2 bg-blue-100 text-blue-500 hover:bg-blue-200 transition-colors rounded-lg cursor-pointer" : "p-1 px-2 bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors rounded-lg cursor-pointer" }>외출</div>
                <div onClick={() => setContent('')} className={ !(content === '결석' || content === '지각' || content === '병원' || content === '외출') ? "p-1 px-2 bg-blue-100 text-blue-500 hover:bg-blue-200 transition-colors rounded-lg cursor-pointer" : "p-1 px-2 bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors rounded-lg cursor-pointer" }>기타(직접 입력)</div>
              </div>
              { !(content === '결석' || content === '지각' || content === '병원' || content === '외출') && <Input value={content} placeholder="결석/병원/외출 등" fn={(value:string) => setContent(value)} /> }
            </div>
            <div>
              <div className="text-zinc-800 mb-1 mt-5">시간</div>
              <div className="flex rounded-full px-1 py-1 bg-gray-100">
                <div onClick={() => {
                  if(time.indexOf(1) === -1) {
                    setTime([...time, 1]);
                  } else {
                    setTime(time.filter((item) => item !== 1));
                  }
                }} className={ time.indexOf(1) === -1 ? "rounded-full w-[100px] py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-all text-sm" : `${time.indexOf(2) === -1 ? 'rounded-full' : 'rounded-l-full'} w-[100px] py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer transition-all text-sm` }>{displayPerio(1)}</div>
                <div onClick={() => {
                  if(time.indexOf(2) === -1) {
                    setTime([...time, 2]);
                  } else {
                    setTime(time.filter((item) => item !== 2));
                  }
                }} className={ time.indexOf(2) === -1 ? "rounded-full w-[100px] py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-all text-sm" : `${time.indexOf(1) === -1 && 'rounded-l-full'} ${time.indexOf(3) === -1 && 'rounded-r-full'} w-[100px] py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer text-sm` }>{displayPerio(2)}</div>
                <div onClick={() => {
                  if(time.indexOf(3) === -1) {
                    setTime([...time, 3]);
                  } else {
                    setTime(time.filter((item) => item !== 3));
                  }
                }} className={ time.indexOf(3) === -1 ? "rounded-full w-[100px] py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-all text-sm" : `${time.indexOf(2) === -1 && 'rounded-l-full'} ${time.indexOf(4) === -1 && 'rounded-r-full'} w-[100px] py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer text-sm` }>{displayPerio(3, 2)}</div>
                <div onClick={() => {
                  if(time.indexOf(4) === -1) {
                    setTime([...time, 4]);
                  } else {
                    setTime(time.filter((item) => item !== 4));
                  }
                }} className={ time.indexOf(4) === -1 ? "rounded-full w-[100px] py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-all text-sm" : `${time.indexOf(3) === -1 && 'rounded-l-full'} ${time.indexOf(5) === -1 && 'rounded-r-full'} w-[100px] py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer text-sm` }>{displayPerio(4, 2)}</div>
                { !isWeekend() && <div onClick={() => {
                  if(time.indexOf(5) === -1) {
                    setTime([...time, 5]);
                  } else {
                    setTime(time.filter((item) => item !== 5));
                  }
                }} className={ time.indexOf(5) === -1 ? "rounded-full w-[100px] py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-all text-sm" : `${time.indexOf(4) === -1 ? 'rounded-full' : 'rounded-r-full'} w-[100px] py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer transition-all text-sm` }>야자 3</div> }
              </div>
            </div>
            <div className="mb-3">
              <div className="text-zinc-800 mb-1 mt-5">해당 학생</div>
              <InputButton value={ selected.length <= 0 ? '이곳을 눌러 선택하세요' : selected.length === 1 ? selected[0].name : selected.length === 2 ? `${selected[0].name}, ${selected[1].name}` : `${selected[0].name}, ${selected[1].name} 외 ${selected.length - 2}명` } fn={() => {
                if(fn) fn();
                setTimeout(() => {
                  memberFn(true);
                }, 150);
              }}/>
            </div>
          </div>
        </div>
        <div className="absolute bottom-5 w-full right-0 left-0 pl-5 pr-5 md:pr-7">
          <div className="w-full md:w-[380px] h-8 bg-white -bottom-5 absolute"></div>
          <Button color="blue" loading={loading} fn={() => postActivity()}>
            기록하기
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function AddTeacherActivityButton() {
  const [modal, setModal] = useState(false);
  const [content, setContent] = useState('결석');

  const [memberModal, setMemberModal] = useState(false);
  const [selected, setSelected] = useState<{ id: number; class: number; grade: number; number: number; profile: string; name: string; }[]>([]);

  const [time, setTime] = useState<number[]>([]);

  const userInfo = useAppSelector(state => state.userInfo);

  return (
    <div>
      <AnimatePresence initial={false} mode="wait">
        { memberModal && <Modal handleClose={() => {
          setMemberModal(false);
          setTimeout(() => {
            setModal(true);
          }, 150);
        }}>
          <SelectMember disableGroup disableFavorite limit={1} selected={selected} fn={(selected) => {
            setSelected(selected);
            setMemberModal(false);
            setTimeout(() => {
              setModal(true);
            }, 150);
          }} />
        </Modal> }
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait">
        { modal && <Modal handleClose={() => setModal(false)}>
          <AddTeacherActivityContent fn={() => setModal(false)} memberFn={(value:boolean) => setMemberModal(value)} contentInput={content} timeInput={time} selectedInput={selected} />
        </Modal> }
      </AnimatePresence>
      <div className="flex items-center space-x-2">
        { (userInfo.name !== '' && userInfo.type === 1) && <div className="md:block hidden">
          <SubButton color="blue" fn={() => {
            setContent('결석');
            setSelected([]);
            setModal(true);
            setTime([]);
          }}>
            <div className="flex items-center ml-4 mr-5">
              <svg className="w-5 h-5 mr-1" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              활동 기록하기
            </div>
          </SubButton>
        </div> }
      </div>
      { userInfo.type === 1 && <OpacityAnimation>
        <div className="md:hidden block fixed bottom-20 right-4 z-30">
          <CircleButton color="blue" fn={() => {
            setContent('결석');
            setSelected([]);
            setModal(true);
            setTime([]);
          }}>
            <div className="flex items-center mx-3">
              <svg className="w-6 h-6 m-[5px]" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
          </CircleButton>
        </div>
      </OpacityAnimation> }
    </div>
  )
}