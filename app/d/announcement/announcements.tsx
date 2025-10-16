'use client'

import Announcement from "./announcement";
import { useState } from "react";
import useSWR from 'swr';

export default function Announcements() {
  const {data, mutate, isLoading} = useSWR('/api/announcement');

  return (
    <div className="w-full max-h-[calc(100vh-180px)] px-2 bg-white grid space-y-5 divide-y overflow-y-auto custm-scroll">
      <div></div>
      {data?.success === true && data?.data.map(announcement => (
        <Announcement announcementData={JSON.stringify(announcement)} />
      ))}
      <div></div>
    </div>
  )
}