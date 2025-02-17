'use client';

import displayDate from "@libs/client/time-display";
import Image from "next/image";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import Modal from "@components/modal";
import Button from "@components/button";
import { setNotification } from "@libs/client/redux/notification";
import { useAppDispatch } from "@libs/client/redux/hooks";
import ListMenu from "../todo-list-menu";
import hansearch from "hangul-search";
import { OpacityAnimation, StaggerChildrenAnimation, StaggerParentAnimation } from "@components/animation";
import TodoDetailModal from "./todo-detail";
import errorMessage from "@libs/client/error-message";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircularProgress } from "@mui/material";

// Todo List
export default function TodoSendList() {

  // Data Fetching
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<null | { value: string, order: string }>(null);
  const { data, error } = useSWR(`/api/user/todo/send?${ search ? `search=${search}` : '' }${ sort ? `&sort=${sort.value}&order=${sort.order}` : '' }`);
  function mutateTodo() {
    mutate(`/api/user/todo/send?${ search ? `search=${search}` : '' }${ sort ? `&sort=${sort.value}&order=${sort.order}` : '' }`);
  }
  useEffect(() => {
    if(error) {
      dispatch(setNotification({ type: 'error', text: errorMessage.unknown }));
    }
  }, [error]);

  // Todo Detail Modal
  const [todoDetail, setTodoDetail] = useState<any>({});
  const [todoDetailModal, setTodoDetailModal] = useState(false);
  
  const [todo, setTodo] = useState<any>({
    before: [],
    finished: []
  });
  useEffect(() => {
    if(data?.success === true) {
      setTodo({
        before: data.todo.before,
        finished: [...data.todo.finished]
      });
    }
  }, [data]);

  const controls = useAnimationControls();
  useEffect(() => {
    controls.start('visible')
  }, [todo, search]);

  const pathname = usePathname();

  return (
    <div className="w-full">
      <TodoDetailModal data={{
        detail: todoDetail,
        mutateTodo
      }} open={todoDetailModal} handleClose={() => setTodoDetailModal(false)} handleOpen={() => setTodoDetailModal(true)}/>
      <div className="flex justify-between relative">
        <div className="flex space-x-4 md:space-x-6 md:text-base text-sm">
          <Link href={'/d/home/todo'}>
            <div className={ pathname.includes('/d/home/todo/send') ? "border-b-0 border-zinc-800 pb-3 cursor-pointer text-lightgray-200" : "border-b-2 border-zinc-800 pb-3 cursor-pointer"}>
              <div className="font-bold">받은 할 일</div>
            </div>
          </Link>
          <Link href={'/d/home/todo/send'}>
            <div className={ pathname.includes('/d/home/todo/send') ? "border-b-2 border-zinc-800 pb-3 cursor-pointer" : "border-b-0 border-zinc-800 pb-3 cursor-pointer text-lightgray-200"}>
              <div className="font-bold">보낸 할 일</div>
            </div>
          </Link>
        </div>
        <ListMenu searchFn={setSearch} sortFn={setSort} data={{ sort }} />
      </div>
      <div className="w-full h-[1px] mb-5 bg-lightgray-100"></div>
      <div className="max-w-[1000px] w-full">
        <div className="flex items-center justify-between mb-1">
          <div className="font-bold text-xl md:text-2xl text-zinc-800">해야할 일</div>
        </div>
        <div className="mt-0 overflow-x-auto xl:overflow-visible">
          { (data && data?.success === true) && <div className="min-w-[700px]">
            { data.todo.before.length === 0 && search === '' && <div className="my-20">
              <OpacityAnimation>
                <div className="text-lightgray-200 w-full flex items-center justify-center flex-col">
                  <div className="w-10 h-10">
                    <svg fill="none" strokeWidth={1.7} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                    </svg>
                  </div>
                  <div className="mt-1 text-center">다른 구성원에게 보낸 할 일이 없어요<br/>나에게 추가하거나 다른 구성원에게 할 일을 보내보세요</div>
                </div>
              </OpacityAnimation>
            </div> }
            { data.todo.before.length === 0 && search !== '' && <div className="my-20">
              <OpacityAnimation>
                <div className="text-lightgray-200 w-full flex items-center justify-center flex-col">
                  <div className="w-10 h-10">
                    <svg fill="none" strokeWidth={1.7} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                  </div>
                  <div className="mt-1 text-center">검색 결과가 없어요<br/>검색어 및 필터를 확인해주세요</div>
                </div>
              </OpacityAnimation>
            </div> }
            <StaggerParentAnimation controls={controls}>
              { data.todo.before.map((todo:any) => {
                if(todo.status === 0) return ( 
                  <div key={todo.id}>
                    <StaggerChildrenAnimation>
                      <div key={todo.id} onClick={() => {
                        setTodoDetail(todo);
                        setTodoDetailModal(true);
                      }} className="w-full relative group flex items-center justify-between py-3 px-3 -mx-3 cursor-pointer rounded-xl hover:bg-gray-50 transition-all">
                        <div>
                          <div className="flex items-center space-x-5">
                            <div className="w-[50px] h-[50px] flex justify-center overflow-hidden items-center bg-white border-[1px] border-lightgray-100 rounded-[20px]">
                              { todo.senderProfile && <Image
                                src={todo.senderProfile}
                                width={50}
                                height={50}
                                alt="프로필"
                              /> }
                            </div>
                            <div className="text-zinc-800 font-bold text-base xl:block hidden">활동 완료 요청 - '{todo.title}'</div>
                            <div className="text-zinc-800 font-bold text-base xl:hidden block">'{todo.title}'</div>
                            <div className="text-zinc-800 text-base">{ todo.deadline ? displayDate(todo.deadline, 'date-left') === 0 ? '오늘 마감' : `${displayDate(todo.deadline, 'date-without-year')} 마감` : '마감 기한 없음' }</div>
                          </div>
                        </div>
                        <div className="flex space-x-5 items-center absolute right-3 transition-all">
                          <div className="text-lightgray-200 text-base">{todo.relationTodoStatusCount}/{todo.relationTodoCount}명 완료함</div>
                          <CircularProgress sx={() => ({
                            color: '#3b82f6',
                            borderColor: '#3b82f6'
                          })} size={30} thickness={5} variant="determinate" value={todo.relationTodoStatusCount/todo.relationTodoCount*100} />
                        </div>
                        {/* <div className="flex space-x-5 group-hover:opacity-100 absolute right-3 opacity-0 transition-all">
                          <div className="bg-emerald-500 hover:bg-emerald-600 text-sm transition-all font-bold text-white justify-center w-[150px] py-3 flex items-center cursor-pointer rounded-[10px]">
                            <svg className="w-5 h-5 mr-2" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                            완료로 표시하기
                          </div>
                        </div> */}
                      </div>
                    </StaggerChildrenAnimation>
                  </div>
                )
              }) }
            </StaggerParentAnimation>
          </div> }
          { !data && [...Array(3)].map((value, index) => {
            return ( 
              <div key={index} className="w-full relative flex items-center justify-between py-3 px-3 -mx-3 rounded-xl">
                <div>
                  <div className="flex items-center space-x-5">
                    <div className="w-[50px] h-[50px] flex justify-center overflow-hidden items-center bg-gray-100 animate-pulse rounded-[20px]"></div>
                    <div className="bg-gray-100 w-[200px] h-5 rounded-lg font-bold text-base"></div>
                    <div className="bg-gray-100 w-[80px] h-5 rounded-lg text-base"></div>
                  </div>
                </div>
                <div className="flex space-x-5 absolute right-3 transition-all">
                  <div className="bg-gray-100 w-[70px] h-5 rounded-lg text-base"></div>
                  <div className="bg-gray-100 w-[170px] h-5 rounded-lg text-base"></div>
                </div>
              </div>
            )
          }) }
        </div>
        <div className="flex items-center justify-between mb-1 mt-16">
          <div className="font-bold text-xl md:text-2xl text-zinc-800">완료한 일</div>
        </div>
        <div className="space-y-0 overflow-x-auto xl:overflow-visible">
          { (data && data.success === true) && <div className="min-w-[700px]">
            { data.todo.finished.length === 0 && search === '' && <div className="my-20">
              <OpacityAnimation>
                <div className="text-lightgray-200 w-full flex items-center justify-center flex-col">
                  <div className="w-10 h-10">
                    <svg fill="none" strokeWidth={1.7} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                    </svg>
                  </div>
                  <div className="mt-1 text-center">다른 구성원이 완료한 일이 없어요<br/>모든 구성원들이 해야할 일을 완료하면 이곳에 표시됩니다</div>
                </div>
              </OpacityAnimation>
            </div> }
            { data.todo.finished.length === 0 && search !== '' && <div className="my-20">
              <OpacityAnimation>
                <div className="text-lightgray-200 w-full flex items-center justify-center flex-col">
                  <div className="w-10 h-10">
                    <svg fill="none" strokeWidth={1.7} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                  </div>
                  <div className="mt-1 text-center">검색 결과가 없어요<br/>검색어 및 필터를 확인해주세요</div>
                </div>
              </OpacityAnimation>
            </div> }
            { <StaggerParentAnimation controls={controls}>
              { data.todo.finished.map((todo:any) => {
                if(todo.status === 1) return ( 
                  <div key={todo.id}>
                    <StaggerChildrenAnimation>
                      <div key={todo.id} onClick={() => {
                        setTodoDetail(todo);
                        setTodoDetailModal(true);
                      }} className="w-full relative flex items-center justify-between py-3 px-3 -mx-3 cursor-pointer rounded-xl hover:bg-gray-50 transition-all">
                        <div>
                          <div className="flex items-center space-x-5">
                            <div className="w-[50px] h-[50px] flex justify-center overflow-hidden items-center bg-white border-[1px] border-lightgray-100 rounded-[20px]">
                              <Image
                                src={todo.senderProfile}
                                width={50}
                                height={50}
                                alt="학교 로고"
                              />
                            </div>
                            <svg className="w-7 h-7 fill-emerald-500 !-mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <path clipRule="evenodd" fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" />
                            </svg>
                            <div className="text-lightgray-100 font-bold text-base xl:block hidden">활동 완료 요청 - '{todo.title}'</div>
                            <div className="text-lightgray-100 font-bold text-base xl:hidden block">'{todo.title}'</div>
                            <div className="text-lightgray-100 text-base">{ todo.deadline ? displayDate(todo.deadline, 'date-left') === 0 ? '오늘 마감' : `${displayDate(todo.deadline, 'date-without-year')} 마감` : '마감 기한 없음' }</div>
                          </div>
                        </div>
                        <div className="flex space-x-5 items-center group-hover:opacity-0 absolute right-3 transition-all">
                          <div className="text-lightgray-100 text-base">{todo.relationTodoStatusCount}/{todo.relationTodoCount}명 완료함</div>
                          <CircularProgress sx={() => ({
                            color: '#3b82f6',
                            opacity: 0.5
                          })} size={30} thickness={5} variant="determinate" value={todo.relationTodoStatusCount/todo.relationTodoCount*100} />
                        </div>
                      </div>
                    </StaggerChildrenAnimation>
                  </div>
                )
              }) }
            </StaggerParentAnimation> }
          </div> }
          { !data && [...Array(5)].map((value, index) => {
            return ( 
              <div key={index} className="w-full relative flex items-center justify-between py-3 px-3 -mx-3 rounded-xl">
                <div>
                  <div className="flex items-center space-x-5">
                    <div className="w-[50px] h-[50px] flex justify-center overflow-hidden items-center bg-gray-100 animate-pulse rounded-[20px]"></div>
                    <div className="bg-gray-100 w-[200px] h-5 rounded-lg font-bold text-base"></div>
                    <div className="bg-gray-100 w-[80px] h-5 rounded-lg text-base"></div>
                  </div>
                </div>
                <div className="flex space-x-5 absolute right-3 transition-all">
                  <div className="bg-gray-100 w-[70px] h-5 rounded-lg text-base"></div>
                  <div className="bg-gray-100 w-[170px] h-5 rounded-lg text-base"></div>
                </div>
              </div>
            )
          }) }
        </div>
      </div>
    </div>
  )
}