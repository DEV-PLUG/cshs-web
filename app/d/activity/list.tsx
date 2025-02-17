'use client';

import { use, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import displayDate from "@libs/client/time-display";
import { OpacityAnimation } from "@components/animation";
import ListMenu from "./activity-list-menu";
import ActivityDetail from "./activity-detail";
import Modal from "@components/modal";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { setNotification } from "@libs/client/redux/notification";
import errorMessage from "@libs/client/error-message";
import { useAppDispatch } from "@libs/client/redux/hooks";
import { SubButton } from "@components/button";
import Loading from "@components/loading";

export default function ActivityList() {

  const [userType, setUserType] = useState<null | number>(null);
  useEffect(() => {
    if(document && document.cookie.split('; ').find(row => row.startsWith('type='))?.split('=')[1] === '1') setUserType(1);
    if(document && document.cookie.split('; ').find(row => row.startsWith('type='))?.split('=')[1] === '0') setUserType(0);
  }, []);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<null | { value: string, order: string }>(null);
  const { data, error } = useSWR(`/api/activity/me?${ search ? `search=${search}` : '' }${ sort ? `&sort=${sort.value}&order=${sort.order}` : '' }`);
  function mutateActivity() {
    mutate(`/api/activity/me?${ search ? `search=${search}` : '' }${ sort ? `&sort=${sort.value}&order=${sort.order}` : '' }`);
  }

  const [detailModal, setDetailModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [approveId, setApproveId] = useState(0);
  async function approveActivity() {
    if(loading) return;
    setLoading(true);

    await fetch(`/api/activity/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: approveId
      })
    })
    .then((response) => response.json())
    .then((response) => {
      setLoading(false);
      if(response.success === true) {
        dispatch(setNotification({ type: 'success', text: '해당 활승을 승인했습니다' }));
        setApproveModal(false);
        mutateActivity();
      } else {
        dispatch(setNotification({ type: 'error', text: errorMessage.unknown }));
      }
    });
  }

  const [approveModal, setApproveModal] = useState(false);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && approveModal && !event.ctrlKey && !loading) {
        approveActivity();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [approveModal]);

  return (
    <>
      <AnimatePresence initial={false} mode="wait">
        { approveModal && <Modal handleClose={() => setApproveModal(false)}>
          <div className="md:w-[300px] h-auto">
            <div className="font-bold text-xl text-zinc-800">해당 항목을 승인할까요?</div>
            <div className="flex items-center space-x-2 mt-5">
              <div onClick={() => setApproveModal(false)} className="bg-gray-100 hover:bg-gray-200 text-base transition-all font-medium text-zinc-800 justify-center w-full py-3 flex items-center cursor-pointer rounded-xl">
                취소
              </div>
              { loading === false ? <div onClick={() => approveActivity()} className="bg-blue-500 hover:bg-blue-600 text-base transition-all font-medium text-white justify-center w-full py-3 flex items-center cursor-pointer rounded-xl">
                승인하기
              </div> : <div onClick={() => approveActivity()} className="bg-blue-500/50 text-base transition-all font-medium text-white justify-center w-full py-3 flex items-center rounded-xl h-[48px]">
                <div className="flex items-center justify-center">
                  <Loading size={20} />
                </div>
              </div> }
            </div>
          </div>
        </Modal> }
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait">
        { detailModal && <Modal scroll handleClose={() => setDetailModal(false)}>
          <ActivityDetail data={selectedActivity} fn={() => setDetailModal(false)} />
        </Modal> }
      </AnimatePresence>
      <div className="flex justify-between items-center">
        <div className="flex space-x-4 md:space-x-6">
          <Link href='/d/activity'>
            { userType !== null && <OpacityAnimation>
              <div className="border-b-2 border-zinc-800 pb-3 cursor-pointer">
                <div className="font-bold md:text-base text-sm">{userType === 0 ? '내가 요청한 내역' : '담당 내역'}</div>
              </div>
            </OpacityAnimation> }
          </Link>
          <Link href='/d/activity/all'>
            { userType !== null && <OpacityAnimation>
              <div className="border-b-0 border-zinc-800 pb-3 cursor-pointer">
                <div className="font-bold text-lightgray-200 md:text-base text-sm">전체 내역</div>
              </div>
            </OpacityAnimation> }
          </Link>
          <div className="border-b-2 border-zinc-800 pb-3 opacity-0">
            <div className="font-bold text-lightgray-200 md:text-base text-sm">전체 내역</div>
          </div>
        </div>
        <ListMenu searchFn={setSearch} sortFn={setSort} data={{ sort }} />
      </div>
      <div className="w-full h-[1px] mt-0 bg-lightgray-100"></div>
      <div className="mt-5 flex justify-between space-x-5 mb-20 md:mb-0">
        <div className="w-full space-y-10">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-bold text-xl md:text-2xl text-zinc-800 flex items-center">
                승인 대기 내역
                <div>
                  { (data && data.success === true && data.activity.before.length > 0) && <OpacityAnimation><div className="text-blue-500 ml-2">{data.activity.before.length}</div></OpacityAnimation> }
                </div>
              </div>
            </div>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 min-w-[800px]">
                <thead className="text-sm text-lightgray-200 bg-gray-50/50 border-t border-b border-lightgray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 !font-medium">
                      대표 학생
                    </th>
                    <th scope="col" className="px-6 py-3 !font-medium">
                      참여 학생
                    </th>
                    <th scope="col" className="px-6 py-3 !font-medium">
                      담당 교사
                    </th>
                    <th scope="col" className="px-6 py-3 !font-medium">
                      활동 내용
                    </th>
                    <th scope="col" className="px-6 py-3 !font-medium">
                      장소
                    </th>
                    <th scope="col" className="px-6 py-3 !font-medium">
                      활동 시간
                    </th>
                    { userType === 1 && <th scope="col" className="px-6 py-3 !font-medium">
                      승인
                    </th> }
                  </tr>
                </thead>
                <tbody>
                  { data?.activity?.before.length <= 0 && search !== '' && <tr className="w-full relative h-[200px]">
                    <OpacityAnimation>
                      <div className="text-lightgray-200 w-full flex items-center justify-center flex-col my-8 mx-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-10 h-10">
                          <svg fill="none" strokeWidth={1.7} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                          </svg>
                        </div>
                        <div className="mt-1 text-center">검색 결과가 없어요<br/>검색어 및 필터를 다시 한번 확인해주세요</div>
                      </div>
                    </OpacityAnimation>
                  </tr> }
                  { data?.activity?.before.length <= 0 && search === '' && <tr className="w-full relative h-[200px]">
                    <OpacityAnimation>
                      <div className="text-lightgray-200 w-full flex items-center justify-center flex-col my-8 mx-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-10 h-10">
                          <svg fill="none" strokeWidth={1.7} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                          </svg>
                        </div>
                        <div className="mt-1 text-center">승인 대기 중인 내역이 없어요<br/>활동 승인을 요청하면 이곳에 표시됩니다</div>
                      </div>
                    </OpacityAnimation>
                  </tr> }
                  { (data && data.success === true) && data.activity.before.map((activity:any) => {
                    return (
                      <tr onClick={() => {
                        setSelectedActivity({
                          ...activity,
                          mutateActivity: mutateActivity
                        });
                        setDetailModal(true);
                      }} key={activity.id} className="bg-white hover:bg-gray-50 transition-all cursor-pointer border-b text-zinc-800 dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-2">
                          { activity.writer.name }
                        </td>
                        <td className="px-6 py-2">
                          { activity.relation.map((student:any, index:number) => {
                            if(activity.relation.length !== index + 1) return student.user.name + ', ';
                            return student.user.name
                          }) }
                          { activity.relation.length === 0 && '없음' }
                        </td>
                        <td className="px-6 py-2">
                          { activity.teacher.name }
                        </td>
                        <td className="px-6 py-2">
                          { activity.content }
                        </td>
                        <td className="px-6 py-2">
                          { activity.place.place }
                        </td>
                        <td className="px-6 py-2">
                          {displayDate(activity.createdAt, 'date')}<br/>
                          {activity.perio.split(',').sort()[0] === '1' && '7교시'}
                          {activity.perio.split(',').sort()[0] === '2' && '8-9교시'}
                          {activity.perio.split(',').sort()[0] === '3' && '야자 1교시'}
                          {activity.perio.split(',').sort()[0] === '4' && '야자 2교시'}
                          {' ~ '}
                          {activity.perio.split(',').sort(function (a:number, b:number) {return b - a;})[0] === '1' && '7교시'}
                          {activity.perio.split(',').sort(function (a:number, b:number) {return b - a;})[0] === '2' && '8-9교시'}
                          {activity.perio.split(',').sort(function (a:number, b:number) {return b - a;})[0] === '3' && '야자 1교시'}
                          {activity.perio.split(',').sort(function (a:number, b:number) {return b - a;})[0] === '4' && '야자 2교시'}
                        </td>
                        { userType === 1 && <td className="px-6 py-2 w-[40px]">
                          <div className="bg-blue-500/20 hover:bg-blue-600/20 text-sm transition-all font-bold justify-center px-3 py-3 flex items-center cursor-pointer rounded-[10px] text-blue-500" onClick={(e) => {
                            e.stopPropagation();
                            setApproveId(activity.id);
                            setApproveModal(true);
                          }}>
                            <svg className="w-5 h-5" fill="none" strokeWidth={1.7} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                          </div>
                        </td> }
                      </tr>
                    )
                  }) }
                  { !data && [...Array(5)].map((value, index) => {
                    return (
                      <tr key={index} className="bg-white h-[57px] hover:bg-gray-50 transition-all cursor-pointer border-b text-zinc-800 dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-2">
                          <div className="bg-gray-100 animate-pulse w-14 h-3 rounded-lg"></div>
                        </td>
                        <td className="px-6 py-2">
                          <div className="bg-gray-100 animate-pulse w-20 h-3 rounded-lg"></div>
                        </td>
                        <td className="px-6 py-2">
                        <div className="bg-gray-100 animate-pulse w-16 h-3 rounded-lg"></div>
                        </td>
                        <td className="px-6 py-2">
                          <div className="bg-gray-100 animate-pulse w-9 h-3 rounded-lg"></div>
                        </td>
                        <td className="px-6 py-2">
                          <div className="bg-gray-100 animate-pulse w-10 h-3 rounded-lg"></div>
                        </td>
                        <td className="px-6 py-2">
                          <div className="bg-gray-100 animate-pulse w-20 h-3 rounded-lg"></div>
                        </td>
                      </tr>
                    )
                  }) }
                </tbody>
              </table>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-bold text-xl md:text-2xl text-zinc-800 flex items-center">
                승인된 내역
                <div>
                  { (data && data.success === true && data.activity.finished.length > 0) && <OpacityAnimation><div className="text-blue-500 ml-2">{data.activity.finished.length}</div></OpacityAnimation> }
                </div>
              </div>
            </div>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 min-w-[600px]">
                <thead className="text-sm text-lightgray-200 bg-gray-50/50 border-t border-b border-lightgray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 !font-medium">
                      대표 학생
                    </th>
                    <th scope="col" className="px-6 py-3 !font-medium">
                      참여 학생
                    </th>
                    <th scope="col" className="px-6 py-3 !font-medium">
                      담당 교사
                    </th>
                    <th scope="col" className="px-6 py-3 !font-medium">
                      활동 내용
                    </th>
                    <th scope="col" className="px-6 py-3 !font-medium">
                      장소
                    </th>
                    <th scope="col" className="px-6 py-3 !font-medium">
                      활동 시간
                    </th>
                  </tr>
                </thead>
                <tbody>
                  { data?.activity?.finished.length <= 0 && search !== '' && <tr className="w-full relative h-[200px]">
                    <OpacityAnimation>
                      <div className="text-lightgray-200 w-full flex items-center justify-center flex-col my-8 mx-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-10 h-10">
                          <svg fill="none" strokeWidth={1.7} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                          </svg>
                        </div>
                        <div className="mt-1 text-center">검색 결과가 없어요<br/>검색어 및 필터를 다시 한번 확인해주세요</div>
                      </div>
                    </OpacityAnimation>
                  </tr> }
                  { data?.activity?.finished.length <= 0 && search === '' && <tr className="w-full relative h-[200px]">
                    <OpacityAnimation>
                      <div className="text-lightgray-200 w-full flex items-center justify-center flex-col my-8 mx-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-10 h-10">
                          <svg fill="none" strokeWidth={1.7} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                          </svg>
                        </div>
                        <div className="mt-1 text-center">승인된 내역이 없어요<br/>활동 요청이 승인되면 이곳에 표시됩니다</div>
                      </div>
                    </OpacityAnimation>
                  </tr> }
                  { (data && data.success === true) && data.activity.finished.map((activity:any) => {
                    return (
                      <tr onClick={() => {
                        setSelectedActivity({
                          ...activity,
                          mutateActivity: mutateActivity
                        });
                        setDetailModal(true);
                      }} key={activity.id} className="bg-white hover:bg-gray-50 transition-all cursor-pointer border-b text-zinc-800 dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-2">
                          { activity.writer.name }
                        </td>
                        <td className="px-6 py-2">
                          { activity.relation.map((student:any, index:number) => {
                            if(activity.relation.length !== index + 1) return student.user.name + ', ';
                            return student.user.name
                          }) }
                          { activity.relation.length === 0 && '없음' }
                        </td>
                        <td className="px-6 py-2">
                          { activity.teacher.name }
                        </td>
                        <td className="px-6 py-2">
                          { activity.content }
                        </td>
                        <td className="px-6 py-2">
                          { activity.place.place }
                        </td>
                        <td className="px-6 py-2">
                          {displayDate(activity.createdAt, 'date')}<br/>
                          {activity.perio.split(',').sort()[0] === '1' && '7교시'}
                          {activity.perio.split(',').sort()[0] === '2' && '8-9교시'}
                          {activity.perio.split(',').sort()[0] === '3' && '야자 1교시'}
                          {activity.perio.split(',').sort()[0] === '4' && '야자 2교시'}
                          {' ~ '}
                          {activity.perio.split(',').sort(function (a:number, b:number) {return b - a;})[0] === '1' && '7교시'}
                          {activity.perio.split(',').sort(function (a:number, b:number) {return b - a;})[0] === '2' && '8-9교시'}
                          {activity.perio.split(',').sort(function (a:number, b:number) {return b - a;})[0] === '3' && '야자 1교시'}
                          {activity.perio.split(',').sort(function (a:number, b:number) {return b - a;})[0] === '4' && '야자 2교시'}
                        </td>
                      </tr>
                    )
                  }) }
                  { !data && [...Array(5)].map((value, index) => {
                    return (
                      <tr key={index} className="bg-white h-[57px] hover:bg-gray-50 transition-all cursor-pointer border-b text-zinc-800 dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-2">
                          <div className="bg-gray-100 animate-pulse w-14 h-3 rounded-lg"></div>
                        </td>
                        <td className="px-6 py-2">
                          <div className="bg-gray-100 animate-pulse w-20 h-3 rounded-lg"></div>
                        </td>
                        <td className="px-6 py-2">
                        <div className="bg-gray-100 animate-pulse w-16 h-3 rounded-lg"></div>
                        </td>
                        <td className="px-6 py-2">
                          <div className="bg-gray-100 animate-pulse w-9 h-3 rounded-lg"></div>
                        </td>
                        <td className="px-6 py-2">
                          <div className="bg-gray-100 animate-pulse w-10 h-3 rounded-lg"></div>
                        </td>
                        <td className="px-6 py-2">
                          <div className="bg-gray-100 animate-pulse w-20 h-3 rounded-lg"></div>
                        </td>
                      </tr>
                    )
                  }) }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
