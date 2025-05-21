'use client';

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Modal from "@components/modal";
import UpModal from "@components/up-modal";
import { DateInput } from "@components/input";

export default function CalendarButton({ calendarFn, date }:{ calendarFn?(date:string):void, date:null|string }) {
  const [sortModal, setSortModal] = useState(false);

  return (
    <div className="relative">
      <AnimatePresence initial={false} mode="wait">
        { sortModal && <UpModal handleClose={() => setSortModal(false)}>
            <div className="w-[330px] h-auto top-12 overflow-hidden  right-0 rounded-xl bg-white border-lightgray-100 drop-shadow-2xl absolute">
            <DateInput
              value={
              date
                ? (() => {
                  // date is in 'yyyyMMdd' format, e.g., '2025520'
                  if(date.length === 8) {
                    const y = Number(date.slice(0, 4));
                    const m = Number(date.slice(4, 6)) - 1; // JS months are 0-based
                    const d = Number(date.slice(6, 8));
                    return new Date(y, m, d);
                  } else {
                    const y = Number(date.slice(0, 4));
                    const m = Number(date.slice(4, 5)) - 1; // JS months are 0-based
                    const d = Number(date.slice(5, 7));
                    return new Date(y, m, d);
                  }
                })()
                : new Date()
              }
              fn={(date: Date) =>
              calendarFn &&
              calendarFn(
                new Date(date)
                .toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" })
                .replaceAll(".", "")
                .replaceAll(" ", "")
              )
              }
            />
            </div>
        </UpModal> }
      </AnimatePresence>
      <div onClick={() => setSortModal(true)} className={ (date && !(date && new Date(date).getFullYear() === new Date().getFullYear() && new Date(date).getMonth() === new Date().getMonth() && new Date(date).getDate() === new Date().getDate())) ? "px-2 py-2 hover:bg-blue-200 bg-blue-100 text-blue-500 transition-all rounded-md cursor-pointer" : "px-2 py-2 hover:bg-gray-100 text-lightgray-200 transition-all rounded-md cursor-pointer" }>
        <svg className="w-5 h-5" fill="none" strokeWidth={2.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
      </div>
    </div>
  )
}