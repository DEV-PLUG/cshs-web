'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Modal from "@components/modal";
import { AnimatePresence } from "framer-motion";
import { signIn, signOut } from "next-auth/react";
import UpModal from "@components/up-modal";
import Button, { SubButton } from "@components/button";
import Input, { Textarea } from "@components/input";
import { Link, Tooltip } from "@mui/material";
import { setNotification } from "@libs/client/redux/notification";
import { useAppDispatch, useAppSelector } from "@libs/client/redux/hooks";
import useSWR from "swr";
import { OpacityAnimation } from "@components/animation";
import Switch from "@components/switch";
import Loading from "@components/loading";
import { setUserInfo } from "@libs/client/redux/userInfo";

export default function ProfileMenu() {
  const [profile, setProfile] = useState(false);
  const [settingModal, setSettingModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ai, setAI] = useState(false);
  const [notification, setNotificationToggle] = useState(false);
  const [nightNotification, setNightNotification] = useState(false);
  const [pwModal, setPWModal] = useState(false);
  const [pw, setPW] = useState('');
  const [pwCheck, setPWCheck] = useState('');

  const dispatch = useAppDispatch();

  async function saveSetting() {
    if(loading) return;

    setLoading(true);
    await fetch(`/api/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ai,
        notification,
        nightNotification
      })
    })
    .then((response) => response.json())
    .then((response) => {
      setLoading(false);
      if(response.success === true) {
        dispatch(setNotification({ type: 'success', text: '설정을 저장했습니다' }));
      }
    });
  }

  async function changePW() {
    if(loading) return;
    if(pw !== pwCheck) {
      return dispatch(setNotification({ type: 'error', text: '비밀번호가 일치하지 않습니다' }));
    }
    if(pw.length < 5) {
      return dispatch(setNotification({ type: 'error', text: '비밀번호는 5자 이상이어야 합니다' }));
    }

    setLoading(true);
    await fetch(`/api/user/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        password: pw
      })
    })
    .then((response) => response.json())
    .then((response) => {
      setLoading(false);
      if(response.success === true) {
        dispatch(setNotification({ type: 'success', text: '비밀번호를 변경했습니다' }));
        setPWModal(false);
        setTimeout(() => {
          location.reload();
        }, 500);
      }
    });
  }
  
  const { data } = useSWR('/api/user');
  useEffect(() => {
    if(data?.success === true) {
      setAI(data.user.allowAI);
      setNotificationToggle(data.user.allowNotification);
      setNightNotification(data.user.allowNightNotification);

      dispatch(setUserInfo({ name: data.user.name, type: data.user.type, grade: 0, class: 0, number: 0 }));
      if(data.user.type === 0) {
        dispatch(setUserInfo({ name: data.user.name, type: data.user.type, grade: data.user.grade, class: data.user.class, number: data.user.number }));
      }
    }
  }, [data]);

  const userInfo = useAppSelector(state => state.userInfo);

  return (
    <>
      <AnimatePresence initial={false} mode="wait">
        { settingModal && <Modal handleClose={() => setSettingModal(false)}>
          <div className="w-full md:w-[380px] h-[520px]">
            <div className="flex justify-end">
              <div onClick={() => setSettingModal(false)} className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer">
                <svg className="w-6 h-6 p-1 rounded-full stroke-gray-400" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col justify-between h-full pb-8">
              <div>
                <div className="font-bold text-zinc-800 text-2xl mt-5 mb-5">개인 설정</div>
                { data?.success !== true && <div className="w-full mt-16 text-blue-500 flex items-center justify-center">
                  <Loading size={25} />
                </div>}
                { data?.success === true && <OpacityAnimation>
                  <div onClick={() => setAI(!ai)} className="flex space-x-2 items-center mt-2 cursor-pointer">
                    <Switch size="md" active={ai} />
                    <div className="text-sm text-gray-400">AI 할 일</div>
                    <Tooltip title="AI가 클래스룸 게시글을 분석하고 자동으로 내 할 일을 등록합니다." arrow>
                      <svg className="stroke-gray-400 w-5 h-5 bg-gray-100 rounded-full" fill="none" strokeWidth={1.7} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                      </svg>
                    </Tooltip>
                  </div>
                  <div onClick={() => setNotificationToggle(!notification)} className="flex space-x-2 items-center mt-2 cursor-pointer">
                    <Switch size="md" active={notification} />
                    <div className="text-sm text-gray-400">모바일 앱 알림 허용하기</div>
                  </div>
                  <div onClick={() => setNightNotification(!nightNotification)} className="flex space-x-2 items-center mt-2 cursor-pointer">
                    <Switch size="md" active={nightNotification} />
                    <div className="text-sm text-gray-400">오후 6시 이후 모바일 앱 알림 허용하기</div>
                  </div>
                </OpacityAnimation> }
              </div>
              <div>
                <div className='w-full space-x-2 flex items-start py-2 px-3 rounded-xl bg-gray-100 transition-all mt-10 mb-5'>
                  <div className='text-2xl tossface'>🔒</div>
                  <div>
                    <div className='text-lightgray-200 text-sm'>
                      AI는 클래스룸 게시물을 포함해 어떠한 개인정보도 모델 학습용으로 사용하지 않습니다. <Link href='https://openai.com/enterprise-privacy'><a href="https://openai.com/enterprise-privacy/" target="_blank">자세히 알아보기</a></Link><br/>
                    </div>
                  </div>
                </div>
                <Button color="blue" loading={loading} fn={() => saveSetting()}>
                  저장하기
                </Button>
              </div>
            </div>
          </div>
        </Modal> }
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait">
        { profile && <UpModal handleClose={() => setProfile(false)}>
          <div className="w-[272px] h-auto top-[55px] xl:top-[85px] p-2 left-[0px] rounded-xl bg-white border-lightgray-100 drop-shadow-2xl absolute">
            {/* <div className="px-3 py-2 flex items-center space-x-2 transition-all cursor-pointer rounded-lg hover:bg-gray-100 text-lightgray-300">
              <svg className="w-5 h-5" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <div className="text-base">프로필 설정</div>
            </div> */}
            {/* <div onClick={() => {
              setSettingModal(true);
              setProfile(false);
            }} className="px-3 py-2 flex items-center space-x-2 transition-all cursor-pointer rounded-lg hover:bg-gray-100 text-lightgray-300">
              <svg className="w-5 h-5" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              <div className="text-base">개인 설정</div>
            </div> */}
            <div onClick={() => {
              setPWModal(true);
              setProfile(false);
            }} className="px-3 py-2 flex items-center space-x-2 transition-all cursor-pointer rounded-lg hover:bg-gray-100 text-lightgray-300">
              <svg className="w-5 h-5" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              <div className="text-base">비밀번호 변경</div>
            </div>
            <div className="w-full px-3">
              <div className="w-full h-[1px] my-2 bg-lightgray-100"></div>
            </div>
            <div onClick={() => signOut()} className="px-3 py-2 flex items-center space-x-2 transition-all cursor-pointer rounded-lg hover:bg-gray-100 text-red-500">
              <svg className="w-5 h-5" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
              <div className="text-base">로그아웃</div>
            </div>
          </div>
        </UpModal> }
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait">
        { pwModal && <Modal handleClose={() => setPWModal(false)}>
          <div className="w-full md:w-[380px] h-[520px]">
            <div className="flex justify-end">
              <div onClick={() => setPWModal(false)} className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer">
                <svg className="w-6 h-6 p-1 rounded-full stroke-gray-400" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col justify-between h-full pb-8">
              <div>
                <div className="font-bold text-zinc-800 text-2xl mt-5 mb-5">비밀번호 변경</div>
                <div className="space-y-2">
                  <Input placeholder="새 비밀번호" type="password" value={pw} fn={(value:string) => setPW(value)} />
                  <Input placeholder="새 비밀번호 확인" type="password" value={pwCheck} fn={(value:string) => setPWCheck(value)} />
                </div>
              </div>
              <div>
                <Button color="blue" loading={loading} fn={() => changePW()}>
                  변경하기
                </Button>
              </div>
            </div>
          </div>
        </Modal> }
      </AnimatePresence>
      <div className="flex md:hidden mb-5 space-x-3 px-4 py-2 mt-2 rounded-2xl transition-all">
        <div className="w-[55px] h-[55px] relative flex justify-center items-center bg-gray-100 border-[1px] border-lightgray-100 rounded-[17px]">
          <svg className="w-10 h-10 fill-gray-300 stroke-gray-300" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </div>
        <div className="flex flex-col justify-center">
          <div>
            { userInfo.name !== '' && <OpacityAnimation>
              <div className="font-bold text-[17.5px] -mb-0 text-zinc-800">{userInfo.name}</div>
            </OpacityAnimation> }
            { userInfo.name !== '' && <OpacityAnimation>
              { userInfo.type === 0 ? <div className="text-lightgray-200">{userInfo.grade}학년 {userInfo.class}반 {userInfo.number}번</div> : <div className="text-lightgray-200">교사</div> }
            </OpacityAnimation> }
          </div>
        </div>
      </div>
      <div className="md:hidden px-4 flex items-center space-x-2">
        <div onClick={() => signOut()} className="px-3 py-2 flex items-center space-x-2 transition-all cursor-pointer rounded-full bg-gray-100 hover:bg-gray-200 text-red-500">
          <svg className="w-5 h-5" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
          <div className="text-sm">로그아웃</div>
        </div>
        {/* <div onClick={() => {
          setSettingModal(true);
          setProfile(false);
        }} className="px-3 py-2 flex items-center space-x-2 transition-all cursor-pointer rounded-full bg-gray-100 hover:bg-gray-200 text-lightgray-300">
          <svg className="w-5 h-5" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          <div className="text-sm">개인 설정</div>
        </div> */}
      </div>
      <div onClick={() => setProfile(true)} className="hidden xl:flex mb-5 space-x-3 px-4 py-2 mt-2 rounded-2xl hover:bg-gray-100 active:bg-gray-200 transition-all cursor-pointer">
        <div className="w-[55px] h-[55px] relative flex justify-center items-center bg-gray-100 border-[1px] border-lightgray-100 rounded-[17px]">
          <svg className="w-10 h-10 fill-gray-300 stroke-gray-300" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </div>
        <div className="flex flex-col justify-center">
          { userInfo.name !== '' ? <div>
            <div className="font-bold text-[17.5px] -mb-0 text-zinc-800">{userInfo.name}</div>
            { userInfo.type === 0 ? <div className="text-lightgray-200">{userInfo.grade}학년 {userInfo.class}반 {userInfo.number}번</div> : <div className="text-lightgray-200">교사</div> }
          </div> : <div className="space-y-2">
            <div className="w-16 h-5 animate-pulse bg-gray-200 rounded-md"></div>
            <div className="w-24 h-4 animate-pulse bg-gray-200 rounded-md"></div>
          </div> }
        </div>
      </div>
      <div onClick={() => setProfile(true)} className="w-[45px] h-[45px] hidden xl:hidden md:flex justify-center overflow-hidden items-center bg-white border-[1px] border-lightgray-100 rounded-[15px] mx-[3px] mb-3 cursor-pointer">
        <div className="w-[45px] h-[45px] relative flex justify-center items-center bg-gray-100 border-lightgray-100 rounded-[17px]">
          <svg className="w-8 h-8 fill-gray-300 stroke-gray-300" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </div>
      </div>
    </>
  )
}