'use client';

import Image from "next/image";
import useSWR, { mutate } from "swr";
import { OpacityAnimation } from "@components/animation";
import { useEffect, useState } from "react";
import hansearch from "hangul-search";

export default function SelectPlace({ fn, handleClose }:{ fn:({id,place}:{id:number,place:string})=>void, handleClose:()=>void }) {
  const { data, error } = useSWR('/api/school/place');

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
    if(data?.place) setSearchedResult(hansearch(data.place, search));
  }, [search, data]);

  return (  
    <div className="w-full md:w-[380px] h-[520px] mb-5">
      <div className="flex justify-end">
        <div onClick={handleClose} className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer">
          <svg className="w-6 h-6 p-1 rounded-full stroke-gray-400" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col justify-between h-full pb-8 mt-2 mb-5">
        { !data && <div className="space-y-1">
          { [...Array(20)].map((value, index) => {
            return ( 
              <div key={index} className="w-full h-16 rounded-xl px-5 flex items-center space-x-2 animate-pulse">
                <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
                <div className="space-y-1">
                  <div className="w-20 h-6 bg-gray-100 rounded-lg"></div>
                  <div className="w-40 h-3 bg-gray-100 rounded-md"></div>
                </div>
              </div>
            )
          }) }
        </div> }
        <div className="pb-2">
          { (data && data.success === true) && <input value={preSearch} onChange={handleSearch} onKeyDown={onKeyPress} type="text" className="w-full h-10 bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl px-5 outline-none text-base mb-3" autoFocus placeholder="초성 또는 코드로 검색해보세요." /> }
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
          { (data && data.success === true) && searchedResult.items.map((place:{id:number,place:string,code:string}) => {
            return (
              <OpacityAnimation key={place.id}>
                { <div onClick={() => fn(place)} className="w-full h-16 hover:bg-gray-50 transition-colors rounded-xl px-5 flex items-center justify-between space-x-2 cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                      <svg className="w-7 h-7 stroke-lightgray-200" fill="none" strokeWidth={1.7} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                      </svg>
                    </div>
                    <div className="-space-y-0">
                      <div className="text-base font-bold">{place.place}</div>
                      <div className="text-sm text-lightgray-200">{place.code}</div>
                    </div>
                  </div>
                </div> }
              </OpacityAnimation>
            )
          }) }
        </div>
      </div>
    </div>
  )
}