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

export default function AddActivityButton() {
  const [modal, setModal] = useState(false);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);

  const dispatch = useDispatch();

  async function postTodo() {
    if(loading) return;

    if(content.length <= 0 || content.length > 20) {
      return dispatch(setNotification({ type: "error", text: "활동 내용은 비어있거나 20자 이상일 수 없어요" }));
    }
    // if(selected.length <= 0) {
    //   return dispatch(setNotification({ type: "error", text: "한 명 이상의 구성원을 선택하세요" }));
    // }
    if(selectedTeacher.length <= 0) {
      return dispatch(setNotification({ type: "error", text: "담당 교사를 선택하세요" }));
    }
    if(time.length <= 0) {
      return dispatch(setNotification({ type: "error", text: "시간을 선택하세요" }));
    }
    if (time.length > 1) {
      const sortedTime = [...time].sort((a, b) => a - b);
      for (let i = 1; i < sortedTime.length; i++) {
        if (sortedTime[i] !== sortedTime[i - 1] + 1) {
          return dispatch(setNotification({ type: "error", text: "시간은 연속적이어야 해요" }));
        }
      }
    }
    if(!place) {
      return dispatch(setNotification({ type: "error", text: "장소를 선택하세요" }));
    }


    setLoading(true);
    await fetch(`/api/activity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content,
        to: selected.map((member) => member.id),
        time,
        place: place.id,
        teacher: [selectedTeacher[0].id]
      })
    })
    .then((response) => response.json())
    .then((response) => {
      setLoading(false);
      if(response.success === true) {
        dispatch(setNotification({ type: "success", text: '활동 승인을 요청했어요' }));
        mutate('/api/activity/me?');
        setModal(false);
      } else {
        dispatch(setNotification({ type: "error", text: response.message }));
      }
    });
  }

  useEffect(() => {
    const fetchRecent = async () => {
      await fetch(`/api/activity/recent`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        if(response.success === true) {
          setRecentActivity(response);
        } else {
          dispatch(setNotification({ type: "error", text: response.message }));
        }
      });
    }
    fetchRecent();
  }, []);
  const [recentActivity, setRecentActivity] = useState<any>([]);

  const [memberModal, setMemberModal] = useState(false);
  const [selected, setSelected] = useState<{ id: number; class: number; grade: number; number: number; profile: string; name: string; }[]>([]);

  const [teacherModal, setTeacherModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<{ id: number; class: number; grade: number; number: number; profile: string; name: string; }[]>([]);

  const [time, setTime] = useState<number[]>([]);
  const [place, setPlace] = useState<undefined | {id:number, place:string}>();
  const [placeModal, setPlaceModal] = useState(false);

  const { data:place_traffic, error } = useSWR(`/api/activity/place-traffic/${place?.id}`);
  useEffect(() => {
    if(document) setLoad(true);
  }, []);

  return (
    <div>
      <AnimatePresence initial={false} mode="wait">
        { memberModal && <Modal handleClose={() => {
          setMemberModal(false);
          setTimeout(() => {
            setModal(true);
          }, 150);
        }}>
          <SelectMember selected={selected} fn={(selected) => {
            setSelected(selected);
            setMemberModal(false);
            setTimeout(() => {
              setModal(true);
            }, 150);
          }} />
        </Modal> }
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait">
        { teacherModal && <Modal handleClose={() => {
          setTeacherModal(false);
          setTimeout(() => {
            setModal(true);
          }, 150);
        }}>
          <SelectMember disableFavorite disableGroup disableStudent disableTeacher={false} limit={1} selected={selectedTeacher} fn={(selected) => {
            setSelectedTeacher(selected);
            setTeacherModal(false);
            setTimeout(() => {
              setModal(true);
            }, 150);
          }} />
        </Modal> }
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait">
        { placeModal && <Modal scroll handleClose={() => {
          setPlaceModal(false);
          setTimeout(() => {
            setModal(true);
          }, 150);
        }}>
          <SelectPlace handleClose={() => {
            setPlaceModal(false);
            setTimeout(() => {
              setModal(true);
            }, 150);
          }} fn={(selected:{id:number,place:string}) => {
            setPlace(selected);
            setPlaceModal(false);
            setTimeout(() => {
              setModal(true);
            }, 150);
          }} />
        </Modal> }
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait">
        { modal && <Modal scroll handleClose={() => setModal(false)}>
          <div className="w-full md:w-[380px] h-[520px]">
            <div className="flex justify-end">
              <div onClick={() => setModal(false)} className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer">
                <svg className="w-6 h-6 p-1 rounded-full stroke-gray-400" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col justify-between h-full">
              <div className="pb-20">
                <div className="font-bold text-zinc-800 text-2xl mt-5">활동 승인 요청하기</div>
                { recentActivity?.activity?.length > 0 && <OpacityAnimation>
                  <div className="bg-gray-100 rounded-xl p-2 mt-4">
                    <div className="font-bold text-lightgray-200 text-sm mb-1 px-1 flex items-center">
                      <svg className="stroke-lightgray-200 w-5 h-5 mr-1" fill="none" strokeWidth={2.3} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      최근 내역 사용하기
                    </div>
                    { recentActivity.activity.map((activity:any) => {
                      return (
                        <div onClick={() => {
                          setContent(activity.content);
                          setSelected(activity.relation.map((item:any) => item.user));
                          setSelectedTeacher([activity.teacher]);
                          setTime(activity.perio.split(',').map((item:string) => +item));
                          setPlace({ id: activity.place.id, place: activity.place.place });
                        }} className="flex text-zinc-800 items-center justify-between p-1 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                          <div className="text-sm">'{activity.content}' {activity.relation.length > 0 && '-'} { activity.relation.length <= 0 ? '' : activity.relation.length === 1 ? activity.relation[0].user.name : activity.relation.length === 2 ? `${activity.relation[0].user.name}, ${activity.relation[1].user.name}` : `${activity.relation[0].user.name}, ${activity.relation[1].user.name} 외 ${activity.relation.length - 2}명` }</div>
                          <div className="text-sm">{ displayDate(activity.createdAt, 'date-left') === 0 ? '오늘' : `${-(+displayDate(activity.createdAt, 'date-left'))}일 전` }</div>
                        </div>
                      )
                    }) }
                  </div>
                </OpacityAnimation> }
                <div>
                  <div className="text-zinc-800 mb-1 mt-5">활동 내용</div>
                  <Input value={content} placeholder="R&E" autoFocus fn={(value:string) => setContent(value)} />
                </div>
                <div>
                  <div className="text-zinc-800 mb-1 mt-5">활동 장소</div>
                  <InputButton value={ !place ? '이곳을 눌러 선택하세요' : place.place } fn={() => {
                    setModal(false);
                    setTimeout(() => {
                      setPlaceModal(true);
                    }, 150);
                  }}/>
                    <div className="text-sm mt-1">
                      { place_traffic?.activity?.length <= 0 && <div className="flex items-center space-x-1">
                        <div className="w-4 h-2 rounded-full bg-green-500"></div>
                        <div className="text-sm">쾌적</div>
                      </div> }
                      { place_traffic?.activity?.filter((activity: any) => activity.perio.split(',').includes('1')).length === 1 && <div className="flex items-center space-x-1">
                      <div className="w-4 h-2 rounded-full bg-orange-500"></div>
                      <div className="text-sm">7교시 다소 혼잡(1팀)</div>
                      </div> }
                      { place_traffic?.activity?.filter((activity: any) => activity.perio.split(',').includes('1')).length > 1 && <div className="flex items-center space-x-1">
                      <div className="w-4 h-2 rounded-full bg-red-500"></div>
                      <div className="text-sm">7교시 매우 혼잡({place_traffic?.activity?.filter((activity: any) => activity.perio.split(',').includes('1')).length}팀)</div>
                      </div> }
                      { place_traffic?.activity?.filter((activity: any) => activity.perio.split(',').includes('2')).length === 1 && <div className="flex items-center space-x-1">
                      <div className="w-4 h-2 rounded-full bg-orange-500"></div>
                      <div className="text-sm">8-9교시 다소 혼잡(1팀)</div>
                      </div> }
                      { place_traffic?.activity?.filter((activity: any) => activity.perio.split(',').includes('2')).length > 1 && <div className="flex items-center space-x-1">
                      <div className="w-4 h-2 rounded-full bg-red-500"></div>
                      <div className="text-sm">8-9교시 매우 혼잡({place_traffic?.activity?.filter((activity: any) => activity.perio.split(',').includes('2')).length}팀)</div>
                      </div> }
                      { place_traffic?.activity?.filter((activity: any) => activity.perio.split(',').includes('3')).length === 1 && <div className="flex items-center space-x-1">
                      <div className="w-4 h-2 rounded-full bg-orange-500"></div>
                      <div className="text-sm">야자 1교시 다소 혼잡(1팀)</div>
                      </div> }
                      { place_traffic?.activity?.filter((activity: any) => activity.perio.split(',').includes('3')).length > 1 && <div className="flex items-center space-x-1">
                      <div className="w-4 h-2 rounded-full bg-red-500"></div>
                      <div className="text-sm">야자 1교시 매우 혼잡({place_traffic?.activity?.filter((activity: any) => activity.perio.split(',').includes('3')).length}팀)</div>
                      </div> }
                      { place_traffic?.activity?.filter((activity: any) => activity.perio.split(',').includes('4')).length === 1 && <div className="flex items-center space-x-1">
                      <div className="w-4 h-2 rounded-full bg-orange-500"></div>
                      <div className="text-sm">야자 2교시 다소 혼잡(1팀)</div>
                      </div> }
                      { place_traffic?.activity?.filter((activity: any) => activity.perio.split(',').includes('4')).length > 1 && <div className="flex items-center space-x-1">
                      <div className="w-4 h-2 rounded-full bg-red-500"></div>
                      <div className="text-sm">야자 2교시 매우 혼잡({place_traffic?.activity?.filter((activity: any) => activity.perio.split(',').includes('4')).length}팀)</div>
                      </div> }
                    </div>
                </div>
                <div>
                  <div className="text-zinc-800 mb-1 mt-5">활동 시간</div>
                  <div className="flex rounded-full px-1 py-1 bg-gray-100">
                    <div onClick={() => {
                      if(time.indexOf(1) === -1) {
                        setTime([...time, 1]);
                      } else {
                        setTime(time.filter((item) => item !== 1));
                      }
                    }} className={ time.indexOf(1) === -1 ? "rounded-full w-[100px] py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-all" : `${time.indexOf(2) === -1 ? 'rounded-full' : 'rounded-l-full'} w-[100px] py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer transition-all` }>7교시</div>
                    <div onClick={() => {
                      if(time.indexOf(2) === -1) {
                        setTime([...time, 2]);
                      } else {
                        setTime(time.filter((item) => item !== 2));
                      }
                    }} className={ time.indexOf(2) === -1 ? "rounded-full w-[100px] py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-all" : `${time.indexOf(1) === -1 && 'rounded-l-full'} ${time.indexOf(3) === -1 && 'rounded-r-full'} w-[100px] py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer` }>8-9교시</div>
                    <div onClick={() => {
                      if(time.indexOf(3) === -1) {
                        setTime([...time, 3]);
                      } else {
                        setTime(time.filter((item) => item !== 3));
                      }
                    }} className={ time.indexOf(3) === -1 ? "rounded-full w-[100px] py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-all" : `${time.indexOf(2) === -1 && 'rounded-l-full'} ${time.indexOf(4) === -1 && 'rounded-r-full'} w-[100px] py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer` }>야자 1교시</div>
                    <div onClick={() => {
                      if(time.indexOf(4) === -1) {
                        setTime([...time, 4]);
                      } else {
                        setTime(time.filter((item) => item !== 4));
                      }
                    }} className={ time.indexOf(4) === -1 ? "rounded-full w-[100px] py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-all" : `${time.indexOf(3) === -1 ? 'rounded-full' : 'rounded-r-full'} w-[100px] py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer transition-all` }>야자 2교시</div>
                  </div>
                </div>
                <div>
                  <div className="text-zinc-800 mb-1 mt-5">담당 교사</div>
                  <InputButton value={ selectedTeacher.length <= 0 ? '이곳을 눌러 선택하세요' : selectedTeacher[0].name } fn={() => {
                    setModal(false);
                    setTimeout(() => {
                      setTeacherModal(true);
                    }, 150);
                  }}/>
                </div>
                <div className="mb-3">
                  <div className="text-zinc-800 mb-1 mt-5">추가 구성원</div>
                  <InputButton value={ selected.length <= 0 ? '이곳을 눌러 선택하세요' : selected.length === 1 ? selected[0].name : selected.length === 2 ? `${selected[0].name}, ${selected[1].name}` : `${selected[0].name}, ${selected[1].name} 외 ${selected.length - 2}명` } fn={() => {
                    setModal(false);
                    setTimeout(() => {
                      setMemberModal(true);
                    }, 150);
                  }}/>
                </div>
              </div>
            </div>
            <div className="absolute bottom-5 w-full right-0 left-0 pl-5 pr-5 md:pr-7">
              <div className="w-full md:w-[380px] h-8 bg-white -bottom-5 absolute"></div>
              <Button color="blue" loading={loading} fn={() => postTodo()}>
                요청하기
              </Button>
            </div>
          </div>
        </Modal> }
      </AnimatePresence>
      { load && document.cookie.split('; ').find(row => row.startsWith('type='))?.split('=')[1] === '0' && <OpacityAnimation>
        <div className="md:block hidden">
          <SubButton color="blue" fn={() => {
            setContent('');
            setSelected([]);
            setSelectedTeacher([]);
            setModal(true);
            setPlace(undefined);
            setTime([]);
          }}>
            <div className="flex items-center ml-4 mr-5">
              <svg className="w-5 h-5 mr-1" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              활동 승인 요청하기
            </div>
          </SubButton>
        </div>
      </OpacityAnimation> }
      { load && document.cookie.split('; ').find(row => row.startsWith('type='))?.split('=')[1] === '0' && <OpacityAnimation>
        <div className="md:hidden block fixed bottom-20 right-4 z-30">
          <CircleButton color="blue" fn={() => {
            setContent('');
            setSelected([]);
            setSelectedTeacher([]);
            setModal(true);
            setPlace(undefined);
            setTime([]);
          }}>
            <div className="flex items-center mx-3">
              <svg className="w-6 h-6 m-[5px]" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
          </CircleButton>
        </div>
      </OpacityAnimation> }
    </div>
  )
}