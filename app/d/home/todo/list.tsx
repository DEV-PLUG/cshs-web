'use client';

import displayDate from "@libs/client/time-display";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import Modal from "@components/modal";
import Button from "@components/button";
import { setNotification } from "@libs/client/redux/notification";
import { useAppDispatch } from "@libs/client/redux/hooks";
import ListMenu from "./todo-list-menu";
import hansearch from "hangul-search";
import { OpacityAnimation, StaggerChildrenAnimation, StaggerParentAnimation } from "@components/animation";
import TodoDetailModal from "./todo-detail";
import errorMessage from "@libs/client/error-message";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function TodoListContainer() {
  return (
    <Suspense>
      <TodoList/>
    </Suspense>
  )
}

// Todo List
function TodoList() {
  // Data Fetching
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<null | { value: string, order: string }>(null);
  const { data, error } = useSWR(`/api/user/todo?${ search ? `search=${search}` : '' }${ sort ? `&sort=${sort.value}&order=${sort.order}` : '' }`);
  function mutateTodo() {
    mutate(`/api/user/todo?${ search ? `search=${search}` : '' }${ sort ? `&sort=${sort.value}&order=${sort.order}` : '' }`);
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
  const searchParams = useSearchParams();
  useEffect(() => {
    const id = searchParams.get('id');
    if(id && data?.success === true) {
      if(data.todo.before.find((todo:any) => todo.id === parseInt(id)) === undefined) return;
      setTodoDetail(data.todo.before.find((todo:any) => todo.id === parseInt(id)));
      setTodoDetailModal(true);
    }
  }, [searchParams, data]);

  return (
    <div className="w-full">
      <TodoDetailModal data={{
        detail: todoDetail,
        mutateTodo
      }} open={todoDetailModal} handleClose={() => setTodoDetailModal(false)}/>
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
          { (data && data?.success === true) && <div className="md:min-w-[700px]">
            { data.todo.before.length === 0 && search === '' && <div className="my-20">
              <OpacityAnimation>
                <div className="text-lightgray-200 w-full flex items-center justify-center flex-col">
                  <div className="w-10 h-10">
                    <svg fill="none" strokeWidth={1.7} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                    </svg>
                  </div>
                  <div className="mt-1 text-center">해야할 일이 없어요<br/>나에게 추가하거나 다른 구성원에게 할 일을 보내보세요</div>
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
                      }} className="w-full relative group flex items-center justify-between py-2 md:py-3 md:px-3 md:-mx-3 cursor-pointer rounded-xl hover:bg-gray-50 transition-all">
                        <div>
                          <div className="flex items-center space-x-3 md:space-x-5">
                            { todo.type === 0 && <div className="w-[50px] h-[50px] hidden md:flex justify-center overflow-hidden items-center bg-white border-[1px] border-lightgray-100 rounded-[20px]">
                              { todo.sender.profile && <Image
                                src={todo.sender.profile}
                                width={50}
                                height={50}
                                alt="프로필"
                              /> }
                            </div> }
                            { todo.type === 1 && <div className="md:w-[50px] md:h-[50px] w-[43px] h-[43px] bg-gray-100 border-[1px] border-lightgray-100 rounded-[20px] flex items-center justify-center">
                              <svg className="md:w-7 md:h-7 w-6 h-6 stroke-lightgray-200" fill="none" strokeWidth={1.7} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                              </svg>
                            </div> }
                            { todo.type === 0 && <div className="w-[43px] h-[43px] md:hidden flex justify-center overflow-hidden items-center bg-white border-[1px] border-lightgray-100 rounded-[15px]">
                              { todo.sender.profile && <Image
                                src={todo.sender.profile}
                                width={43}
                                height={43}
                                alt=""
                              /> }
                            </div> }
                            <div className="text-zinc-800 font-bold text-base xl:block hidden">활동 완료 요청 - '{todo.title}'</div>
                            <div className="md:flex items-center">
                              <div className="text-zinc-800 font-bold text-base xl:hidden block break-all max-w-[60vw]">{todo.title}</div>
                              <div className="md:text-zinc-800 md:text-base text-lightgray-200 text-sm">{ todo.deadline ? displayDate(todo.deadline, 'date-left') === 0 ? '오늘 마감' : `${displayDate(todo.deadline, 'date-without-year')} 마감` : '마감 기한 없음' }</div>
                            </div>
                          </div>
                        </div>
                        <div className="md:flex hidden space-x-5 absolute right-3 transition-all">
                          <div className="text-lightgray-200 text-base">{todo.sender.name}</div>
                          <div className="text-lightgray-200 text-base">{displayDate(todo.createdAt, 'datetime')}</div>
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
              <div key={index} className="w-full relative flex items-center justify-between py-2 px-3 md:py-3 md:px-3 md:-mx-3 rounded-xl">
                <div>
                  <div className="items-center space-x-5 md:flex hidden">
                    <div className="w-[50px] h-[50px] flex justify-center overflow-hidden items-center bg-gray-100 animate-pulse rounded-[20px]"></div>
                    <div className="bg-gray-100 w-[200px] h-5 rounded-lg font-bold text-base"></div>
                    <div className="bg-gray-100 w-[80px] h-5 rounded-lg text-base"></div>
                  </div>
                  <div className="items-center space-x-3 md:hidden flex">
                    <div className="w-[43px] h-[43px] flex justify-center overflow-hidden items-center bg-gray-100 animate-pulse rounded-[15px]"></div>
                    <div className="bg-gray-100 w-[50vw] h-5 rounded-lg font-bold text-base"></div>
                  </div>
                </div>
                <div className="space-x-5 absolute right-3 transition-all md:flex hidden">
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
          { (data && data.success === true) && <div className="md:min-w-[700px]">
            { data.todo.finished.length === 0 && search === '' && <div className="my-20">
              <OpacityAnimation>
                <div className="text-lightgray-200 w-full flex items-center justify-center flex-col">
                  <div className="w-10 h-10">
                    <svg fill="none" strokeWidth={1.7} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                    </svg>
                  </div>
                  <div className="mt-1 text-center">완료한 일이 없어요<br/>해야할 일을 완료하고 완료로 표시하세요</div>
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
                      }} className="w-full relative group flex items-center justify-between py-2 md:py-3 md:px-3 md:-mx-3 cursor-pointer rounded-xl hover:bg-gray-50 transition-all">
                        <div>
                          <div className="flex items-center space-x-3 md:space-x-5">
                          { todo.type === 0 && <div className="w-[50px] h-[50px] hidden md:flex justify-center overflow-hidden items-center bg-white border-[1px] border-lightgray-100 rounded-[20px]">
                              { todo.sender.profile && <Image
                                src={todo.sender.profile}
                                width={50}
                                height={50}
                                alt="프로필"
                              /> }
                            </div> }
                            { todo.type === 1 && <div className="md:w-[50px] md:h-[50px] w-[43px] h-[43px] bg-gray-100 border-[1px] border-lightgray-100 rounded-[20px] flex items-center justify-center">
                              <svg className="md:w-7 md:h-7 w-6 h-6 stroke-lightgray-200" fill="none" strokeWidth={1.7} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                              </svg>
                            </div> }
                            { todo.type === 0 && <div className="w-[43px] h-[43px] md:hidden flex justify-center overflow-hidden items-center bg-white border-[1px] border-lightgray-100 rounded-[15px]">
                              { todo.sender.profile && <Image
                                src={todo.sender.profile}
                                width={43}
                                height={43}
                                alt=""
                              /> }
                            </div> }
                            <svg className="md:w-7 md:h-7 w-6 h-6 fill-emerald-500 md:!-mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <path clipRule="evenodd" fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" />
                            </svg>
                            <div className="text-lightgray-100 font-bold text-base xl:block hidden">활동 완료 요청 - '{todo.title}'</div>
                            <div className="md:flex items-center">
                              <div className="text-lightgray-100 font-bold text-base xl:hidden block break-all max-w-[60vw]">{todo.title}</div>
                              <div className="md:text-lightgray-100 md:text-base text-lightgray-100 text-sm">{ todo.deadline ? displayDate(todo.deadline, 'date-left') === 0 ? '오늘 마감' : `${displayDate(todo.deadline, 'date-without-year')} 마감` : '마감 기한 없음' }</div>
                            </div>
                          </div>
                        </div>
                        <div className="hidden md:flex space-x-5 absolute right-3 transition-all">
                          <div className="text-lightgray-100 text-base">{todo.sender.name}</div>
                          <div className="text-lightgray-100 text-base">{displayDate(todo.createdAt, 'datetime')}</div>
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
              <div key={index} className="w-full relative flex items-center justify-between py-2 px-3 md:py-3 md:px-3 md:-mx-3 rounded-xl">
                <div>
                  <div className="items-center space-x-5 md:flex hidden">
                    <div className="w-[50px] h-[50px] flex justify-center overflow-hidden items-center bg-gray-100 animate-pulse rounded-[20px]"></div>
                    <div className="bg-gray-100 w-[200px] h-5 rounded-lg font-bold text-base"></div>
                    <div className="bg-gray-100 w-[80px] h-5 rounded-lg text-base"></div>
                  </div>
                  <div className="items-center space-x-3 md:hidden flex">
                    <div className="w-[43px] h-[43px] flex justify-center overflow-hidden items-center bg-gray-100 animate-pulse rounded-[15px]"></div>
                    <div className="bg-gray-100 w-[50vw] h-5 rounded-lg font-bold text-base"></div>
                  </div>
                </div>
                <div className="space-x-5 absolute right-3 transition-all md:flex hidden">
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