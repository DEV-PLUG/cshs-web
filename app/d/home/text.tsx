'use client';

import { OpacityAnimation } from '@components/animation';
import { kadvice } from 'kadvice';
import { useEffect, useState } from 'react';

export default function MainText() {
  const [dailyAdvice, setDailyAdvice] = useState<{author:string, authorProfile:string, message:string, tag:number} | null>(null);

  useEffect(() => {
    setDailyAdvice(kadvice.getOne());
  }, []);

  return (
    <div>
      { dailyAdvice && <OpacityAnimation>
        <div className="space-y-2">
          <div className="font-bold text-sm text-lightgray-200">오늘의 명언</div>
          <div className="font-bold text-3xl text-zinc-800">{dailyAdvice.message}</div>
          <div className="font-bold text-sm text-lightgray-200">{dailyAdvice.author} - {dailyAdvice.authorProfile}</div>
        </div>
      </OpacityAnimation> }
      { !dailyAdvice && <div className="space-y-2">
        <div className="bg-gray-100 w-[80px] h-5 rounded-lg text-base"></div>
        <div className="bg-gray-100 w-[500px] h-9 rounded-xl text-base"></div>
        <div className="bg-gray-100 w-[350px] h-5 rounded-lg text-base"></div>
      </div> }
    </div>
  )
}