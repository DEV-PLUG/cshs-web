'use client';
import Menu from "@components/menu";
import Modal from "@/components/modal";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DemeritOverview() {
  const [modal, setModal] = useState(false);
  const [lock, setLock]  = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setModal(true);
    }, 100);

    let temp_pw = '';
    document.addEventListener('keydown', (event) => {
      if(temp_pw.length >= 6) {
        return;
      }
      if(event.key === '1') {
        setPassword(temp_pw + '1');
        temp_pw = temp_pw + '1';
      }
      if(event.key === '2') {
        setPassword(temp_pw + '2');
        temp_pw = temp_pw + '2';
      }
      if(event.key === '3') {
        setPassword(temp_pw + '3');
        temp_pw = temp_pw + '3';
      }
      if(event.key === '4') {
        setPassword(temp_pw + '4');
        temp_pw = temp_pw + '4';
      }
      if(event.key === '5') {
        setPassword(temp_pw + '5');
        temp_pw = temp_pw + '5';
      }
      if(event.key === '6') {
        setPassword(temp_pw + '6');
        temp_pw = temp_pw + '6';
      }
      if(event.key === '7') {
        setPassword(temp_pw + '7');
        temp_pw = temp_pw + '7';
      }
      if(event.key === '8') {
        setPassword(temp_pw + '8');
        temp_pw = temp_pw + '8';
      }
      if(event.key === '9') {
        setPassword(temp_pw + '9');
        temp_pw = temp_pw + '9';
      }
      if(event.key === '0') {
        setPassword(temp_pw + '0');
        temp_pw = temp_pw + '0';
      }
      if(event.key === 'Backspace') {
        setPassword(temp_pw.slice(0, -1));
        temp_pw = temp_pw.slice(0, -1);
      }
      if(temp_pw.length >= 6) {
        setTimeout(() => {
          setModal(false);
          setLock(false);
        }, 200);
      }
    });
  }, []);

  const [password, setPassword] = useState('');
  // 비밀번호 모달 모듈화

  return (
    <div className="w-full">
      <AnimatePresence initial={false} mode="wait">
        { modal && <Modal handleClose={() => setModal(false)}>
          <div className="w-full md:w-[380px] h-[520px]">
            <div className="flex justify-end">
              <div onClick={() => setModal(false)} className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer">
                <svg className="w-6 h-6 p-1 rounded-full stroke-gray-400" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div className="mx-auto w-8 h-8 my-2">
              <svg className="w-7 h-7 stroke-lightgray-200" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <div className="text-center text-lightgray-200">개인정보 보호를 위해</div>
            <div className="text-center text-lightgray-200 text-xl font-bold">간편비밀번호를 입력해주세요</div>
            <div className="flex justify-around mx-auto w-[70%] my-7">
              { password.length >= 1 ? <div className="w-5 h-5 bg-blue-500 rounded-full"></div> : <div className="w-5 h-5 bg-lightgray-100 rounded-full"></div> }
              { password.length >= 2 ? <div className="w-5 h-5 bg-blue-500 rounded-full"></div> : <div className="w-5 h-5 bg-lightgray-100 rounded-full"></div> }
              { password.length >= 3 ? <div className="w-5 h-5 bg-blue-500 rounded-full"></div> : <div className="w-5 h-5 bg-lightgray-100 rounded-full"></div> }
              { password.length >= 4 ? <div className="w-5 h-5 bg-blue-500 rounded-full"></div> : <div className="w-5 h-5 bg-lightgray-100 rounded-full"></div> }
              { password.length >= 5 ? <div className="w-5 h-5 bg-blue-500 rounded-full"></div> : <div className="w-5 h-5 bg-lightgray-100 rounded-full"></div> }
              { password.length >= 6 ? <div className="w-5 h-5 bg-blue-500 rounded-full"></div> : <div className="w-5 h-5 bg-lightgray-100 rounded-full"></div> }
            </div>
            <div className="flex justify-center">
              <div className="px-2 py-1 bg-gray-100 cursor-pointer hover:bg-gray-200 transition-all rounded-lg text-sm text-lightgray-200">비밀번호를 잊으셨나요?</div>
            </div>
            <div className="flex flex-col mt-8 w-[75%] space-y-5 mx-auto">
              <div className="flex justify-between text-center">
                <div className="py-2 w-[80px] hover:bg-gray-100 rounded-xl transition-all cursor-pointer font-bold text-xl">1</div>
                <div className="py-2 w-[80px] hover:bg-gray-100 rounded-xl transition-all cursor-pointer font-bold text-xl">2</div>
                <div className="py-2 w-[80px] hover:bg-gray-100 rounded-xl transition-all cursor-pointer font-bold text-xl">3</div>
              </div>
              <div className="flex justify-between text-center">
                <div className="py-2 w-[80px] hover:bg-gray-100 rounded-xl transition-all cursor-pointer font-bold text-xl">4</div>
                <div className="py-2 w-[80px] hover:bg-gray-100 rounded-xl transition-all cursor-pointer font-bold text-xl">5</div>
                <div className="py-2 w-[80px] hover:bg-gray-100 rounded-xl transition-all cursor-pointer font-bold text-xl">6</div>
              </div>
              <div className="flex justify-between text-center">
                <div className="py-2 w-[80px] hover:bg-gray-100 rounded-xl transition-all cursor-pointer font-bold text-xl">7</div>
                <div className="py-2 w-[80px] hover:bg-gray-100 rounded-xl transition-all cursor-pointer font-bold text-xl">8</div>
                <div className="py-2 w-[80px] hover:bg-gray-100 rounded-xl transition-all cursor-pointer font-bold text-xl">9</div>
              </div>
              <div className="flex justify-between text-center">
                <div className="py-2 w-[80px]"></div>
                <div className="py-2 w-[80px] hover:bg-gray-100 rounded-xl transition-all cursor-pointer font-bold text-xl">0</div>
                <div className="py-2 w-[80px] flex items-center justify-center hover:bg-gray-100 rounded-xl transition-all cursor-pointer font-bold text-xl">
                  <svg className="w-5 h-5" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </Modal> }
      </AnimatePresence>
      { lock === true ? <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="mx-auto w-8 h-8 my-2">
          <svg className="w-7 h-7 stroke-lightgray-200" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        </div>
        <div className="text-center text-lightgray-200">간편비밀번호 입력 후</div>
        <div className="text-center text-lightgray-200">이 정보를 열람할 수 있습니다</div>
        <div className="flex justify-center mt-2">
          <div onClick={() => setModal(true)} className="px-3 py-2 bg-gray-100 cursor-pointer hover:bg-gray-200 transition-all rounded-lg text-sm text-lightgray-200">비밀번호 입력하기</div>
        </div>
      </div> : <div className="w-full">
        <div className="w-full flex justify-between border text-lg border-lightgray-100 px-7 py-5 rounded-2xl h-[200px]">
          <div className="flex justify-between w-[400px] items-center">
            <div className="flex flex-col justify-center h-full text-zinc-800">
              <div className="font-bold"><span className="tossface">📋</span> 모든 벌점</div>
              <div className="flex mt-3 space-x-3 items-center">
                <div className="font-bold text-3xl">16점</div>
                <div className="flex text-base space-x-1 text-red-500">
                  <svg className="w-6 h-6 stroke-red-500" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                  </svg>
                  <div>16점</div>
                </div>
              </div>
              <div className="font-bold text-sm mt-2 text-lightgray-200">모든 카테고리의 벌점을 합한 값입니다.</div>
            </div>
            <div className="h-[80%] w-[1px] bg-lightgray-100"></div>
          </div>
          <div className="flex justify-between w-[400px] items-center">
            <div className="flex flex-col justify-center h-full text-zinc-800">
              <div className="font-bold"><span className="tossface">🏠</span> 기숙사 벌점</div>
              <div className="flex mt-3 space-x-3 items-center">
                <div className="font-bold text-3xl">8점</div>
                <div className="flex text-base space-x-1 text-red-500">
                  <svg className="w-6 h-6 stroke-red-500" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                  </svg>
                  <div>1점</div>
                </div>
              </div>
              <div className="font-bold text-sm mt-2 text-lightgray-200">기숙사 카테고리의 벌점을 합한 값입니다.</div>
            </div>
            <div className="h-[80%] w-[1px] bg-lightgray-100"></div>
          </div>
          <div className="flex justify-between w-[400px] items-center">
            <div className="flex flex-col justify-center h-full text-zinc-800">
              <div className="font-bold"><span className="tossface">📚</span> 학습실 벌점</div>
              <div className="flex mt-3 space-x-3 items-center">
                <div className="font-bold text-3xl">8점</div>
                <div className="flex text-base space-x-1 text-red-500">
                  <svg className="w-6 h-6 stroke-red-500" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                  </svg>
                  <div>1점</div>
                </div>
              </div>
              <div className="font-bold text-sm mt-2 text-lightgray-200">학습실 카테고리의 벌점을 합한 값입니다.</div>
            </div>
          </div>
        </div>
        <div className="space-y-3 mt-14">
          <div className="flex items-center justify-between mb-1">
            <div onClick={() => setModal(true)} className="font-bold text-2xl text-zinc-800">이번주 벌점 내역 <span className="text-blue-500">2</span></div>
            <Link href='/demerit/list'>
              <div className="flex items-center space-x-0 hover:bg-blue-50 px-1 py-1 pl-2 transition-all cursor-pointer rounded-lg">
                <div className="text-sm text-blue-500 py-0 px-0 font-bold">모두 보기</div>
                <svg className="w-6 h-6 fill-blue-500 -mx-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path clipRule="evenodd" fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" />
                </svg>
              </div>
            </Link>
          </div>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-sm text-lightgray-200 bg-gray-50/50 border-t border-b border-lightgray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 !font-medium">
                    카테고리
                  </th>
                  <th scope="col" className="px-6 py-3 !font-medium">
                    유형
                  </th>
                  <th scope="col" className="px-6 py-3 !font-medium">
                    내용
                  </th>
                  <th scope="col" className="px-6 py-3 !font-medium">
                    벌점
                  </th>
                  <th scope="col" className="px-6 py-3 !font-medium">
                    일시
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white hover:bg-gray-50 transition-all cursor-pointer border-b text-zinc-800">
                  <td className="px-6 py-4">
                    기숙사
                  </td>
                  <td className="px-6 py-4">
                    벌점 추가
                  </td>
                  <td className="px-6 py-4">
                    소등
                  </td>
                  <td className="px-6 py-4">
                    +0.5점
                  </td>
                  <td className="px-6 py-4">
                    2024-03-06 (금) 오후 02:14
                  </td>
                </tr>
                <tr className="bg-white hover:bg-gray-50 transition-all cursor-pointer border-b text-zinc-800">
                  <td className="px-6 py-4">
                    기숙사
                  </td>
                  <td className="px-6 py-4">
                    벌점 삭제
                  </td>
                  <td className="px-6 py-4">
                    봉사
                  </td>
                  <td className="px-6 py-4">
                    -0.5점
                  </td>
                  <td className="px-6 py-4">
                    2024-03-06 (금) 오후 02:14
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div> }
    </div>
  );
}
