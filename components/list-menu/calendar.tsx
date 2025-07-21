'use client';

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Modal from "@components/modal";
import UpModal from "@components/up-modal";
import { DateInput } from "@components/input";
import displayDate from "@libs/client/time-display";
import formatedDate from "@libs/client/formated-date";

export default function CalendarButton({ calendarFn, date, align = 'right', style = 'light' }:{ calendarFn?(date:string):void, date:null|string, align?: 'right' | 'center', style?: 'light' | 'long' }) {
  const [sortModal, setSortModal] = useState(false);

  let dateObj;
  if(date) {
    if(date.length === 8) {
      const y = Number(date.slice(0, 4));
      const m = Number(date.slice(4, 6)) - 1; // JS months are 0-based
      const d = Number(date.slice(6, 8));
      dateObj = new Date(y, m, d);
    } else {
      const y = Number(date.slice(0, 4));
      const m = Number(date.slice(4, 5)) - 1; // JS months are 0-based
      const d = Number(date.slice(5, 7));
      dateObj = new Date(y, m, d);
    }
  } else {
    dateObj = new Date();
  }

  return (
    <div className="relative">
      <AnimatePresence initial={false} mode="wait">
        { sortModal && <UpModal handleClose={() => setSortModal(false)}>
            <div className={ align === 'right' ? "w-[330px] h-auto top-12 overflow-hidden right-0 rounded-xl bg-white border-lightgray-100 drop-shadow-2xl absolute" : "w-[330px] h-auto top-12 overflow-hidden left-1/2 -translate-x-1/2 rounded-xl bg-white border-lightgray-100 drop-shadow-2xl absolute" }>
            <DateInput
              value={dateObj}
              fn={(date: Date) =>
              calendarFn &&
              calendarFn(
                formatedDate(new Date(date)
                .toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" }).replaceAll('. ', '/').replaceAll('.', ''))
              )
              }
            />
            </div>
        </UpModal> }
      </AnimatePresence>
      { style === 'light' && <div onClick={() => setSortModal(true)} className={ (date && !(date && date === formatedDate(new Date().toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" }).replaceAll('. ', '/').replaceAll('.', '')))) ? "px-2 py-2 hover:bg-blue-200 bg-blue-100 text-blue-500 transition-all rounded-md cursor-pointer flex items-center space-x-2" : "px-2 py-2 hover:bg-gray-100 text-lightgray-200 transition-all rounded-md cursor-pointer flex items-center space-x-2" }>
        <svg className="w-5 h-5" fill="none" strokeWidth={2.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
        <div className="text-sm font-semibold">{displayDate(dateObj, 'date-without-year')}{ !(date && !(date && date === formatedDate(new Date().toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" }).replaceAll('. ', '/').replaceAll('.', '')))) && '(오늘)' }</div>
      </div> }
      { style === 'long' && <div onClick={() => setSortModal(true)} className={ (date && !(date && date === formatedDate(new Date().toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" }).replaceAll('. ', '/').replaceAll('.', '')))) ? "hover:bg-blue-200 bg-blue-100 text-blue-500 transition-all cursor-pointer border border-blue-200 rounded-2xl xl:w-[350px] w-full md:w-[320px] py-3 flex items-center justify-center space-x-2" : "hover:bg-gray-100 text-lightgray-200 transition-all cursor-pointer border border-lightgray-100 rounded-2xl xl:w-[350px] w-full md:w-[320px] py-3 flex items-center justify-center space-x-2" }>
        <svg className="w-5 h-5" fill="none" strokeWidth={2.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
        <div className="text-sm font-semibold">{displayDate(dateObj, 'date-without-year')}{ !(date && !(date && date === formatedDate(new Date().toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" }).replaceAll('. ', '/').replaceAll('.', '')))) && '(오늘)' }</div>
      </div> }
    </div>
  )
}