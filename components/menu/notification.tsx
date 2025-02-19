'use client';

import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { AnimatePresence, useAnimationControls } from "framer-motion";
import UpModal from "@components/up-modal";
import Image from "next/image";
import displayDate from "@libs/client/time-display";
import { OpacityAnimation, StaggerChildrenAnimation, StaggerParentAnimation } from "@components/animation";

export default function NotificationMenu() {
  const [notificationModal, setNotificationModal] = useState(false);
  const controls = useAnimationControls();
  const [count, setCount] = useState(0);

  const { data } = useSWR('/api/notification', { refreshInterval: 1000 * 60 });
  useEffect(() => {
    mutate('/api/notification');
    if(notificationModal === true) {
      setCount(0);
      controls.start('visible');
      fetch('/api/notification', {
        method: 'PUT'
      });
    }
  }, [notificationModal]);

  useEffect(() => {
    setCount(data?.notification?.filter((data:{read:boolean}) => data.read === false).length);
    controls.start('visible');
  }, [data]);

  return (
    <>
      <AnimatePresence initial={false} mode="wait">
        { notificationModal && <UpModal handleClose={() => setNotificationModal(false)}>
          <div className="w-[340px] h-auto top-[60px] md:top-[0px] p-2 left-auto right-0 md:right-auto md:left-[70px] xl:left-[280px] rounded-xl bg-white border-lightgray-100 drop-shadow-2xl absolute">
            {/* <div className="px-3 py-2 flex items-center space-x-2 transition-all cursor-pointer rounded-lg hover:bg-gray-100 text-lightgray-300">
              <svg className="w-5 h-5" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <div className="text-base">프로필 설정</div>
            </div> */}
            { data?.success === true && data.notification.length === 0 && <OpacityAnimation>
              <div className="flex items-center justify-center w-full h-[180px] flex-col">
                <svg className="w-10 h-10 stroke-lightgray-200" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
                <div className="text-sm text-lightgray-200 text-center mt-2">새로운 소식이 없어요<br/>소식이 생기면 알려드릴게요</div>
              </div>
            </OpacityAnimation> }
            { data?.success !== true && [...new Array(3)].map((data, index) => {
              return (
                <div key={index} className="px-3 py-3 flex items-start space-x-3 transition-all rounded-xl text-lightgray-300">
                  <div className="w-10 h-10">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 animate-pulse">
                    </div>
                  </div>
                  <div>
                    <div className="w-40 h-5 mb-2 bg-gray-100 rounded-lg animate-pulse"></div>
                    <div className="w-56 h-3 mb-1 bg-gray-100 rounded-lg animate-pulse"></div>
                    <div className="w-32 h-3 bg-gray-100 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              )
            }) }
            <StaggerParentAnimation controls={controls}>
              { data?.success === true && <div className="custom-scroll overflow-auto max-h-[400px] pr-2">
                { data.notification.filter((data:{read:boolean}) => data.read === false).length >= 1 && <div className="text-sm text-lightgray-200 mb-1 px-2 py-1">새 알림 - {data.notification.filter((data:{read:boolean}) => data.read === false).length}</div>}
                { data.notification.filter((data:{read:boolean}) => data.read === false).map((data:{image:string,title:string,content:string,createdAt:string,id:number,link:string}) => {
                  return (
                    <StaggerChildrenAnimation key={data.id}>
                      <div onClick={() => {
                        if(data.link) {
                          setNotificationModal(false);
                          location.href = data.link;
                        }
                      }} key={data.id} className="px-3 py-3 flex items-start space-x-3 transition-all cursor-pointer rounded-xl hover:bg-gray-50 text-lightgray-300">
                        <div className="w-10 h-10">
                          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            { data.image && <Image alt="알림 이미지" width={40} height={40} src={data.image}/> }
                            { data.title.includes('활동') && <svg className="w-6 h-6 stroke-blue-400" fill="none" strokeWidth={1.8} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                            </svg> }
                          </div>
                        </div>
                        <div>
                          <div className="text-base font-bold text-lightgray-300">{data.title}</div>
                          <div className="text-sm text-lightgray-200">{data.content}</div>
                          <div className="text-xs text-lightgray-200 mt-1">{String(displayDate(new Date(data.createdAt), 'date-left')) === '0' ? '오늘' : `${String(-(+displayDate(new Date(data.createdAt), 'date-left')))}일 전`}</div>
                        </div>
                      </div>
                    </StaggerChildrenAnimation>
                  )
                }) }
                { (data.notification.filter((data:{read:boolean}) => data.read === true).length >= 1 && data.notification.filter((data:{read:boolean}) => data.read === false).length >= 1) && <div className="w-full px-3">
                  <div className="w-full h-[1px] my-2 bg-lightgray-100"></div>
                </div> }
                { data.notification.filter((data:{read:boolean}) => data.read === true).map((data:{image:string,title:string,content:string,createdAt:string,id:number,link:string}) => {
                  return (
                    <StaggerChildrenAnimation key={data.id}>
                      <div onClick={() => {
                        if(data.link) {
                          setNotificationModal(false);
                          location.href = data.link;
                        }
                      }} key={data.id} className="px-3 py-3 flex items-start space-x-3 transition-all cursor-pointer rounded-xl hover:bg-gray-50 text-lightgray-300">
                        <div className="w-10 h-10">
                          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            { data.image && <Image alt="알림 이미지" width={40} height={40} src={data.image}/> }
                            { data.title.includes('활동') && <svg className="w-6 h-6 stroke-blue-400" fill="none" strokeWidth={1.8} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                            </svg> }
                          </div>
                        </div>
                        <div>
                          <div className="text-base font-bold text-lightgray-300">{data.title}</div>
                          <div className="text-sm text-lightgray-200">{data.content}</div>
                          <div className="text-xs text-lightgray-200 mt-1">{String(displayDate(new Date(data.createdAt), 'date-left')) === '0' ? '오늘' : `${String(-(+displayDate(new Date(data.createdAt), 'date-left')))}일 전`}</div>
                        </div>
                      </div>
                    </StaggerChildrenAnimation>
                  )
                }) }
              </div> }
            </StaggerParentAnimation>
          </div>
        </UpModal> }
      </AnimatePresence>
      <div onClick={() => setNotificationModal(true)} className="xl:flex hidden px-4 py-[10px] transition-all rounded-xl items-center justify-between cursor-pointer hover:bg-gray-100 active:bg-gray-200">
        <div className="flex items-center space-x-3">
          <svg className="stroke-lightgray-300 w-6 h-6" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          <div className="text-[17.5px] font-bold text-lightgray-300">새로운 소식</div>
        </div>
        { count >= 1 && <OpacityAnimation>
          <div className="flex space-x-1 items-center justify-center">
            <div className={ count > 9 ? "w-8 h-6 text-sm flex items-center justify-center bg-red-100 text-red-500 font-bold text-center rounded-full" : "w-6 h-6 text-sm flex items-center justify-center bg-red-100 text-red-500 font-bold text-center rounded-full" }>
              {count > 9 ? '9+' : count}
            </div>
          </div>
        </OpacityAnimation> }
      </div>
      <div onClick={() => setNotificationModal(true)} className="xl:hidden flex px-3 py-[10px] transition-all rounded-xl items-center justify-center cursor-pointer hover:bg-gray-100 active:bg-gray-200 w-[50px] relative">
        <div className="flex items-center space-x-3">
          <svg className="stroke-lightgray-300 w-6 h-6" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
        </div>
        { count >= 1 && <OpacityAnimation>
          <div className="flex space-x-1 items-center justify-center absolute right-2 bottom-1">
            <div className={ count > 9 ? "w-6 h-4 text-xs flex items-center justify-center bg-red-500/10 text-red-500 font-bold text-center rounded-full" : "w-5 h-5 text-xs flex items-center justify-center bg-red-500/10 text-red-500 font-bold text-center rounded-full" }>
              {count > 9 ? '9+' : count}
            </div>
          </div>
        </OpacityAnimation> }
      </div>
    </>
  )
}