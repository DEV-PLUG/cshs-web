'use client';

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

export default function SearchButton({ searchFn }:{ searchFn?(text:string):void }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<any>();

  const [preSearch, setPreSearch] = useState("");
  const onKeyPress = (e: { key: string; }) => {
    if(e.key == 'ESCAPE') {
      setSearchOpen(false);
    }
    if(e.key == 'Enter') {
      if(preSearch === "") {
        setSearchOpen(false);
      }
    }
  }
  const handleSearch = (e: { target: { value: string; }; }) => {
    const {value} = {...e.target};
    setPreSearch(value);
    searchFn && searchFn(value);
  }

  return (
    <div className="md:relative absolute md:right-auto right-9">
      <div className={ searchOpen === true ? '' : 'absolute right-0' }>
        <AnimatePresence initial={false} mode="wait">
          { searchOpen === true && <div>
            <motion.div
              className=''
              variants={{
                hidden: {
                  width: 0,
                  opacity: 0,
                },
                visible: {
                  width: 200,
                  opacity: 1,
                  transition: {
                    duration: 0.2,
                    ease: [0, 0.71, 0.2, 1.01]
                  }
                },
                exit: {
                  width: 0,
                  opacity: 0
                }
              }}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className='bg-gray-100 flex items-center rounded-lg px-3'>
                <svg className="w-5 h-5 stroke-lightgray-200" fill="none" strokeWidth={2.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <input onBlur={() => {
                  if(preSearch === "") {
                    setSearchOpen(false);
                  }
                }} onKeyDown={onKeyPress} onChange={handleSearch} ref={searchRef} type="text" className="px-2 py-2 bg-gray-100 w-full outline-none text-sm" />
              </div>
            </motion.div>
          </div> }
        </AnimatePresence>
      </div>
      { searchOpen === false && <div>
        <div onClick={() => {
          setSearchOpen(true);
          setTimeout(() => {
            searchRef.current.focus();
          }, 100);
        }} className="p-2 hover:bg-gray-100 transition-all rounded-md cursor-pointer">
          <svg className="w-5 h-5 stroke-lightgray-200" fill="none" strokeWidth={2.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>  
      </div> }
    </div>
  )
}