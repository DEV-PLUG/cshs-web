'use client';

import { CircularProgress } from "@mui/material";

export default function Button({ children, color, loading = false, disabled = false, fn, scalableHeight }:{ children:any, color:'blue' | 'lightblue', loading?:boolean, disabled?:boolean, fn?():void, scalableHeight?:boolean }) {

  // 별도 표시하지 않더라도 CTA 버튼을 의미합니다.
  // 되도록 sclableHeight를 사용하지 않는 것을 권장합니다.

  return (
    <>
      { color !== 'lightblue' ? <div className="bg-white rounded-xl">
        <div onClick={() => {
          if(!loading && fn) fn();
        }} className={ disabled ? `bg-${color}-500/50 text-md transition-all text-white justify-center w-full py-4 flex items-center rounded-xl relative` : loading ? `bg-${color}-500/50 text-md transition-all text-white justify-center w-full py-4 flex items-center rounded-xl relative` : `bg-${color}-500 hover:bg-${color}-600 text-md transition-all text-white justify-center w-full py-4 flex items-center cursor-pointer rounded-xl relative` }>
          <div>{children}</div>
          { loading && <div className='absolute right-5 top-1/2 -translate-y-1/2 w-[20px] h-[20px]'>
            <CircularProgress color="inherit" size={20} />
          </div> }
          <div className="bg-blue-500/50"></div>
          <div className="bg-orange-500/50"></div>
          <div className="bg-red-500/50"></div>
          <div className="bg-green-500/50"></div>
          {/* Tailwind Color 빌드 시 포함을 위해 안보이는 컴포넌트 포함. 삭제하지 말 것. */}
        </div>
      </div> : <div className={`rounded-xl ${scalableHeight && 'h-full'}`}>
        <div onClick={() => {
          if(!loading && fn) fn();
        }} className={ disabled ? `bg-blue-500/10 text-md transition-all text-blue-500/50 justify-center w-full ${scalableHeight ? 'h-full' : 'py-4'} flex items-center rounded-xl relative` : loading ? `bg-blue-500/10 text-md transition-all text-blue-500 justify-center w-full ${scalableHeight ? 'h-full' : 'py-4'} flex items-center rounded-xl relative` : `bg-blue-500/20 hover:bg-blue-600/20 text-md transition-all text-blue-500 justify-center w-full ${scalableHeight ? 'h-full' : 'py-4'} flex items-center cursor-pointer rounded-xl relative` }>
          <div>{children}</div>
          { loading && <div className='absolute right-5 top-1/2 -translate-y-1/2 w-[20px] h-[20px]'>
            <CircularProgress color="inherit" size={20} />
          </div> }
        </div>
      </div> }
    </>
  );
};

export function SubButton({ children, color, loading = false, disabled = false, fn }:{ children:any, color:'blue' | 'red' | 'orange' | 'green' | 'white' | 'lightblue' | 'lightgreen', loading?:boolean, disabled?:boolean, fn?():void }) {
  // Sub CTA 보조 버튼 입니다.

  return (
    <div onClick={() => {
      if(!loading && fn) fn();
    }} className={ color === 'white' ? "border border-lightgray-100 hover:bg-gray-50 text-sm transition-all font-semibold text-lightgray-200 justify-center w-[150px] py-3 flex items-center cursor-pointer rounded-[10px]" : color === 'lightblue' ? `bg-blue-500/20 hover:bg-blue-600/20 text-sm transition-all font-semibold justify-center min-w-[140px] py-3 flex items-center cursor-pointer rounded-[10px] text-blue-500` : color === 'lightgreen' ? `bg-green-500/20 hover:bg-green-600/20 text-sm transition-all font-semibold justify-center min-w-[140px] py-3 flex items-center cursor-pointer rounded-[10px] text-green-500` : `bg-${color}-500 hover:bg-${color}-600 text-sm transition-all font-semibold text-white justify-center min-w-[140px] py-3 flex items-center cursor-pointer rounded-[10px]` }>
      {children}
    </div>
  )
}

export function CircleButton({ children, color, loading = false, disabled = false, fn }:{ children:any, color:'blue' | 'red' | 'orange' | 'green' | 'white' | 'lightblue', loading?:boolean, disabled?:boolean, fn?():void }) {
  // Round Sub CTA 보조 버튼 입니다.

  return (
    <div onClick={() => {
      if(!loading && fn) fn();
    }} className={ color === 'white' ? "border bg-white border-lightgray-100 hover:bg-gray-50 text-sm transition-all font-bold text-lightgray-200 justify-center py-3 flex items-center cursor-pointer rounded-full" : color === 'lightblue' ? `bg-blue-500/20 hover:bg-blue-600/20 text-sm transition-all font-bold justify-center py-3 flex items-center cursor-pointer rounded-full text-blue-500` : `bg-${color}-500 hover:bg-${color}-600 text-sm transition-all font-bold text-white justify-center py-3 flex items-center cursor-pointer rounded-full` }>
      {children}
    </div>
  )
}