'use client';

import Button, { CircleButton, SubButton } from "@components/button";
import Input, { DateInput, InputButton, Textarea } from "@components/input";
import Modal from "@components/modal";
import useSWR from "swr";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { OpacityAnimation } from "@components/animation";
import { isWeekend } from "@libs/client/perio-display";

export default function PasscardButton() {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const [time, setTime] = useState<null | number>(null);
  useEffect(() => {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();

    if (minutes >= 15 * 60 + 20 && minutes < 16 * 60 + 20) {
      setTime(1);
    } else if (minutes >= 16 * 60 + 20 && minutes < 17 * 60 + 40) {
      setTime(2);
    } else if (minutes >= 18 * 60 + 10 && minutes < 19 * 60 + 50) {
      setTime(3);
    } else if (minutes >= 19 * 60 + 55 && minutes < 21 * 60 + 10) {
      setTime(4);
    } else if (minutes >= 21 * 60 + 20 && minutes < 23 * 60 + 30) {
      setTime(5);
    } else {
      setTime(null);
    }
  }, []);
  const { data } = useSWR(`/api/activity/passcard?time=${time}`, { refreshInterval: 10000 });
  const { data: user } = useSWR('/api/user');

  return (
    <div>
      <AnimatePresence initial={false} mode="wait">
        { modal && <Modal handleClose={() => setModal(false)}>
          <div className="w-full md:w-[420px] h-[580px] relative">
            <div className="-top-5 -left-5 -right-5 -bottom-5 rounded-2xl absolute bg-gradient-to-br from-green-50 via-white to-green-100 p-5 shadow-xl border border-green-200">
              {/* 헤더 */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                  {/* <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div> */}
                  <div className="text-green-800 font-bold text-lg">패스카드</div>
                </div>
                <div onClick={() => setModal(false)} className="p-1 rounded-full bg-green-200/50 hover:bg-green-200 transition-all cursor-pointer">
                  <svg className="w-6 h-6 p-1 rounded-full stroke-green-500" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>

              {/* 카드 내용 */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100 mb-4">
                {/* 승인 상태 */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-ping"></div>
                    </div>
                    <span className="text-green-800 font-bold text-lg">
                      { isWeekend() ? (
                        <>
                          { time === 1 && data?.activity?.perio.includes('1') && '1교시 활동 승인됨' }
                          { time === 2 && data?.activity?.perio.includes('2') && '2교시 활동 승인됨' }
                          { time === 3 && data?.activity?.perio.includes('3') && '3교시 활동 승인됨' }
                          { time === 4 && data?.activity?.perio.includes('4') && '4교시 활동 승인됨' }
                        </>
                      ) : (
                        <>
                          { time === 1 && data?.activity?.perio.includes('1') && '7교시 활동 승인됨' }
                          { time === 2 && data?.activity?.perio.includes('2') && '8교시 활동 승인됨' }
                          { time === 3 && data?.activity?.perio.includes('3') && '야자 1교시 활동 승인됨' }
                          { time === 4 && data?.activity?.perio.includes('4') && '야자 2교시 활동 승인됨' }
                          { time === 5 && data?.activity?.perio.includes('5') && '야자 3교시 활동 승인됨' }
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* 학생 정보 */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600 mb-1">학생</div>
                    <div className="font-bold text-gray-800">
                      {user?.user?.name} ({user?.user?.grade}{user?.user?.class}{user?.user?.number < 10 ? `0${user?.user?.number}` : user?.user?.number})
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600 mb-1">승인 시간</div>
                    <div className="font-bold text-gray-800">
                      {data?.activity?.updatedAt ? new Date(data.activity.updatedAt).toLocaleTimeString('ko-KR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      }) : '--:--'}
                    </div>
                  </div>
                </div>

                {/* 활동 정보 */}
                <div className="space-y-3 mb-6">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-sm text-green-700 mb-2 font-medium">활동 내용</div>
                    <div className="text-green-800 font-bold">{data?.activity?.content || '활동 내용 없음'}</div>
                  </div>
                  
                  {data?.activity?.location && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-sm text-blue-700 mb-2 font-medium">활동 장소</div>
                      <div className="text-blue-800 font-bold">{data.activity.location}</div>
                    </div>
                  )}

                  {data?.activity?.relation && data.activity.relation.length > 0 && (
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="text-sm text-purple-700 mb-2 font-medium">참여 학생</div>
                      <div className="text-purple-800 font-bold">
                        {data.activity.relation.map((rel: any, idx: number) => 
                          `${rel.user.name}${idx < data.activity.relation.length - 1 ? ', ' : ''}`
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* QR 코드 영역 (시각적 효과) */}
                <div className="flex justify-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="grid grid-cols-8 gap-px">
                      {[...Array(64)].map((_, i) => (
                        <div key={i} className={`w-1 h-1 ${Math.random() > 0.5 ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 안내 텍스트 */}
              <div className="text-center text-sm text-green-700 bg-green-50 rounded-lg p-3">
                이 패스카드를 담당 교사에게 제시하여 승인 여부를 확인받으세요.
              </div>
            </div>
          </div>
        </Modal> }
      </AnimatePresence>
      
      <div className="md:block hidden">
        { (data?.success === true && data.activity !== null) && <OpacityAnimation>
          <SubButton color="lightgreen" fn={() => {
            setModal(true);
          }}>
            <div className="flex items-center ml-4 mr-5">
              <svg className="w-5 h-5 mr-1" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
              </svg>
              패스카드 사용하기
            </div>
          </SubButton>
        </OpacityAnimation> }
      </div>
    </div>
  )
}