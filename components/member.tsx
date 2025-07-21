'use client';

import Button, { SubButton } from "@components/button";
import Input from "@components/input";
import { setNotification } from "@libs/client/redux/notification";
import Image from 'next/image';
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { OpacityAnimation } from "./animation";
import { useAppDispatch } from "@libs/client/redux/hooks";
import errorMessage from "@libs/client/error-message";
import hansearch from "hangul-search";
import { AnimatePresence } from "framer-motion";
import Modal from "./modal";
import UpModal from "./up-modal";
import { CircularProgress } from "@node_modules/@mui/material";

// Select Members Modal
export default function SelectMember({ fn, disableTeacher = true, disableFavorite = false, disableGroup = false, disableStudent = false, limit, selected:inputSelected, notMe = true, modalFn }:{ fn:(selected:{ id: number, class: number, grade: number, number: number, profile: string, name: string }[])=>void, disableTeacher?:boolean, disableFavorite?:boolean, disableGroup?:boolean, disableStudent?:boolean, limit?:number, selected:{ id: number, class: number, grade: number, number: number, profile: string, name: string }[], notMe?:boolean, modalFn?:(value:boolean)=>void }) {
  const [info, setInfo] = useState(0);
  const [type, setType] = useState(0);

  useEffect(() => {
    if(document.cookie.indexOf('member-info-modal=') === -1) {
      setInfo(1);
    }
    if(disableFavorite) setType(1);
    if(disableFavorite && disableStudent) setType(2);
    if(disableFavorite && disableStudent && disableGroup) setType(3);

    setSelected(inputSelected);
  }, []);

  const dispatch = useAppDispatch();
  const { data:favorite, error:favoriteError } = useSWR('/api/user/group');
  const { data:member, error:memberError } = useSWR('/api/member');
  const { data:group, error:groupError } = useSWR('/api/group');
  const { data:teacher, error:teacherError } = useSWR('/api/member/teacher');
  const { data:user, error:userError } = useSWR('/api/user');
  useEffect(() => {
    if(favoriteError || memberError || groupError || teacherError || userError) {
      dispatch(setNotification({ type: 'error', text: errorMessage.unknown }));
    }
  }, [favoriteError, memberError, groupError, teacherError, userError]);

  const [search, setSearch] = useState('');
  const [preSearch, setPreSearch] = useState("");
  const [searchedResult, setSearchedResult] = useState<any>({ items: [] });
  const onKeyPress = (e: { key: string; }) => {
    if(e.key == 'Enter') {
      setSearch(preSearch);
    }
  }
  const handleSearch = (e: { target: { value: string; }; }) => {
    const {value} = {...e.target};
    setPreSearch(value);
    setSearch(value);
  }

  useEffect(() => {
    if(type === 0 && favorite?.success === true) {
      setSearchedResult(hansearch(favorite.groups, search));
    }
    if(type === 1 && member?.success === true) {
      setSearchedResult(hansearch(member.members, search));
    }
    if(type === 2 && group?.success === true) {
      setSearchedResult(hansearch(group.groups, search));
    }
    if(type === 3 && teacher?.success === true) {
      setSearchedResult(hansearch(teacher.teachers, search));
    }
  }, [search, type, group, teacher]);

  const [selected, setSelected] = useState<{ id: number, class: number, grade: number, number: number, profile: string, name: string }[]>([]);
  const [groupSelected, setGroupSelected] = useState<{ id: number, class: number, grade: number, number: number, profile: string, name: string }[]>([]);

  function selectMember(member:{ id: number, class: number, grade: number, number: number, profile: string, name: string }[]) {
    let tempSelected:{ id: number, class: number, grade: number, number: number, profile: string, name: string }[] = [];
    member.forEach((value) => {
      if(limit && selected.length + tempSelected.length >= limit && limit !== 1 && addGroupStatus === false) {
        return dispatch(setNotification({ type: 'error', text: `최대 ${limit}명까지만 선택할 수 있어요` }));
      }
      if(value.id === user?.user?.id) {
        if(notMe) {
          return dispatch(setNotification({ type: 'info', text: '나를 제외한 그룹 구성원을 선택했어요' }));
        }
      }
      if(((addGroupStatus === false && !selected.some((member) => member.id === value.id)) || (addGroupStatus === true && !groupSelected.some((member) => member.id === value.id))) && !(notMe === true && value.id === user?.user?.id)) {
        if(limit === 1 && addGroupStatus === false) tempSelected = [];
        tempSelected.push({
          id: value.id,
          class: value.class,
          grade: value.grade,
          number: value.number,
          profile: value.profile,
          name: value.name
        });
      }
    });

    if(addGroupStatus === false) {
      if(limit === 1) setSelected([...tempSelected]);
      else setSelected([...selected, ...tempSelected]);
    } else if(addGroupStatus === true) {
      setGroupSelected([...groupSelected, ...tempSelected]);
    }
  }
  function unselectMember(id:number) {
    if(addGroupStatus === true) setGroupSelected([...groupSelected.filter((member) => member.id !== id)]);
    else setSelected([...selected.filter((member) => member.id !== id)]);
  }

  const [addGroupInfoModal, setAddGroupInfoModal] = useState(false);
  const [addGroupStatus, setAddGroupStatus] = useState(false);
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !addGroupStatus) {
        fn(selected);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selected, addGroupStatus]);

  const [loading, setLoading] = useState(false);
  async function createGroup() {
    if(loading) return;

    if(groupName.length <= 0 || groupName.length > 20) {
      setType(0);
      return dispatch(setNotification({ type: "error", text: "그룹 이름은 비어있거나 20자 이상일 수 없어요" }));
    }
    if(groupSelected.length <= 0) {
      setType(1);
      return dispatch(setNotification({ type: "error", text: "한 명 이상의 구성원을 선택하세요" }));
    }

    setLoading(true);
    if(selectedGroup === null) {
      await fetch(`/api/user/group`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: groupSelected.map((member) => member.id),
          name: groupName
        })
      })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        if(response.success === true) {
          dispatch(setNotification({ type: "success", text: '그룹을 생성했어요' }));
          setSearch('');
          setPreSearch('');
          mutate('/api/user/group');
          setAddGroupStatus(false);
          setType(0);
        } else {
          dispatch(setNotification({ type: "error", text: response.message }));
        }
      });
    } else {
      await fetch(`/api/user/group`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: groupSelected.map((member) => member.id),
          name: groupName,
          id: selectedGroup
        })
      })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        if(response.success === true) {
          dispatch(setNotification({ type: "success", text: '그룹을 저장했어요' }));
          setSearch('');
          setPreSearch('');
          mutate('/api/user/group');
          setAddGroupStatus(false);
          setType(0);
          setSelectedGroup(null);
        } else {
          dispatch(setNotification({ type: "error", text: response.message }));
        }
      });
    }
  }

  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);

  const [deleteLoading, setDeleteLoading] = useState(false);
  async function deleteGroup() {
    if(deleteLoading) return;

    setDeleteLoading(true);
    await fetch(`/api/user/group`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: selectedGroup
      })
    })
    .then((response) => response.json())
    .then((response) => {
      setDeleteLoading(false);
      if(response.success === true) {
        dispatch(setNotification({ type: "success", text: '그룹을 삭제했어요' }));
        mutate('/api/user/group');
        setAddGroupStatus(false);
        setType(0);
        setSelectedGroup(null);
      } else {
        dispatch(setNotification({ type: "error", text: response.message }));
      }
    });
  }

  return (
    <div className="md:w-[700px] w-full h-[520px]">
      { info === 0 && <OpacityAnimation>
        <div className="-m-5 flex w-full relative">
          <div className="py-3">
            { !disableFavorite && <div className="flex items-center">
              { type === 0 && <div className="w-1 h-6 bg-blue-500 rounded-r-lg absolute"></div> }
              <div onClick={() => setType(0)} className="w-10 h-10 ml-1 cursor-pointer rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                <svg className={ type !== 0 ? "fill-lightgray-100 stroke-lightgray-100 w-7 h-7" : "fill-blue-500 stroke-blue-500 w-7 h-7" } fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <AnimatePresence initial={false} mode="wait">
                {addGroupInfoModal && <UpModal handleClose={() => setAddGroupInfoModal(false)}>
                  <div className="bg-blue-500/10 w-[160px] backdrop-blur-sm text-sm text-blue-500 space-x-2 p-1 px-2 rounded-lg absolute top-[30px] left-[-2px] flex z-10">
                    <svg className="w-5 h-5" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    <div>
                      여기서 그룹에 추가할<br/>구성원을 선택하세요
                    </div>
                  </div>
                </UpModal>}
              </AnimatePresence>
            </div> }
            { !disableStudent && <div className="flex items-center">
              { type === 1 && <div className="w-1 h-6 bg-blue-500 rounded-r-lg absolute"></div> }
              <div onClick={() => setType(1)} className="w-10 h-10 ml-1 cursor-pointer rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                <svg className={ type !== 1 ? "fill-lightgray-100 stroke-lightgray-100 w-7 h-7" : "fill-blue-500 stroke-blue-500 w-7 h-7" } fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
            </div> }
            { !disableGroup && <div className="flex items-center">
              { type === 2 && <div className="w-1 h-6 bg-blue-500 rounded-r-lg absolute"></div> }
              <div onClick={() => setType(2)} className="w-10 h-10 ml-1 cursor-pointer rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                <svg className={ type !== 2 ? "fill-lightgray-100 stroke-lightgray-100 w-7 h-7" : "fill-blue-500 stroke-blue-500 w-7 h-7" } fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
              </div>
            </div> }
            { !disableTeacher && <div className="flex items-center">
              { type === 3 && <div className="w-1 h-6 bg-blue-500 rounded-r-lg absolute"></div> }
              <div onClick={() => setType(3)} className="w-10 h-10 ml-1 cursor-pointer rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                <svg className={ type !== 3 ? "stroke-lightgray-100 fill-lightgray-100 w-7 h-7" : "stroke-blue-500 fill-blue-500 w-7 h-7" } fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
            </div> }
          </div>
          <div className="h-[520px] w-[1px] bg-lightgray-100 my-3 ml-1"></div>
          <div className="w-full -mr-20 md:pr-0 pr-3">
            <div className="flex md:flex-row flex-col">
              { type === 0 && <div className="w-full md:h-[540px] h-[300px] rounded-r-2xl p-3">
                { addGroupStatus === false ? <OpacityAnimation>
                  <div className="flex items-center w-full space-x-2">
                    <input value={preSearch} onChange={handleSearch} onKeyDown={onKeyPress} type="text" className="w-full h-10 bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl px-5 outline-none text-base" autoFocus placeholder="초성으로 검색해보세요." />
                    { type === 0 && <div onClick={() => {
                      setGroupName('');
                      setGroupSelected([]);
                      setAddGroupStatus(true);
                      setTimeout(() => {
                        setAddGroupInfoModal(true);
                        setTimeout(() => {
                          setAddGroupInfoModal(false);
                        }, 2000);
                      }, 300);
                    }} className="w-10 h-10">
                      <div className="w-10 h-10 cursor-pointer flex items-center justify-center bg-blue-100 hover:bg-blue-200 transition-colors text-blue-500 rounded-xl">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </div> }
                  </div>
                  <div className="mt-2 overflow-auto h-[240px] md:h-[460px] custom-scroll pr-2 relative">
                    { (favorite && favorite?.success === true) && <div>
                      { (favorite.groups.length > 0 && searchedResult.items.length <= 0 && search !== '') && <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <OpacityAnimation>
                          <div className="flex items-center justify-center flex-col space-y-2">
                            <svg className="w-10 h-10 stroke-lightgray-200" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                            <div className="w-[180px] h-12 flex items-center justify-center text-lightgray-200 text-center text-sm">검색 결과가 없어요<br/>검색어를 다시 한번 확인해주세요</div>
                          </div>
                        </OpacityAnimation>
                      </div> }
                      { favorite.groups.length <= 0 && <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <OpacityAnimation>
                          <div className="flex items-center justify-center flex-col space-y-2">
                            <svg className="w-10 h-10 stroke-lightgray-200" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                            <div className="w-full h-12 flex items-center justify-center text-lightgray-200 text-center text-sm">나만의 그룹이 없어요<br/>그룹을 만들어보세요</div>
                            <div onClick={() => {
                              setGroupName('');
                              setGroupSelected([]);
                              setAddGroupStatus(true);
                              setTimeout(() => {
                                setAddGroupInfoModal(true);
                                setTimeout(() => {
                                  setAddGroupInfoModal(false);
                                }, 2000);
                              }, 300);
                            }} className="bg-blue-100 hover:bg-blue-200 cursor-pointer transition-colors p-1 rounded-lg text-sm text-blue-500 px-2">나만의 그룹 만들기</div>
                          </div>
                        </OpacityAnimation>
                      </div> }
                      { search === '' ? favorite.groups.map((value:any, index:number) => {
                        return (
                          <OpacityAnimation key={value.id}>
                            <div onClick={() => selectMember([...value.relation.map((value:any) => value.user)])} className="w-full h-16 hover:bg-gray-50 transition-colors rounded-xl px-5 flex items-center justify-between space-x-2 cursor-pointer">
                              <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                                  <svg className="w-7 h-7 stroke-lightgray-200" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                  </svg>
                                </div>
                                <div className="-space-y-0">
                                  <div className="text-base font-bold">{value.name}</div>
                                  <div className="text-sm text-lightgray-200">{value.relation?.length}명</div>
                                </div>
                              </div>
                              <div onClick={(e) => {
                                e.stopPropagation();
                                setSelectedGroup(value.id);
                                setGroupName(value.name);
                                setGroupSelected([...value.relation.map((value:any) => ({
                                  id: value.user.id,
                                  class: value.user.class,
                                  grade: value.user.grade,
                                  number: value.user.number,
                                  profile: value.user.profile,
                                  name: value.user.name
                                }))]);
                                setAddGroupStatus(true);
                              }} className="w-7 h-7 hover:bg-gray-100 transition-colors text-gray-400 bg-gray-100 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </div>
                            </div>
                          </OpacityAnimation>
                        )
                      }) : searchedResult.items.map((value:any, index:number) => {
                        return (
                          <OpacityAnimation key={value.id}>
                            <div onClick={() => selectMember([...value.relation.map((value:any) => value.user)])} className="w-full h-16 hover:bg-gray-50 transition-colors rounded-xl px-5 flex items-center justify-between space-x-2 cursor-pointer">
                              <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                                  <svg className="w-7 h-7 stroke-lightgray-200" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                  </svg>
                                </div>
                                <div className="-space-y-0">
                                  <div className="text-base font-bold">{value.name}</div>
                                  <div className="text-sm text-lightgray-200">{value.relation?.length}명</div>
                                </div>
                              </div>
                            </div>
                          </OpacityAnimation>
                        )
                      }) }
                    </div> }
                    { !favorite && [...Array(20)].map((value, index) => {
                      return ( 
                        <div key={index} className="w-full h-16 rounded-xl px-5 flex items-center space-x-2 animate-pulse">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
                          <div className="space-y-1">
                            <div className="w-20 h-6 bg-gray-100 rounded-md"></div>
                            <div className="w-24 h-3 bg-gray-100 rounded-md"></div>
                          </div>
                        </div>
                      )
                    }) }
                  </div>
                </OpacityAnimation> : <OpacityAnimation>
                  <div onClick={() => {
                    setAddGroupStatus(false);
                    setSelectedGroup(null);
                  }} className="mb-5 text-sm text-gray-500 flex items-center space-x-1 mt-1 cursor-pointer">
                    <svg className="w-5 h-5" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                    <div>구성원 선택으로 돌아가기</div>
                  </div>
                  {/* <div className="font-bold text-blue-500 text-lg mb-5">나만의 그룹 만들기</div> */}
                  <div>그룹 이름</div>
                  <Input fn={(value:string) => setGroupName(value)} value={groupName} autoFocus placeholder="그룹 이름(과제연구 팀원 등)" />
                  { selectedGroup !== null && <div>
                    <div className="mt-5 mb-1">그룹 삭제하기</div>
                    <div className="flex">
                      <SubButton loading={deleteLoading} color="lightblue" fn={() => deleteGroup()}>
                        { deleteLoading ? <CircularProgress color="inherit" size={20} /> : '그룹 삭제하기' }
                      </SubButton>
                    </div>
                  </div> }
                </OpacityAnimation> }
              </div> }
              { type === 1 && <div className="w-full md:h-[540px] h-[300px] rounded-r-2xl p-3">
                <OpacityAnimation>
                  <input value={preSearch} onChange={handleSearch} onKeyDown={onKeyPress} type="text" className="w-full h-10 bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl px-5 outline-none text-base" autoFocus placeholder="초성 또는 학번으로 검색해보세요." />
                  <div className="mt-2 overflow-auto h-[240px] md:h-[460px] custom-scroll pr-2 relative">
                    { (member && member?.success === true && user && user?.success === true) && <div>
                      { (searchedResult.items.length <= 0 && search !== '') && <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <OpacityAnimation>
                          <div className="flex items-center justify-center flex-col space-y-2">
                            <svg className="w-10 h-10 stroke-lightgray-200" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                            <div className="w-[180px] h-12 flex items-center justify-center text-lightgray-200 text-center text-sm">검색 결과가 없어요<br/>검색어를 다시 한번 확인해주세요</div>
                          </div>
                        </OpacityAnimation>
                      </div> }
                      { search === '' ? member.members.map((value:any, index:number) => {
                        return (
                          <OpacityAnimation key={value.id}>
                            { !(notMe === true && value.id === user.user.id) && <div onClick={() => selectMember([value])} className="w-full h-16 hover:bg-gray-50 transition-colors rounded-xl px-5 flex items-center justify-between space-x-2 cursor-pointer">
                              <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 rounded-xl overflow-hidden">
                                  {value.profile && <Image
                                    src={value.profile}
                                    width={40}
                                    height={40}
                                    alt="프로필"
                                  />}
                                </div>
                                <div className="-space-y-0">
                                  <div className="text-base font-bold">{value.name}</div>
                                  <div className="text-sm text-lightgray-200">{value.grade}학년 {value.class}반 {value.number}번</div>
                                </div>
                              </div>
                              {/* { value.id !== user.user.id && <div className="cursor-pointer" onClick={ favorite?.favorites.some((e:{ to: { id:number } }) => e.to.id === value.id) ? () => deleteFavorite(value.id) : () => postFavorite(value.id) }>
                                <svg className={ favorite?.favorites.some((e:{ to: { id:number } }) => e.to.id === value.id) ? "w-5 h-5 fill-yellow-500 stroke-yellow-500" : "w-5 h-5 stroke-lightgray-200" } fill="none" strokeWidth={1.7} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                </svg>
                              </div> } */}
                            </div> }
                          </OpacityAnimation>
                        )
                      }) : searchedResult.items.map((value:any, index:number) => {
                        return (
                          <OpacityAnimation key={value.id}>
                            { !(notMe === true && value.id === user.user.id) && <div onClick={() => selectMember([value])} className="w-full h-16 hover:bg-gray-50 transition-colors rounded-xl px-5 flex items-center justify-between space-x-2 cursor-pointer">
                              <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 rounded-xl overflow-hidden">
                                  {value.profile && <Image
                                    src={value.profile}
                                    width={40}
                                    height={40}
                                    alt="프로필"
                                  />}
                                </div>
                                <div className="-space-y-0">
                                  <div className="text-base font-bold">{value.name}</div>
                                  <div className="text-sm text-lightgray-200">{value.grade}학년 {value.class}반 {value.number}번</div>
                                </div>
                              </div>
                              {/* { value.id !== user.user.id && <div className="cursor-pointer" onClick={() => postFavorite(value.id)}>
                                <svg className={ favorite.favorites.some((e:{ to: { id:number } }) => e.to.id === value.id) ? "w-5 h-5 fill-yellow-500 stroke-yellow-500" : "w-5 h-5 stroke-lightgray-200" } fill="none" strokeWidth={1.7} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                </svg>
                              </div> } */}
                            </div> }
                          </OpacityAnimation>
                        )
                      }) }
                    </div> }
                    { !member && [...Array(20)].map((value, index) => {
                      return ( 
                        <div key={index} className="w-full h-16 rounded-xl px-5 flex items-center space-x-2 animate-pulse">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
                          <div className="space-y-1">
                            <div className="w-16 h-6 bg-gray-100 rounded-lg"></div>
                            <div className="w-24 h-3 bg-gray-100 rounded-md"></div>
                          </div>
                        </div>
                      )
                    }) }
                  </div>
                </OpacityAnimation>
              </div> }
              { type === 2 && <div className="w-full md:h-[540px] h-[300px] rounded-r-2xl p-3">
                <OpacityAnimation>
                  <input value={preSearch} onChange={handleSearch} onKeyDown={onKeyPress} type="text" className="w-full h-10 bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl px-5 outline-none text-base" autoFocus placeholder="초성으로 검색해보세요." />
                  <div className="mt-2 overflow-auto h-[240px] md:h-[460px] custom-scroll pr-2 relative">
                    { (group && group?.success === true) && <div>
                      { (searchedResult.items.length <= 0 && search !== '') && <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <OpacityAnimation>
                          <div className="flex items-center justify-center flex-col space-y-2">
                            <svg className="w-10 h-10 stroke-lightgray-200" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                            <div className="w-[180px] h-12 flex items-center justify-center text-lightgray-200 text-center text-sm">검색 결과가 없어요<br/>검색어를 다시 한번 확인해주세요</div>
                          </div>
                        </OpacityAnimation>
                      </div> }
                      { search === '' ? group.groups.map((value:any, index:number) => {
                        return (
                          <OpacityAnimation key={value.id}>
                            <div onClick={() => selectMember([...value.relation.map((value:any) => value.user)])} className="w-full h-16 hover:bg-gray-50 transition-colors rounded-xl px-5 flex items-center justify-between space-x-2 cursor-pointer">
                              <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                                  <svg className="w-8 h-8 stroke-lightgray-200" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                                  </svg>
                                </div>
                                <div className="-space-y-0">
                                  <div className="text-base font-bold">{value.name}</div>
                                  <div className="text-sm text-lightgray-200">{value.relation?.length}명</div>
                                </div>
                              </div>
                            </div>
                          </OpacityAnimation>
                        )
                      }) : searchedResult.items.map((value:any, index:number) => {
                        return (
                          <OpacityAnimation key={value.id}>
                            <div onClick={() => selectMember([...value.relation.map((value:any) => value.user)])} className="w-full h-16 hover:bg-gray-50 transition-colors rounded-xl px-5 flex items-center justify-between space-x-2 cursor-pointer">
                              <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                                  <svg className="w-8 h-8 stroke-lightgray-200" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                                  </svg>
                                </div>
                                <div className="-space-y-0">
                                  <div className="text-base font-bold">{value.name}</div>
                                  <div className="text-sm text-lightgray-200">{value.relation?.length}명</div>
                                </div>
                              </div>
                            </div>
                          </OpacityAnimation>
                        )
                      }) }
                    </div> }
                    { !group && [...Array(20)].map((value, index) => {
                      return ( 
                        <div key={index} className="w-full h-16 rounded-xl px-5 flex items-center space-x-2 animate-pulse">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
                          <div className="space-y-1">
                            <div className="w-16 h-6 bg-gray-100 rounded-lg"></div>
                            <div className="w-24 h-3 bg-gray-100 rounded-md"></div>
                          </div>
                        </div>
                      )
                    }) }
                  </div>
                </OpacityAnimation>
              </div> }
              { type === 3 && <div className="w-full md:h-[540px] h-[300px] rounded-r-2xl p-3">
                <OpacityAnimation>
                  <input value={preSearch} onChange={handleSearch} onKeyDown={onKeyPress} type="text" className="w-full h-10 bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl px-5 outline-none text-base" autoFocus placeholder="초성으로 검색해보세요." />
                  <div className="mt-2 overflow-auto h-[240px] md:h-[460px] custom-scroll pr-2 relative">
                    { (teacher && teacher?.success === true) && <div>
                      { (searchedResult.items.length <= 0 && search !== '') && <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <OpacityAnimation>
                          <div className="flex items-center justify-center flex-col space-y-2">
                            <svg className="w-10 h-10 stroke-lightgray-200" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                            <div className="w-[180px] h-12 flex items-center justify-center text-lightgray-200 text-center text-sm">검색 결과가 없어요<br/>검색어를 다시 한번 확인해주세요</div>
                          </div>
                        </OpacityAnimation>
                      </div> }
                      { search === '' ? teacher.teachers.map((value:any, index:number) => {
                        return (
                          <OpacityAnimation key={value.id}>
                            <div onClick={() => selectMember([value])} className="w-full h-16 hover:bg-gray-50 transition-colors rounded-xl px-5 flex items-center justify-between space-x-2 cursor-pointer">
                              <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 rounded-xl overflow-hidden">
                                  {value.profile && <Image
                                    src={value.profile}
                                    width={40}
                                    height={40}
                                    alt="프로필"
                                  />}
                                </div>
                                <div className="-space-y-0">
                                  <div className="text-base font-bold">{value.name}</div>
                                  <div className="text-sm text-lightgray-200">교사</div>
                                </div>
                              </div>
                            </div>
                          </OpacityAnimation>
                        )
                      }) : searchedResult.items.map((value:any, index:number) => {
                        return (
                          <OpacityAnimation key={value.id}>
                            <div onClick={() => selectMember([value])} className="w-full h-16 hover:bg-gray-50 transition-colors rounded-xl px-5 flex items-center justify-between space-x-2 cursor-pointer">
                              <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 rounded-xl overflow-hidden">
                                  {value.profile && <Image
                                    src={value.profile}
                                    width={40}
                                    height={40}
                                    alt="프로필"
                                  />}
                                </div>
                                <div className="-space-y-0">
                                  <div className="text-base font-bold">{value.name}</div>
                                  <div className="text-sm text-lightgray-200">교사</div>
                                </div>
                              </div>
                            </div>
                          </OpacityAnimation>
                        )
                      }) }
                    </div> }
                    { !teacher && [...Array(20)].map((value, index) => {
                      return ( 
                        <div key={index} className="w-full h-16 rounded-xl px-5 flex items-center space-x-2 animate-pulse">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
                          <div className="space-y-1">
                            <div className="w-16 h-6 bg-gray-100 rounded-lg"></div>
                            <div className="w-24 h-3 bg-gray-100 rounded-md"></div>
                          </div>
                        </div>
                      )
                    }) }
                  </div>
                </OpacityAnimation>
              </div> }
              <div className="w-full h-[240px] md:h-[540px] md:rounded-r-2xl bg-gray-50 flex items-center justify-between flex-col p-3">
                { addGroupStatus === false ? <div className="w-full pr-2 custom-scroll scroll-bg-gray-50 overflow-auto h-[460px]">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-lightgray-200 text-sm">선택됨 - {selected.length}명</div>
                    <div onClick={() => setSelected([])} className="text-lightgray-200 text-sm cursor-pointer">전체삭제</div>
                  </div>
                  { selected.map((value:any, index:number) => {
                    return (
                      <OpacityAnimation key={value.id}>
                        <div onClick={() => unselectMember(value.id)} className="w-full group h-16 hover:bg-gray-100 transition-colors rounded-xl px-5 flex items-center justify-between space-x-2 cursor-pointer">
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-xl overflow-hidden">
                              {value.profile && <Image
                                src={value.profile}
                                width={40}
                                height={40}
                                alt="프로필"
                              />}
                            </div>
                            <div className="-space-y-0">
                              <div className="text-base font-bold">{value.name}</div>
                              { value.number ? <div className="text-sm text-lightgray-200">{value.grade}학년 {value.class}반 {value.number}번</div> : <div className="text-sm text-lightgray-200">교사</div> }
                            </div>
                          </div>
                          <div className="cursor-pointer group-hover:opacity-100 opacity-0 transition-opacity">
                            <svg className="w-5 h-5 stroke-lightgray-200" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </div>
                        </div>
                      </OpacityAnimation>
                    )
                  }) }
                </div> : <div className="w-full pr-2 custom-scroll scroll-bg-gray-50 overflow-auto h-[460px]">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-lightgray-200 text-sm">선택됨 - {groupSelected.length}명</div>
                    <div onClick={() => setGroupSelected([])} className="text-lightgray-200 text-sm cursor-pointer">전체삭제</div>
                  </div>
                  { groupSelected.map((value:any, index:number) => {
                    return (
                      <OpacityAnimation key={value.id}>
                        <div onClick={() => unselectMember(value.id)} className="w-full group h-16 hover:bg-gray-100 transition-colors rounded-xl px-5 flex items-center justify-between space-x-2 cursor-pointer">
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-xl overflow-hidden">
                              {value.profile && <Image
                                src={value.profile}
                                width={40}
                                height={40}
                                alt="프로필"
                              />}
                            </div>
                            <div className="-space-y-0">
                              <div className="text-base font-bold">{value.name}</div>
                              { value.number ? <div className="text-sm text-lightgray-200">{value.grade}학년 {value.class}반 {value.number}번</div> : <div className="text-sm text-lightgray-200">교사</div> }
                            </div>
                          </div>
                          <div className="cursor-pointer group-hover:opacity-100 opacity-0 transition-opacity">
                            <svg className="w-5 h-5 stroke-lightgray-200" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </div>
                        </div>
                      </OpacityAnimation>
                    )
                  }) }
                </div> }
                <div className="w-full h-12">
                  <div className="w-full h-12">
                    <AnimatePresence initial={false} mode="wait">
                      {addGroupInfoModal && <UpModal handleClose={() => setAddGroupInfoModal(false)}>
                        <div className="bg-blue-500/10 w-[270px] backdrop-blur-sm text-sm text-blue-500 space-x-2 p-1 px-2 rounded-lg absolute bottom-[10px] left-[20px] flex z-10">
                          <svg className="w-5 h-5" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                          </svg>
                          <div className="text-center w-full">
                            아래 버튼을 눌러 그룹 생성을 완료하세요
                          </div>
                        </div>
                      </UpModal>}
                    </AnimatePresence>
                    { addGroupStatus === true && <Button loading={loading} fn={() => createGroup()} scalableHeight color="blue">
                      <OpacityAnimation>
                        <div className="flex items-center">
                          { selectedGroup === null ? '그룹 생성하기' : '저장하기' }
                        </div>
                      </OpacityAnimation>
                    </Button> }
                    { addGroupStatus === false && <Button fn={() => fn(selected)} scalableHeight color="lightblue">
                      <OpacityAnimation>
                        <div className="flex items-center">
                          {selected.length}명 선택 완료하기
                          <div className="border border-lightgray-100 bg-white px-[6px] drop-shadow-sm rounded-md text-sm text-lightgray-200 ml-2">Enter</div>
                        </div>
                      </OpacityAnimation>
                    </Button> }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </OpacityAnimation> }
      { info === 1 && <OpacityAnimation>
        <div>
          <div className="absolute overflow-hidden w-full h-[300px] bg-gradient-to-b from-gray-200 to-white -m-5 rounded-t-xl">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
              <Input disabled value={"ㄱㅁㅈ"} />
              <div className="w-full h-14 bg-gray-200 rounded-2xl flex items-center px-5 mt-3">김민재</div>
            </div>
          </div>
          <div className="flex flex-col justify-between h-full pb-0">
            <div className="mt-[300px]">
              <div className="font-bold text-2xl">초성으로<br/>구성원을 검색하세요</div>
              <div className="text-base text-lightgray-200 mt-2">초성으로도 구성원을 검색할 수 있습니다.<br/>이전보다 더 손쉬워진 검색을 경험해보세요.</div>
            </div>
            <div className="absolute bottom-5 right-5">
              <SubButton color="lightblue" fn={() => setInfo(2)}>
                다음
              </SubButton>
            </div>
          </div>
        </div>
      </OpacityAnimation> }
      { info === 2 && <OpacityAnimation>
        <div>
          <div className="absolute w-full h-[300px] bg-gradient-to-b from-gray-200 to-white -m-5 rounded-t-xl">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden h-[300px]">
              <div className="w-[150px] h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center px-5 mt-14">
                <svg className="w-6 h-6 mr-2" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
                1학년 1반
              </div>
              <div className="w-full h-14 bg-gray-200 rounded-2xl flex items-center px-5 mt-3">김민재</div>
              <div className="w-full h-14 bg-gray-200 rounded-2xl flex items-center px-5 mt-3">김도현</div>
              <div className="w-full h-14 bg-gray-200 rounded-2xl flex items-center px-5 mt-3">강윤재</div>
            </div>
          </div>
          <div className="flex flex-col justify-between h-full pb-0">
            <div className="mt-[300px]">
              <div className="font-bold text-2xl">공개 그룹을 선택해<br/>구성원을 다중 선택하세요.</div>
              <div className="text-base text-lightgray-200 mt-2">그룹을 선택하면 해당 그룹에 속한<br/>구성원이 모두 선택됩니다.</div>
            </div>
            <div className="absolute bottom-5 right-5">
              <SubButton color="lightblue" fn={() => setInfo(3)}>
                다음
              </SubButton>
            </div>
          </div>
        </div>
      </OpacityAnimation> }
      { info === 3 && <OpacityAnimation>
        <div>
          <div className="absolute w-full h-[300px] bg-gradient-to-b from-gray-200 to-white -m-5 rounded-t-xl">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 space-y-3">
              <div className="flex items-center justify-center space-x-5">
                <div className="w-8 h-8">
                  <svg className="stroke-yellow-500 fill-yellow-500" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                </div>
                <div className="w-[200px] h-10 bg-gray-200 rounded-xl flex items-center justify-center">전재연</div>
              </div>
              <div className="flex items-center justify-center space-x-5">
                <div className="w-8 h-8">
                  <svg className="stroke-yellow-500 fill-yellow-500" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                </div>
                <div className="w-[200px] h-10 bg-gray-200 rounded-xl flex items-center justify-center">정진욱</div>
              </div>
              <div className="flex items-center justify-center space-x-5">
                <div className="w-8 h-8">
                  <svg className="stroke-yellow-500 fill-yellow-500" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                </div>
                <div className="w-[200px] h-10 bg-gray-200 rounded-xl flex items-center justify-center">박성민</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between h-full pb-0">
            <div className="mt-[300px]">
              <div className="font-bold text-2xl">나만의 그룹을 만들어<br/>구성원을 추가할 수 있습니다.</div>
              <div className="text-base text-lightgray-200 mt-2">내 R&E 팀원, 동아리 부원들을 그룹에 추가하면,<br/>빠르게 선택할 수 있습니다.</div>
            </div>
            <div className="absolute bottom-5 right-5">
              <SubButton color="lightblue" fn={() => {
                setInfo(0);
                document.cookie = `member-info-modal=true; path=/`;
              }}>
                완료
              </SubButton>
            </div>
          </div>
        </div>
      </OpacityAnimation> }
    </div>
  )
}