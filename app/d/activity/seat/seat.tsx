'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useSWR from 'swr';
import { OpacityAnimation } from "@components/animation";
import { AnimatePresence } from "framer-motion";
import Modal from "@components/modal";
import ActivityDetail from "../activity-detail";

export default function Seat() {

  const [grade, setGrade] = useState(1);
  const [time, setTime] = useState('1');

  const { data:user } = useSWR('/api/user');
  useEffect(() => {
    if(user?.success === true) {
      if(user.user.grade) setGrade(user.user.grade);
    }
  }, [user]);

  const { data } = useSWR(`/api/activity/seat?grade=${grade}&time=${time}`);

  // 추가: 좌석별 가장 빠른 activity를 저장할 상태
  const [seatActivityMap, setSeatActivityMap] = useState<{[seatId: number]: any}>({});

  useEffect(() => {
    if (data?.activity && data?.seat) {
      // 좌석별로 가장 빨리 생성된 activity를 매핑
      const map: {[seatId: number]: any} = {};
      data.seat.forEach((seatUser: any) => {
        const userActivities = data.activity.filter(
          (a: any) => a.writer?.id === seatUser.id
        );
        if (userActivities.length > 0) {
          // createdAt이 빠른 순으로 정렬 (createdAt이 없으면 id 기준)
          userActivities.sort((a: any, b: any) => {
            if (a.createdAt && b.createdAt) {
              return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }
            return a.id - b.id;
          });
          map[seatUser.seat] = userActivities[0];
        }
      });
      setSeatActivityMap(map);
    } else {
      setSeatActivityMap({});
    }
  }, [data]);

  const [detailModal, setDetailModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  return (
    <>
      <AnimatePresence initial={false} mode="wait">
        { detailModal && <Modal scroll handleClose={() => setDetailModal(false)}>
          <ActivityDetail data={selectedActivity} fn={() => setDetailModal(false)} />
        </Modal> }
      </AnimatePresence>
      <div className="flex space-x-4 md:space-x-6 md:text-base text-sm">
        <div onClick={() => setGrade(1)} className={ grade === 1 ? "border-b-2 border-zinc-800 pb-3 cursor-pointer" : "border-b-0 border-zinc-800 pb-3 cursor-pointer" }>
          <div className={ grade === 1 ? "font-bold" : "font-bold text-lightgray-200" }>1학년</div>
        </div>
        <div onClick={() => setGrade(2)} className={ grade === 2 ? "border-b-2 border-zinc-800 pb-3 cursor-pointer" : "border-b-0 border-zinc-800 pb-3 cursor-pointer" }>
          <div className={ grade === 2 ? "font-bold" : "font-bold text-lightgray-200" }>2학년</div>
        </div>
        <div onClick={() => setGrade(3)} className={ grade === 3 ? "border-b-2 border-zinc-800 pb-3 cursor-pointer" : "border-b-0 border-zinc-800 pb-3 cursor-pointer" }>
          <div className={ grade === 3 ? "font-bold" : "font-bold text-lightgray-200" }>3학년</div>
        </div>
      </div>
      <div className="w-full h-[1px] mb-5 bg-lightgray-100"></div>
      <div className="flex">
        <div className="flex rounded-full px-1 py-1 bg-gray-100 md:w-auto w-full text-sm">
          <div onClick={() => setTime('1')} className={ time === '1' ? "rounded-full w-full py-1 md:w-[100px] md:py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer" : "rounded-full w-full py-1 md:w-[100px] md:py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-colors" }>7교시</div>
          <div onClick={() => setTime('2')} className={ time === '2' ? "rounded-full w-full py-1 md:w-[100px] md:py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer" : "rounded-full w-full py-1 md:w-[100px] md:py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-colors" }>8교시</div>
          <div onClick={() => setTime('3')} className={ time === '3' ? "rounded-full w-full py-1 md:w-[100px] md:py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer" : "rounded-full w-full py-1 md:w-[100px] md:py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-colors" }>야자 1</div>
          <div onClick={() => setTime('4')} className={ time === '4' ? "rounded-full w-full py-1 md:w-[100px] md:py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer" : "rounded-full w-full py-1 md:w-[100px] md:py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-colors" }>야자 2</div>
          <div onClick={() => setTime('5')} className={ time === '5' ? "rounded-full w-full py-1 md:w-[100px] md:py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer" : "rounded-full w-full py-1 md:w-[100px] md:py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-colors" }>야자 3</div>
        </div>
      </div>
      <div className="mt-8 flex flex-col overflow-x-auto">
        {!(data?.success === true && user?.success === true) ? (
          <div className="w-full">
            <div className="flex flex-col">
              {[...Array(14)].map((_, rowIdx) => (
                <div className={ (rowIdx+1)%2 === 0 ? "flex space-x-1 !mb-6" : "flex space-x-1 mb-1" } key={rowIdx}>
                  {[...Array(6)].map((_, colIdx) => {
                    const MR = colIdx === 2 ? "!mr-6" : ""
                    return (
                      <div
                        className={`${MR} bg-gray-100 animate-pulse rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center`}
                        key={colIdx}
                      ></div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <OpacityAnimation>
            <div className="w-full flex flex-col">
              {[...Array(14)].map((_, rowIdx) => (
                <div className={ (rowIdx+1)%2 === 0 ? "flex space-x-1 !mb-6" : "flex space-x-1 mb-1" } key={rowIdx}>
                  {[...Array(6)].map((_, colIdx) => {
                    // 학년에 따라 백의 자리 결정
                    const base = grade === 1 ? 200 : grade === 2 ? 300 : 400;
                    const seatNumber = base + 1 + rowIdx * 6 + colIdx;
                    if (seatNumber > base + 84) return null;
                    const seatUser = data.seat?.find((u:any) => u.seat === seatNumber);
                    // 해당 좌석 유저의 승인된 활동 존재 여부 확인
                    const hasApprovedActivity = !!seatActivityMap[seatNumber];
                    const seatBgClass = hasApprovedActivity
                      ? "bg-blue-100 hover:bg-blue-200"
                      : "bg-gray-100 hover:bg-gray-200";
                    const MR = colIdx === 2 ? "!mr-6" : ""
                    // 가장 빠른 activity 정보
                    const firstActivity = seatActivityMap[seatNumber];
                    return (
                      <div
                        key={colIdx}
                        className={`${seatBgClass} ${MR} cursor-pointer transition-colors rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center`}
                        onClick={() => {
                          if(firstActivity) {
                            setSelectedActivity(firstActivity);
                            setDetailModal(true);
                          }
                        }}
                      >
                        {seatUser ? (
                          <>
                            <div className={ hasApprovedActivity ? "font-bold text-blue-500" : "font-bold" }>{seatUser.name}</div>
                            <div className={ hasApprovedActivity ? "text-xs text-blue-500" : "text-xs text-zinc-500" }>
                              {seatUser.grade}{seatUser.class}{seatUser.number < 10 ? `0${seatUser.number}` : seatUser.number}
                            </div>
                            {/* 필요하다면 firstActivity 정보 활용 가능 */}
                          </>
                        ) : (
                          <div className="text-lightgray-200 text-xs">비어있음</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </OpacityAnimation>
        )}
      </div>
    </>
  );
}
