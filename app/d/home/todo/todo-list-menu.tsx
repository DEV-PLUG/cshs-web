'use client';

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Modal from "@components/modal";
import SearchButton from "@components/list-menu/search";
import SortButton from "@components/list-menu/sort";
import { useRouter, usePathname } from "next/navigation";

export default function ListMenu({ searchFn, sortFn, data }:{ searchFn?(text:string):void, sortFn?(data:any):void, data:any }) {
  const [downloadModal, setDownloadModal] = useState(false);
  
  const sortList = [
    { name: '생성일', value: 'createdAt' },
    { name: '마감일', value: 'deadline' },
    { name: '변경일', value: 'updatedAt' }
  ];
  
  return (
    <div className="flex space-x-1 -mt-3 items-center relative">
      <SearchButton searchFn={searchFn} />
      <SortButton sortFn={sortFn} sort={data.sort} sortList={sortList} />
      {/* <div onClick={() => setFilterModal(true)} className="px-2 py-2 hover:bg-gray-100 flex items-center cursor-pointer text-lightgray-200 space-x-2 text-sm font-bold transition-all rounded-md">
        <svg className="w-5 h-5 stroke-lightgray-200" fill="none" strokeWidth={2.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
        </svg>
        <div>필터</div>
      </div> */}
      {/* <div className="py-4 px-1 w-[1px] h-full">
        <div className="w-[1px] h-full bg-lightgray-100"></div>
      </div> */}
      {/* <AnimatePresence initial={false} mode="wait">
        { filterModal && <Modal handleClose={() => setFilterModal(false)} backdropType="transparent" modalType="up">
          <div className="w-[282px] h-auto top-40 p-2 right-24 rounded-xl bg-white border-lightgray-100 drop-shadow-2xl absolute">
            <div className="px-4 py-2 text-sm text-lightgray-200">필터</div>
            { sortList.map((value:{name:string,value:string}) => {
              return (
                <div onClick={() => {
                  if(value.value === sort?.value) {
                    if(sort?.order !== 'desc') setSort({
                      value: value.value,
                      order: sort?.order === 'asc' ? 'desc' : 'asc'
                    });
                    else setSort(null);
                  } else {
                    setSort({
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
                    <select className="w-24 bg-transparent rounded-md outline-none border-2 hover:border-gray-300 focus:border-blue-500 border-lightgray-100" name="pets" id="pet-select">
                      <option value="">적용 안함</option>
                      <option value="cat">크거나 같음</option>
                      <option value="hamster">큼</option>
                      <option value="parrot">작거나 같음</option>
                      <option value="spider">작음</option>
                    </select>
                    <input className="w-12 rounded-md hover:border-gray-300 focus:border-blue-500 transition-all px-1 outline-none border-2 border-lightgray-100" onChange={(e) => {
                      if(!isNaN(+e.target.value)) {
                        console.log(e.target.value)
                      }
                    }} />
                  </div>
                </div>
              )
            }) }
          </div>
        </Modal> }
      </AnimatePresence> */}
      <AnimatePresence initial={false} mode="wait">
        { downloadModal && <Modal handleClose={() => setDownloadModal(false)} backdropType="transparent">
          <div className="w-[272px] h-auto top-40 p-2 right-10 rounded-xl bg-white border-lightgray-100 drop-shadow-2xl absolute">
            <div className="px-4 py-2 text-sm text-lightgray-200">데이터 내보내기</div>
            <div className="px-3 py-2 flex items-center space-x-2 transition-all cursor-pointer rounded-lg hover:bg-gray-100 text-lightgray-300">
              <svg className="w-5 h-5" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              <div className="text-base">PDF 파일로 다운로드</div>
            </div>
            <div className="px-3 py-2 flex items-center space-x-2 transition-all cursor-pointer rounded-lg hover:bg-gray-100 text-lightgray-300">
              <svg className="w-5 h-5" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              <div className="text-base">CSV 파일로 다운로드</div>
            </div>
            <div className="px-3 py-2 flex items-center space-x-2 transition-all cursor-pointer rounded-lg hover:bg-gray-100 text-lightgray-300">
              <svg className="w-5 h-5" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              <div className="text-base">JSON 파일로 다운로드</div>
            </div>
            <div className="px-3 py-2 flex items-center space-x-2 transition-all cursor-pointer rounded-lg hover:bg-gray-100 text-lightgray-300">
              <svg className="w-5 h-5" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              <div className="text-base">API로 데이터 요청</div>
            </div>
          </div>
        </Modal> }
      </AnimatePresence>
      {/* <div onClick={() => setDownloadModal(true)} className="px-2 py-2 hover:bg-gray-100 transition-all rounded-md cursor-pointer">
        <svg className="w-5 h-5 stroke-lightgray-200"fill="none" strokeWidth={2.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
        </svg>
      </div> */}
    </div>
  )
}