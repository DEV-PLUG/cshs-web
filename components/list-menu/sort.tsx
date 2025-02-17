'use client';

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Modal from "@components/modal";
import UpModal from "@components/up-modal";

export default function SortButton({ sortFn, sortList, sort }:{ sortFn?(sort:null|{value:string,order:string}):void, sortList:{name:string,value:string}[], sort:null|{value:string,order:string} }) {
  const [sortModal, setSortModal] = useState(false);

  return (
    <div className="relative">
      <AnimatePresence initial={false} mode="wait">
        { sortModal && <UpModal handleClose={() => setSortModal(false)}>
          <div className="w-[272px] h-auto top-12 p-2 right-0 rounded-xl bg-white border-lightgray-100 drop-shadow-2xl absolute">
            <div className="px-4 py-2 text-sm text-lightgray-200">정렬</div>
            { sortList.map((value:{name:string,value:string}) => {
              return (
                <div key={value.value} onClick={() => {
                  if(value.value === sort?.value) {
                    if(sort?.order !== 'desc') sortFn && sortFn({
                      value: value.value,
                      order: sort?.order === 'asc' ? 'desc' : 'asc'
                    });
                    else sortFn && sortFn(null);
                  } else {
                    sortFn && sortFn({
                      value: value.value,
                      order: 'asc'
                    });
                  }
                }} className={ value.value === sort?.value ? "px-3 py-2 flex items-center transition-all cursor-pointer rounded-lg bg-blue-100 text-blue-500 justify-between" : "px-3 py-2 flex items-center transition-all cursor-pointer rounded-lg hover:bg-gray-100 text-lightgray-300 justify-between" }>
                  <div className="flex items-center space-x-2">
                    <svg className="w-6 h-6" fill="none" strokeWidth={1.7} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                    <div className="text-base">{value.name}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    { sort?.value === value.value && sort?.order === 'asc' && <svg className="w-5 h-5" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                    </svg> }
                    { sort?.value === value.value && sort?.order === 'desc' && <svg className="w-5 h-5" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                    </svg> }
                  </div>
                </div>
              )
            }) }
          </div>
        </UpModal> }
      </AnimatePresence>
      <div onClick={() => setSortModal(true)} className={ sort ? "px-2 py-2 hover:bg-blue-200 bg-blue-100 text-blue-500 transition-all rounded-md cursor-pointer" : "px-2 py-2 hover:bg-gray-100 text-lightgray-200 transition-all rounded-md cursor-pointer" }>
        <svg className="w-5 h-5" fill="none" strokeWidth={2.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
        </svg>
      </div>
    </div>
  )
}