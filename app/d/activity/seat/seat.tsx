'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useSWR from 'swr';
import { OpacityAnimation } from "@components/animation";
import { AnimatePresence } from "framer-motion";
import Modal from "@components/modal";
import ActivityDetail from "../activity-detail";
import displayPerio, { isWeekend } from "@libs/client/perio-display";
import CalendarButton from "@components/list-menu/calendar";

export default function Seat() {

  // const [grade, setGrade] = useState(1);
  // const [time, setTime] = useState('1');

  const { data:user } = useSWR('/api/user');
  useEffect(() => {
    if(user?.success === true) {
      if(user.user.grade) setGrade(user.user.grade);
    }
  }, [user]);

  // grade, time 초기값을 쿼리스트링에서 가져오도록 useState 인자에서 처리
  function getInitialGrade() {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlGrade = params.get('grade');
      if (urlGrade && !isNaN(Number(urlGrade))) return Number(urlGrade);
    }
    return 1;
  }
  function getInitialTime() {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlTime = params.get('time');
      if (urlTime) return urlTime;
    }
    return '1';
  }

  const [grade, setGrade] = useState(getInitialGrade);
  const [time, setTime] = useState(getInitialTime);

  useEffect(() => {
    if(typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlGrade = params.get('grade');
      const urlTime = params.get('time');
      if(urlGrade && !isNaN(Number(urlGrade))) setGrade(Number(urlGrade));
      if(urlTime) setTime(urlTime);
    }
  }, [window]);

  // grade, time이 바뀔 때마다 URL 쿼리스트링에 반영
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('grade', String(grade));
    params.set('time', String(time));
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [grade, time]);

  const [date, setDate] = useState<string | null>(null);
  const { data } = useSWR(`/api/activity/seat?grade=${grade}&time=${time}${ date ? `&date=${date}` : '' }`, { refreshInterval: 10000 });

  // 추가: 좌석별 가장 빠른 activity를 저장할 상태
  const [seatActivityMap, setSeatActivityMap] = useState<{[seatId: number]: any}>({});

  useEffect(() => {
    if (data?.activity && data?.seat) {
      // 좌석별로 가장 빨리 생성된 activity를 매핑
      const map: { [seatId: number]: any } = {};
      const approved: any[] = [];
      data.seat.forEach((seatUser: any) => {
        const userActivities = data.activity.filter((a: any) => {
          // writer 또는 relation에 포함된 경우
          const isWriter = a.writer?.id === seatUser.id;
          const isRelated =
            Array.isArray(a.relation) &&
            a.relation.some((rel: any) => rel.user.id === seatUser.id);
          return isWriter || isRelated;
        });
        if (userActivities.length > 0) {
          // createdAt이 빠른 순으로 정렬 (createdAt이 없으면 id 기준)
          userActivities.sort((a: any, b: any) => {
            if (a.createdAt && b.createdAt) {
              return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }
            return a.id - b.id;
          });
          map[seatUser.seat] = userActivities[0];
          // 승인된 활동이 있으면 approvedUser에 추가
          if (userActivities[0].status === 1 || userActivities[0].status === 2) {
            approved.push(seatUser);
          }
        }
      });
      setSeatActivityMap(map);
      setApprovedUser(approved);
    } else {
      setSeatActivityMap({});
      setApprovedUser([]);
    }
  }, [data]);

  const [detailModal, setDetailModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  function CustomSeat({ seatNumber, horizontal = false }: { seatNumber:number, horizontal?: boolean }) {
    // 학년에 따라 백의 자리 결정
    const seatUser = data.seat?.find((u:any) => u.seat === seatNumber);
    // 해당 좌석 유저의 승인된 활동 존재 여부 확인
    const hasApprovedActivity = !!seatActivityMap[seatNumber];
    // status가 2인 활동이 하나라도 있는지 확인
    const hasStatus2Activity = data.activity?.some((a:any) => {
      const isWriter = a.writer?.id === seatUser?.id;
      const isRelated = Array.isArray(a.relation) && a.relation.some((rel: any) => rel.user.id === seatUser?.id);
      return (isWriter || isRelated) && a.status === 2;
    });
    // 배경색 결정: status 2 > blue > gray
    let seatBgClass = "bg-gray-100 hover:bg-gray-200";
    if (hasStatus2Activity) {
      seatBgClass = "bg-yellow-100 hover:bg-yellow-200";
    } else if (hasApprovedActivity) {
      seatBgClass = "bg-blue-100 hover:bg-blue-200";
    }
    let firstActivity = seatActivityMap[seatNumber];
    if(hasStatus2Activity) {
      // status가 2인 활동 중 가장 먼저 생성된 것
      const status2List = data.activity.filter((a:any) => {
        const isWriter = a.writer?.id === seatUser?.id;
        const isRelated = Array.isArray(a.relation) && a.relation.some((rel: any) => rel.user.id === seatUser?.id);
        return (isWriter || isRelated) && a.status === 2;
      });
      if(status2List.length > 0) {
        firstActivity = status2List[0];
      }
    }

    return (
      <div
        className={horizontal === true ? `${seatBgClass} rounded-lg w-[85px] h-[60px] cursor-pointer flex flex-col items-center justify-center` : `${seatBgClass} rounded-lg w-[65px] h-[100px] cursor-pointer flex flex-col items-center justify-center`}
        onClick={() => {
          if(firstActivity) {
            setSelectedActivity(firstActivity);
            setDetailModal(true);
          }
        }}
      >
        {seatUser ? (
          <>
            <div className={ hasStatus2Activity ? 'font-bold text-yellow-500' : hasApprovedActivity ? "font-bold text-blue-500" : "font-bold" }>{seatUser.name}</div>
            <div className={ hasStatus2Activity ? 'text-xs text-yellow-500' : hasApprovedActivity ? "text-xs text-blue-500" : "text-xs text-zinc-500" }>
              {seatUser.grade}{seatUser.class}{seatUser.number < 10 ? `0${seatUser.number}` : seatUser.number}
            </div>
            {/* 필요하다면 firstActivity 정보 활용 가능 */}
          </>
        ) : (
          <div className="text-lightgray-200 text-xs">비어있음</div>
        )}
      </div>
    );
  }

  const [approvedUser, setApprovedUser] = useState<any[]>([]);
  const [fullMemberModal, setFullMemberModal] = useState(false);

  return (
    <>
      <AnimatePresence initial={false} mode="wait">
        { detailModal && <Modal scroll handleClose={() => setDetailModal(false)}>
          <ActivityDetail data={selectedActivity} fn={() => setDetailModal(false)} />
        </Modal> }
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait">
        { fullMemberModal && <Modal scroll handleClose={() => setFullMemberModal(false)}>
          <div className="w-full md:w-[380px] h-[520px]">
            <div className="flex justify-end">
              <div onClick={() => setFullMemberModal(false)} className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer">
                <svg className="w-6 h-6 p-1 rounded-full stroke-gray-400" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col h-full mt-5">
              <div className="font-bold text-sm text-gray-400 mb-3">승인된 학생 모두 보기</div>
              <div>
                {
                  approvedUser
                    .slice()
                    .sort((a, b) => {
                      if (a.grade !== b.grade) return a.grade - b.grade;
                      if (a.class !== b.class) return a.class - b.class;
                      return a.number - b.number;
                    })
                    .map((user: { id: number; profile: string; name: string, grade: number, class: number, number: number }) => (
                      <div key={user.id} className="flex items-center space-x-2 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                          { user.profile && <img src={user.profile} alt="" className="w-full h-full object-cover" /> }
                        </div>
                        <div>
                          <div className="text-zinc-800 font-bold">{ user.name }</div>
                          <div className="text-gray-400 text-sm">{user.grade}학년 {user.class}반 {user.number}번</div>
                        </div>
                      </div>
                    ))
                }
              </div>
              { approvedUser.length === 0 && <div className="mt-20">
                  <svg className="w-10 h-10 stroke-gray-400 mx-auto" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                <div className="mt-2 text-center text-sm text-lightgray-200">승인된 학생이 없어요<br/>승인된 학생이 있으면 이곳에 표시됩니다</div>
              </div> }
            </div>
          </div>
        </Modal> }
      </AnimatePresence>
      <div className="flex justify-between items-center">
        <div className="flex space-x-4 md:space-x-6">
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
        <div className="flex space-x-1 -mt-3 items-center relative">
          <CalendarButton calendarFn={setDate} date={date} />
        </div>
      </div>
      <div className="w-full h-[1px] mb-5 bg-lightgray-100"></div>
      <div className="md:flex">
        <div className="flex rounded-full px-1 py-1 bg-gray-100 md:w-auto w-full text-sm">
          <div onClick={() => setTime('1')} className={ time === '1' ? "rounded-full w-full py-1 md:w-[100px] md:py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer" : "rounded-full w-full py-1 md:w-[100px] md:py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-colors" }>{displayPerio(1)}</div>
          <div onClick={() => setTime('2')} className={ time === '2' ? "rounded-full w-full py-1 md:w-[100px] md:py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer" : "rounded-full w-full py-1 md:w-[100px] md:py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-colors" }>{displayPerio(2)}</div>
          <div onClick={() => setTime('3')} className={ time === '3' ? "rounded-full w-full py-1 md:w-[100px] md:py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer" : "rounded-full w-full py-1 md:w-[100px] md:py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-colors" }>{displayPerio(3, 2)}</div>
          <div onClick={() => setTime('4')} className={ time === '4' ? "rounded-full w-full py-1 md:w-[100px] md:py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer" : "rounded-full w-full py-1 md:w-[100px] md:py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-colors" }>{displayPerio(4, 2)}</div>
          {!isWeekend() && <div onClick={() => setTime('5')} className={ time === '5' ? "rounded-full w-full py-1 md:w-[100px] md:py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer" : "rounded-full w-full py-1 md:w-[100px] md:py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-colors" }>야자 3</div>}
        </div>
        <div onClick={() => setFullMemberModal(true)} className={ "rounded-full text-sm flex items-center justify-center w-full py-2 md:w-[160px] md:py-2 text-blue-500 text-center cursor-pointer hover:bg-blue-200 transition-colors bg-blue-100 md:ml-2 md:mt-0 mt-3" }>승인된 학생만 보기</div>
      </div>
      { grade !== 3 ? <div className="mt-8 mb-10 flex flex-col overflow-x-auto">
        {!(data?.success === true && user?.success === true) ? (
          <div className="w-full">
            <div className="flex flex-col">
              {[...Array(14)].map((_, rowIdx) => (
                <div className={ (rowIdx+1)%2 === 0 ? "flex space-x-1 !mb-6" : "flex space-x-1 mb-1" } key={rowIdx}>
                  {[...Array(6)].map((_, colIdx) => {
                    const MR = colIdx === 2 ? "!mr-6" : ""
                    return (
                      <div
                        className={`${MR} bg-gray-100 animate-pulse rounded-xl min-w-[110px] w-[110px] h-[50px] flex flex-col justify-center items-center text-center`}
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
            <div className="w-full flex justify-between">
              <div className="w-full flex flex-col">
                {[...Array(14)].map((_, rowIdx) => (
                  <div className={ (rowIdx+1)%2 === 0 ? "flex space-x-1 !mb-6" : "flex space-x-1 mb-1" } key={rowIdx}>
                    {[...Array(6)].map((_, colIdx) => {
                      // 학년에 따라 백의 자리 결정
                      const base = grade === 1 ? 200 : grade === 2 ? 300 : 400;
                      const seatNumber = base + 1 + rowIdx * 6 + colIdx;
                      if (seatNumber > base + 84) return null;
                      const seatUser = data.seat?.find((u:any) => u.seat === seatNumber);
                      // status가 2인 활동이 하나라도 있는지 확인
                      const hasStatus2Activity = data.activity?.some((a:any) => {
                        const isWriter = a.writer?.id === seatUser?.id;
                        const isRelated = Array.isArray(a.relation) && a.relation.some((rel: any) => rel.user.id === seatUser?.id);
                        return (isWriter || isRelated) && a.status === 2;
                      });
                      // 해당 좌석 유저의 승인된 활동 존재 여부 확인
                      const hasApprovedActivity = !!seatActivityMap[seatNumber];
                      // 배경색 결정: status 2 > blue > gray
                      let seatBgClass = "bg-gray-100 hover:bg-gray-200";
                      if (hasStatus2Activity) {
                        seatBgClass = "bg-yellow-100 hover:bg-yellow-200";
                      } else if (hasApprovedActivity) {
                        seatBgClass = "bg-blue-100 hover:bg-blue-200";
                      }
                      const MR = colIdx === 2 ? "!mr-6" : ""
                      // 가장 빠른 activity 정보
                      let firstActivity = seatActivityMap[seatNumber];
                      if (hasStatus2Activity) {
                        // status가 2인 활동 중 가장 먼저 생성된 것
                        const status2List = data.activity.filter((a:any) => {
                          const isWriter = a.writer?.id === seatUser?.id;
                          const isRelated = Array.isArray(a.relation) && a.relation.some((rel: any) => rel.user.id === seatUser?.id);
                          return (isWriter || isRelated) && a.status === 2;
                        });
                        if(status2List.length > 0) {
                          firstActivity = status2List[0];
                        }
                      }
                      return (
                        <div
                          key={colIdx}
                          className={`${seatBgClass} ${MR} cursor-pointer transition-colors rounded-xl min-w-[110px] w-[110px] h-[50px] flex flex-col justify-center items-center text-center`}
                          onClick={() => {
                            if(firstActivity) {
                              setSelectedActivity(firstActivity);
                              setDetailModal(true);
                            }
                          }}
                        >
                          {seatUser ? (
                            <>
                              <div className={ hasStatus2Activity ? 'font-bold text-yellow-500' : hasApprovedActivity ? "font-bold text-blue-500" : "font-bold" }>{seatUser.name}</div>
                              <div className={ hasStatus2Activity ? 'text-xs text-yellow-500' : hasApprovedActivity ? "text-xs text-blue-500" : "text-xs text-zinc-500" }>
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
            </div>
          </OpacityAnimation>
        )}
      </div> : <div className="mt-8 mb-10 flex overflow-x-auto space-x-10">
        {!(data?.success === true && user?.success === true) ? (
          <div className="space-x-10 flex">
            <div className="space-y-2 mt-20">
              <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="space-x-2 flex"> 
                <div className="rounded-lg w-[85px] h-[60px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[85px] h-[60px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[85px] h-[60px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[85px] h-[60px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[85px] h-[60px] bg-gray-100 animate-pulse"></div>
              </div>
              <div className="space-x-2 flex mt-14"> 
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              </div>
              <div className="space-x-2 flex mt-2"> 
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              </div>
              <div className="space-x-2 flex mt-10"> 
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              </div>
              <div className="space-x-2 flex mt-2"> 
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="space-x-2 flex"> 
                <div className="rounded-lg w-[85px] h-[60px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[85px] h-[60px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[85px] h-[60px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[85px] h-[60px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[85px] h-[60px] bg-gray-100 animate-pulse"></div>
              </div>
              <div className="space-x-2 flex mt-14"> 
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              </div>
              <div className="space-x-2 flex mt-2"> 
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              </div>
              <div className="space-x-2 flex mt-10"> 
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              </div>
              <div className="space-x-2 flex mt-2"> 
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-2 mt-20">
              <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
            </div>
          </div>
        ) : <OpacityAnimation>
          <div className="space-x-10 flex">
            <div className="space-y-2 mt-20">
              <CustomSeat seatNumber={311} />
              <CustomSeat seatNumber={312} />
              <CustomSeat seatNumber={313} />
              <CustomSeat seatNumber={314} />
              <CustomSeat seatNumber={315} />
            </div>
            <div className="flex flex-col items-center">
              <div className="space-x-2 flex"> 
                <CustomSeat seatNumber={301} horizontal={true} />
                <CustomSeat seatNumber={302} horizontal={true} />
                <CustomSeat seatNumber={303} horizontal={true} />
                <CustomSeat seatNumber={304} horizontal={true} />
                <CustomSeat seatNumber={305} horizontal={true} />
              </div>
              <div className="space-x-2 flex mt-14"> 
                <CustomSeat seatNumber={321} />
                <CustomSeat seatNumber={322} />
                <CustomSeat seatNumber={323} />
                <CustomSeat seatNumber={324} />
                <CustomSeat seatNumber={325} />
              </div>
              <div className="space-x-2 flex mt-2"> 
                <CustomSeat seatNumber={326} />
                <CustomSeat seatNumber={327} />
                <CustomSeat seatNumber={328} />
                <CustomSeat seatNumber={329} />
                <CustomSeat seatNumber={330} />
              </div>
              <div className="space-x-2 flex mt-10"> 
                <CustomSeat seatNumber={331} />
                <CustomSeat seatNumber={332} />
                <CustomSeat seatNumber={333} />
                <CustomSeat seatNumber={334} />
                <CustomSeat seatNumber={335} />
              </div>
              <div className="space-x-2 flex mt-2"> 
                <CustomSeat seatNumber={336} />
                <CustomSeat seatNumber={337} />
                <CustomSeat seatNumber={338} />
                <CustomSeat seatNumber={339} />
                <CustomSeat seatNumber={340} />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="space-x-2 flex"> 
                <CustomSeat seatNumber={306} horizontal={true} />
                <CustomSeat seatNumber={307} horizontal={true} />
                <CustomSeat seatNumber={308} horizontal={true} />
                <CustomSeat seatNumber={309} horizontal={true} />
                <CustomSeat seatNumber={310} horizontal={true} />
              </div>
              <div className="space-x-2 flex mt-14"> 
                <CustomSeat seatNumber={341} />
                <CustomSeat seatNumber={342} />
                <CustomSeat seatNumber={343} />
                <CustomSeat seatNumber={344} />
                <CustomSeat seatNumber={345} />
              </div>
              <div className="space-x-2 flex mt-2"> 
                <CustomSeat seatNumber={346} />
                <CustomSeat seatNumber={347} />
                <CustomSeat seatNumber={348} />
                <CustomSeat seatNumber={349} />
                <CustomSeat seatNumber={350} />
              </div>
              <div className="space-x-2 flex mt-10"> 
                <CustomSeat seatNumber={351} />
                <CustomSeat seatNumber={352} />
                <CustomSeat seatNumber={353} />
                <CustomSeat seatNumber={354} />
                <CustomSeat seatNumber={355} />
              </div>
              <div className="space-x-2 flex mt-2"> 
                <CustomSeat seatNumber={356} />
                <CustomSeat seatNumber={357} />
                <CustomSeat seatNumber={358} />
                <CustomSeat seatNumber={359} />
                <CustomSeat seatNumber={360} />
              </div>
            </div>
            <div className="space-y-2 mt-20">
              <CustomSeat seatNumber={316} />
              <CustomSeat seatNumber={317} />
              <CustomSeat seatNumber={318} />
              <CustomSeat seatNumber={319} />
              <CustomSeat seatNumber={320} />
            </div>
          </div>
        </OpacityAnimation> }
      </div> }
    </>
  );
}
