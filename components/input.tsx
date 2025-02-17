'use client';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { FieldChangeHandlerContext } from '@mui/x-date-pickers/internals';

export default function Input({ type = 'text', value, disabled = false, fn, autoFocus = false, placeholder }:{ type?:'text' | 'number', value?:string | number, disabled?:boolean, fn?(value:string | number):void, autoFocus?:boolean, placeholder?:string }) {
  return (
    <input autoFocus={autoFocus} value={value} disabled={disabled} placeholder={placeholder} className="w-full max-w-[400px] h-[55px] rounded-2xl hover:border-gray-300 focus:border-blue-500 transition-all px-4 outline-none border-2 border-lightgray-100" onChange={(e) => {
      if(type === 'number' && !isNaN(+e.target.value)) {
        fn && fn(+e.target.value);
      } else fn && fn(e.target.value);
    }} />
  );
};

export function InputButton({ value, disabled = false, fn }:{ value?:string | number, disabled?:boolean, fn?():void }) {
  return (
    <div onClick={() => fn && fn()} className="w-full max-w-[400px] h-[55px] cursor-pointer rounded-2xl hover:border-gray-300 focus:border-blue-500 transition-all px-4 outline-none border-2 border-lightgray-100 flex items-center">
      <div>{value}</div>
    </div>
  );
};

export function Textarea({ type = 'text', value, disabled = false, fn, placeholder }:{ type?:'text' | 'number', value?:string | number, disabled?:boolean, fn?(value:string | number):void, placeholder?:string }) {
  return (
    <textarea placeholder={placeholder} value={value} disabled={disabled} className="w-full resize-none max-w-[400px] h-[105px] rounded-2xl hover:border-gray-300 focus:border-blue-500 transition-all py-3 p-4 outline-none border-2 border-lightgray-100" onChange={(e) => {
      if(type === 'number' && !isNaN(+e.target.value)) {
        fn && fn(+e.target.value);
      } else fn && fn(e.target.value);
    }} />
  );
};

export function DateInput({ value, disabled = false, fn }:{ value?:Date, disabled?:boolean, fn?(value:Date):void }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
      <StaticDatePicker  slots={{
        actionBar: undefined,
        toolbar: undefined
      }} slotProps={{
        actionBar: {
          actions: [],
        },
        day: {
          sx: {
            "&.MuiPickersDay-root.Mui-selected": {
              backgroundColor: "#3b82f6",
            }
          }
        },
        yearButton: {
          sx: {
            "&.MuiPickersYear-root.Mui-selected": {
              backgroundColor: "#3b82f6",
            },
            "&.MuiPickersYear-yearButton.Mui-selected": {
              backgroundColor: "#3b82f6",
            }
          }
        }
      }} onChange={(value:any) => fn && fn(new Date(value))} defaultValue={dayjs(value)}  />
    </LocalizationProvider>
  );
}