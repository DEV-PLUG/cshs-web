import { CircularProgress } from "@mui/material";

export default function Switch({ size = 'md', active }:{ size?:'md' | 'sm', active:boolean }) {
  return <>
    <div className={ active === true ? "w-8 h-5 rounded-full bg-blue-500 p-[2px] relative" : "w-8 h-5 rounded-full bg-lightgray-100 p-[2px] relative" }>
      <div className={ active === true ? "w-4 h-4 rounded-full bg-white absolute right-[2px] transition-all" : "w-4 h-4 rounded-full bg-white absolute right-[14px] transition-all" }></div>
    </div>
  </>
}