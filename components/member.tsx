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

// Select Members Modal
export default function SelectMember({ fn, disableTeacher = true, disableFavorite = false, disableGroup = false, disableStudent = false, limit, selected:inputSelected, notMe = true }:{ fn:(selected:{ id: number, class: number, grade: number, number: number, profile: string, name: string }[])=>void, disableTeacher?:boolean, disableFavorite?:boolean, disableGroup?:boolean, disableStudent?:boolean, limit?:number, selected:{ id: number, class: number, grade: number, number: number, profile: string, name: string }[], notMe?:boolean }) {
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
  const { data:favorite, error:favoriteError } = useSWR('/api/user/favorite');
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
  }

  useEffect(() => {
    if(type === 0 && favorite?.success === true) {
      setSearchedResult(hansearch([...favorite?.favorites.map((value:any) => value.to)], search));
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

  async function deleteFavorite(id:number) {
    await fetch(`/api/user/favorite`, {
      method: 'DELETE',
      body: JSON.stringify({ to: id }),
    })
    .then((response) => response.json())
    .then((response) => {
      if(response.success === true) {
        dispatch(setNotification({ type: 'success', text: '해당 즐겨찾기를 제거했어요' }));
        mutate('/api/user/favorite');
      } else {
        dispatch(setNotification({ type: 'error', text: response.message }));
      }
    });
  }
  async function postFavorite(id:number) {
    await fetch(`/api/user/favorite`, {
      method: 'POST',
      body: JSON.stringify({ to: id }),
    })
    .then((response) => response.json())
    .then((response) => {
      if(response.success === true) {
        dispatch(setNotification({ type: 'success', text: '해당 즐겨찾기를 추가했어요' }));
        mutate('/api/user/favorite');
      } else {
        dispatch(setNotification({ type: 'error', text: response.message }));
      }
    });
  }

  const [selected, setSelected] = useState<{ id: number, class: number, grade: number, number: number, profile: string, name: string }[]>([]);
  function selectMember(member:{ id: number, class: number, grade: number, number: number, profile: string, name: string }[]) {
    let tempSelected:{ id: number, class: number, grade: number, number: number, profile: string, name: string }[] = [];
    member.forEach((value) => {
      if(limit && selected.length + tempSelected.length >= limit) {
        return dispatch(setNotification({ type: 'error', text: `최대 ${limit}명까지만 선택할 수 있어요` }));
      }
      if(value.id === user?.user?.id) {
        if(notMe) {
          return dispatch(setNotification({ type: 'info', text: '나를 제외한 그룹 구성원을 선택했어요' }));
        }
      }
      if(!selected.some((member) => member.id === value.id) && !(notMe === true && value.id === user?.user?.id)) {
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

    setSelected([...selected, ...tempSelected]);
  }
  function unselectMember(id:number) {
    setSelected([...selected.filter((member) => member.id !== id)]);
  }

  return (
    <div className="w-[700px] h-[520px]">
      { info === 0 && <OpacityAnimation>
        <div className="-m-5 flex">
          <div className="py-3">
            { !disableFavorite && <div className="flex items-center">
              { type === 0 && <div className="w-1 h-6 bg-blue-500 rounded-r-lg absolute"></div> }
              <div onClick={() => setType(0)} className="w-10 h-10 ml-1 cursor-pointer rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                <svg className={ type !== 0 ? "fill-lightgray-100 stroke-lightgray-100 w-7 h-7" : "fill-blue-500 stroke-blue-500 w-7 h-7" } fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
              </div>
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
          { type === 0 && <div className="w-full h-[540px] rounded-r-2xl p-3">
            <OpacityAnimation>
              <input value={preSearch} onChange={handleSearch} onKeyDown={onKeyPress} type="text" className="w-full h-10 bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl px-5 outline-none text-base" placeholder="초성으로 검색해보세요." />
              <div className="mt-2 overflow-auto h-[460px] custom-scroll pr-2 relative">
                { (favorite && favorite?.success === true) && <div>
                  { (favorite.favorites.length > 0 && searchedResult.items.length <= 0 && search !== '') && <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <OpacityAnimation>
                      <div className="flex items-center justify-center flex-col space-y-2">
                        <svg className="w-10 h-10 stroke-lightgray-200" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        <div className="w-[180px] h-12 flex items-center justify-center text-lightgray-200 text-center text-sm">검색 결과가 없어요<br/>검색어를 다시 한번 확인해주세요</div>
                      </div>
                    </OpacityAnimation>
                  </div> }
                  { favorite.favorites.length <= 0 && <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <OpacityAnimation>
                      <div className="flex items-center justify-center flex-col space-y-2">
                        <svg className="w-10 h-10 stroke-lightgray-200" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                        <div className="w-full h-12 flex items-center justify-center text-lightgray-200 text-center text-sm">즐겨찾기에 추가된<br/>구성원이 없어요</div>
                      </div>
                    </OpacityAnimation>
                  </div> }
                  { search === '' ? favorite.favorites.map((value:any, index:number) => {
                    return (
                      <OpacityAnimation key={value.id}>
                        <div onClick={() => selectMember([value.to])} className="w-full h-16 hover:bg-gray-50 transition-colors rounded-xl px-5 flex items-center justify-between space-x-2 cursor-pointer">
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-xl overflow-hidden">
                              <Image
                                src={value.to.profile}
                                width={40}
                                height={40}
                                alt="프로필"
                              />
                            </div>
                            <div className="-space-y-0">
                              <div className="text-base font-bold">{value.to.name}</div>
                              <div className="text-sm text-lightgray-200">{value.to.grade}학년 {value.to.class}반 {value.to.number}번</div>
                            </div>
                          </div>
                          <div className="cursor-pointer" onClick={() => deleteFavorite(value.to.id)}>
                            <svg className="w-5 h-5 fill-yellow-500 stroke-yellow-500" fill="none" strokeWidth={1.7} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                            </svg>
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
                              <Image
                                src={value.profile}
                                width={40}
                                height={40}
                                alt="프로필"
                              />
                            </div>
                            <div className="-space-y-0">
                              <div className="text-base font-bold">{value.name}</div>
                              <div className="text-sm text-lightgray-200">{value.grade}학년 {value.class}반 {value.number}번</div>
                            </div>
                          </div>
                          <div className="cursor-pointer" onClick={() => deleteFavorite(value.id)}>
                            <svg className="w-5 h-5 fill-yellow-500 stroke-yellow-500" fill="none" strokeWidth={1.7} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                            </svg>
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
            </OpacityAnimation>
          </div> }
          { type === 1 && <div className="w-full h-[540px] rounded-r-2xl p-3">
            <OpacityAnimation>
              <input value={preSearch} onChange={handleSearch} onKeyDown={onKeyPress} type="text" className="w-full h-10 bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl px-5 outline-none text-base" placeholder="초성으로 검색해보세요." />
              <div className="mt-2 overflow-auto h-[460px] custom-scroll pr-2 relative">
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
                              <Image
                                src={value.profile}
                                width={40}
                                height={40}
                                alt="프로필"
                              />
                            </div>
                            <div className="-space-y-0">
                              <div className="text-base font-bold">{value.name}</div>
                              <div className="text-sm text-lightgray-200">{value.grade}학년 {value.class}반 {value.number}번</div>
                            </div>
                          </div>
                          { value.id !== user.user.id && <div className="cursor-pointer" onClick={ favorite?.favorites.some((e:{ to: { id:number } }) => e.to.id === value.id) ? () => deleteFavorite(value.id) : () => postFavorite(value.id) }>
                            <svg className={ favorite?.favorites.some((e:{ to: { id:number } }) => e.to.id === value.id) ? "w-5 h-5 fill-yellow-500 stroke-yellow-500" : "w-5 h-5 stroke-lightgray-200" } fill="none" strokeWidth={1.7} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                            </svg>
                          </div> }
                        </div> }
                      </OpacityAnimation>
                    )
                  }) : searchedResult.items.map((value:any, index:number) => {
                    return (
                      <OpacityAnimation key={value.id}>
                        { !(notMe === true && value.id === user.user.id) && <div onClick={() => selectMember([value])} className="w-full h-16 hover:bg-gray-50 transition-colors rounded-xl px-5 flex items-center justify-between space-x-2 cursor-pointer">
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-xl overflow-hidden">
                              <Image
                                src={value.profile}
                                width={40}
                                height={40}
                                alt="프로필"
                              />
                            </div>
                            <div className="-space-y-0">
                              <div className="text-base font-bold">{value.name}</div>
                              <div className="text-sm text-lightgray-200">{value.grade}학년 {value.class}반 {value.number}번</div>
                            </div>
                          </div>
                          { value.id !== user.user.id && <div className="cursor-pointer" onClick={() => postFavorite(value.id)}>
                            <svg className={ favorite.favorites.some((e:{ to: { id:number } }) => e.to.id === value.id) ? "w-5 h-5 fill-yellow-500 stroke-yellow-500" : "w-5 h-5 stroke-lightgray-200" } fill="none" strokeWidth={1.7} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                            </svg>
                          </div> }
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
          { type === 2 && <div className="w-full h-[540px] rounded-r-2xl p-3">
            <OpacityAnimation>
              <input value={preSearch} onChange={handleSearch} onKeyDown={onKeyPress} type="text" className="w-full h-10 bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl px-5 outline-none text-base" placeholder="초성으로 검색해보세요." />
              <div className="mt-2 overflow-auto h-[460px] custom-scroll pr-2 relative">
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
          { type === 3 && <div className="w-full h-[540px] rounded-r-2xl p-3">
            <OpacityAnimation>
              <input value={preSearch} onChange={handleSearch} onKeyDown={onKeyPress} type="text" className="w-full h-10 bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl px-5 outline-none text-base" placeholder="초성으로 검색해보세요." />
              <div className="mt-2 overflow-auto h-[460px] custom-scroll pr-2 relative">
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
                              <Image
                                src={value.profile}
                                width={40}
                                height={40}
                                alt="프로필"
                              />
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
                              <Image
                                src={value.profile}
                                width={40}
                                height={40}
                                alt="프로필"
                              />
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
          <div className="w-full h-[540px] rounded-r-2xl bg-gray-50 flex items-center justify-between flex-col p-3">
            <div className="w-full pr-2 custom-scroll scroll-bg-gray-50 overflow-auto h-[460px]">
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
                          <Image
                            src={value.profile}
                            width={40}
                            height={40}
                            alt="프로필"
                          />
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
            </div>
            <div className="w-full h-12">
              <Button fn={() => fn(selected)} scalableHeight color="lightblue">
                {selected.length}명 선택 완료하기
              </Button>
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
              <div className="font-bold text-2xl">조직을 선택해<br/>구성원을 다중 선택하세요.</div>
              <div className="text-base text-lightgray-200 mt-2">조직을 선택하면 해당 조직에 속한<br/>구성원이 모두 선택됩니다.</div>
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
                <div className="w-[200px] h-10 bg-gray-200 rounded-xl flex items-center justify-center">정예준</div>
              </div>
              <div className="flex items-center justify-center space-x-5">
                <div className="w-8 h-8">
                  <svg className="stroke-yellow-500 fill-yellow-500" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                </div>
                <div className="w-[200px] h-10 bg-gray-200 rounded-xl flex items-center justify-center">최지환</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between h-full pb-0">
            <div className="mt-[300px]">
              <div className="font-bold text-2xl">즐겨찾기를 통해<br/>빠르게 선택하세요.</div>
              <div className="text-base text-lightgray-200 mt-2">내 R&E 팀원, 동아리 부원들을 즐겨찾기하면,<br/>빠르게 선택할 수 있습니다.</div>
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