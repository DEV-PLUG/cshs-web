'use client';

import displayDate from "@libs/client/time-display";

export default function Announcement(get_announcementData) {
  const announcementData = JSON.parse(get_announcementData.announcementData);
  return (
    <div className="px-2">
      <div className="flex space-x-2 items-center">
        <div className="w-[35px] h-[35px] relative flex justify-center items-center bg-gray-100 border-[1px] border-lightgray-100 rounded-xl">
          <svg className="w-7 h-7 fill-gray-300 stroke-gray-300" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"></path>
          </svg>
        </div>
        <div className="text-base font-bold">{announcementData.user.name}</div>
        <div className="text-sm text-lightgray-300">·</div>
        <div className="text-sm text-lightgray-300">{displayDate(announcementData.createdAt, "datetime")}</div>
      </div>
      <div className="flex pl-4">
        <div className="w-[1px] mt-2 bg-lightgray-100"></div>
        <div className="ml-4 py-2">
          <div className="font-bold text-lg my-1">{announcementData.title}</div>
          <div className="whitespace-pre-wrap">{announcementData.content}</div>
        </div>
      </div>
    </div>
  )
}