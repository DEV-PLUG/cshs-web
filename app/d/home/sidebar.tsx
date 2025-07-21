'use client';

import Menu from "@components/menu";
import CalendarButton from "@components/list-menu/calendar";
import Modal from "@/components/modal";
import { AnimatePresence, useAnimationControls } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { OpacityAnimation, StaggerChildrenAnimation, StaggerParentAnimation } from "@components/animation";
import { useAppDispatch } from "@libs/client/redux/hooks";
import useSWR from "swr";
import { setNotification } from "@libs/client/redux/notification";
import displayDate from "@libs/client/time-display";
import PasscardModal from "@components/info/passcard";
import formatedDate from "@libs/client/formated-date";

export default function SideBar() {
  const now = new Date().toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" }).replaceAll('. ', '/').replaceAll('.', ''); // Safari 호환을 위해 '.'를 '-'로 변경
  const formatDate = formatedDate(now)
  const [ date, setDate ] = useState<null | string>(formatDate);
  
  useEffect(() => {
    console.log(now, new Date(now));
  }, [])

  const { data:user, error:userError } = useSWR('/api/user');
  const { data:timetable } = useSWR(`/api/school/time-table?date=${date}`);
  const [timetableData, setTimetableData] = useState<any | null>(null);
  useEffect(() => {
    if (timetable) {
      setTimetableData(timetable);
    }
  }, [timetable]);

  const [passcardModal, setPasscardModal] = useState(false);

  const getMealData = async (date:string | null) => {
    const school = user.user.affiliationSchool;
    
    const mealResponse = await fetch(`https://open.neis.go.kr/hub/mealServiceDietInfo?Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=${school.ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${school.SD_SCHUL_CODE}&MLSV_YMD=${date}`);

    if (!mealResponse.ok) {
      return {
        success: false,
        message: '식단 정보를 가져오는 데 실패했습니다'
      };
    }
    
    const mealData = await mealResponse.json();

    if(mealData.RESULT?.MESSAGE === '해당하는 데이터가 없습니다.') {
      return {
        success: false,
        message: '식단 정보를 찾을 수 없어요'
      };
    }

    if (mealData.mealServiceDietInfo) {
      const mealRows = mealData.mealServiceDietInfo[1].row;
      let breakfast = null;
      let lunch = null;
      let dinner = null;

      for (const mealInfo of mealRows) {
        if (mealInfo.MMEAL_SC_NM === '조식') {
          breakfast = mealInfo.DDISH_NM.replace(/\s*\(.*?\)\s*/g, '').replaceAll('<br/>', '\n');
        } else if (mealInfo.MMEAL_SC_NM === '중식') {
          lunch = mealInfo.DDISH_NM.replace(/\s*\(.*?\)\s*/g, '').replaceAll('<br/>', '\n');
        } else if (mealInfo.MMEAL_SC_NM === '석식') {
          dinner = mealInfo.DDISH_NM.replace(/\s*\(.*?\)\s*/g, '').replaceAll('<br/>', '\n');
        }
      }

      const mealCreate = {
          affiliationSchoolId: school.id,
          date: mealRows[0].MLSV_YMD,
          breakfast: breakfast,
          lunch: lunch,
          dinner: dinner
        };

      return {
        success: true,
        meal: mealCreate
      };
    } else {
      return {
        success: false,
        message: '식단 정보를 찾을 수 없어요'
      };
    }
  }

  const [ meal, setMeal ] = useState<any>(null);

  useEffect(() => {
    if (!user || userError || !date) return;

    const fetchMeal = async () => {
      const mealResult = await getMealData(date);
      setMeal(mealResult);
    };

    fetchMeal();
  }, [date, user]);

  return (
    <>
      { (meal && timetableData) && <div className="space-y-5">
        <OpacityAnimation>
          <div onClick={() => setPasscardModal(true)} className="bg-gray-50 md:flex hidden cursor-pointer hover:bg-gray-100/70 transition-colors rounded-2xl xl:w-[350px] w-full md:w-[320px] h-[120px] px-7 py-5 items-center space-x-5">
            <div className="text-4xl tossface">🪪</div>
            <div>
              <div className="font-bold text-lightgray-300">7, 8교시에는 빠른 인원 점검!<br/>패스카드를 이용해보세요</div>
              <div className="text-sm text-lightgray-200 mt-1">각 학생의 패스카드를 확인하면<br/>승인 여부를 빠르게 확인할 수 있습니다</div>
            </div>
          </div>
        </OpacityAnimation>
        <OpacityAnimation>
          {/* <div className="border border-lightgray-100 rounded-2xl xl:w-[350px] w-full md:w-[320px] py-1 flex items-center justify-center"></div> */}
          <CalendarButton align="center" style="long" calendarFn={setDate} date={date}/>
        </OpacityAnimation>
        { (timetableData && timetableData.success === true) && <OpacityAnimation>
          <div className="border border-lightgray-100 rounded-2xl xl:w-[350px] w-full md:w-[320px] px-5 py-5">
            <div className="font-bold text-zinc-800">시간표</div>
            <div className="w-full h-[1px] bg-lightgray-100 my-4"></div>
            <div className="space-y-1">
              { timetableData?.timetable.map((item:any, index:number) => {
                return (
                  <div key={index} className="text-lightgray-200 flex items-center"><div className="text-sm px-1 bg-blue-500/10 w-[50px] text-center rounded-full text-blue-500">{item.perio}교시</div><div className="text-base text-lightgray-200 font-bold break-keep ml-3">{item.subject}</div></div>
                )
              }) }
            </div>
            <div className="text-xs text-lightgray-200 mt-5">일부 수업 교체는 표시되지 않을 수 있습니다.</div>
          </div>
        </OpacityAnimation> }
        { (timetableData?.message === '시간표 정보를 찾을 수 없어요') && <OpacityAnimation>
          <div className="border border-lightgray-100 rounded-2xl xl:w-[350px] w-full md:w-[320px] px-5 py-5">
            <div className="font-bold text-zinc-800">시간표</div>
            <div className="w-full h-[1px] bg-lightgray-100 my-4"></div>
            <div className="text-lightgray-200 my-10 w-full flex items-center justify-center flex-col">
              <div className="w-10 h-10">
                <svg fill="none" strokeWidth={1.7} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              </div>
              <div className="mt-2 text-center text-sm">오늘 시간표가 없어요<br/>등교일에 당일 시간표를 볼 수 있어요</div>
            </div>
          </div>
        </OpacityAnimation> }
        { (meal && meal.success === true) && <OpacityAnimation>
          <div className="border border-lightgray-100 rounded-2xl xl:w-[350px] w-full md:w-[320px] px-5 py-5">
            <div className="font-bold text-zinc-800">오늘의 급식</div>
            <div className="w-full h-[1px] bg-lightgray-100 my-4"></div>
            { meal.meal.breakfast && <div className="text-lightgray-200 mt-2 whitespace-pre-wrap">
              <span className="font-bold text-lightgray-300">조식<br/></span>
              {meal.meal.breakfast}
            </div> }
            { meal.meal.lunch && <div>
              <div className="w-full h-[1px] bg-lightgray-100 my-4"></div>
              <div className="text-lightgray-200 mt-2 whitespace-pre-wrap">
                <span className="font-bold text-lightgray-300">중식<br/></span>
                {meal.meal.lunch}
              </div>
            </div> }
            { meal.meal.dinner && <div>
              <div className="w-full h-[1px] bg-lightgray-100 my-4"></div>
              <div className="text-lightgray-200 mt-2 whitespace-pre-wrap">
                <span className="font-bold text-lightgray-300">석식<br/></span>
                {meal.meal.dinner}
              </div>
            </div> }
            { (!meal.meal.breakfast && !meal.meal.lunch && !meal.meal.dinenr) && <div className="text-lightgray-200 my-10 w-full flex items-center justify-center flex-col">
              <div className="w-10 h-10">
                <svg fill="none" strokeWidth={1.7} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              </div>
              <div className="mt-2 text-center text-sm">오늘 급식이 없어요<br/>급식이 있는 날에 메뉴를 볼 수 있어요</div>
            </div> }
          </div>
        </OpacityAnimation> }
        { (meal?.message === '식단 정보를 찾을 수 없어요') && <OpacityAnimation>
          <div className="border border-lightgray-100 rounded-2xl xl:w-[350px] w-full md:w-[320px] px-5 py-5">
            <div className="font-bold text-zinc-800">오늘의 급식</div>
            <div className="w-full h-[1px] bg-lightgray-100 my-4"></div>
            <div className="text-lightgray-200 my-10 w-full flex items-center justify-center flex-col">
              <div className="w-10 h-10">
                <svg fill="none" strokeWidth={1.7} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              </div>
              <div className="mt-2 text-center text-sm">오늘 급식이 없어요<br/>급식이 있는 날에 메뉴를 볼 수 있어요</div>
            </div>
          </div>
        </OpacityAnimation> }
      </div> }
      { (!timetableData) && <div className="border border-lightgray-100 rounded-2xl xl:w-[350px] w-full md:w-[320px] px-5 py-5 h-[250px] my-5 md:hidden block">
        <div className="font-bold text-zinc-800">시간표</div>
        <div className="w-full h-[1px] bg-lightgray-100 my-4"></div>
        <div className="space-y-2">
          <div className="bg-gray-100 w-[50vw] h-5 rounded-lg text-base"></div>
          <div className="bg-gray-100 w-[40vw] h-5 rounded-lg text-base"></div>
          <div className="bg-gray-100 w-[30vw] h-5 rounded-lg text-base"></div>
          <div className="bg-gray-100 w-[45vw] h-5 rounded-lg text-base"></div>
        </div>
      </div> }
      { (!meal) && <div className="border border-lightgray-100 rounded-2xl xl:w-[350px] w-full md:w-[320px] px-5 py-5 h-[250px] md:hidden block">
        <div className="font-bold text-zinc-800">오늘의 급식</div>
        <div className="w-full h-[1px] bg-lightgray-100 my-4"></div>
        <div className="space-y-2">
          <div className="bg-gray-100 w-[50vw] h-5 rounded-lg text-base"></div>
          <div className="bg-gray-100 w-[40vw] h-5 rounded-lg text-base"></div>
          <div className="bg-gray-100 w-[30vw] h-5 rounded-lg text-base"></div>
          <div className="bg-gray-100 w-[45vw] h-5 rounded-lg text-base"></div>
        </div>
      </div> }
      { (!timetableData) && <div className="rounded-2xl xl:w-[350px] w-full md:w-[320px] px-5 py-5 h-[250px] my-5 md:block hidden"></div> }
      { (!meal) && <div className="rounded-2xl xl:w-[350px] w-full md:w-[320px] px-5 py-5 h-[250px] md:block hidden"></div> }
      <AnimatePresence initial={false} mode="wait">
        { passcardModal && <Modal handleClose={() => setPasscardModal(false)}>
          <PasscardModal fn={() => {
            setPasscardModal(false);

            // const expires = new Date();
            // expires.setDate(expires.getDate() + 30);
            // document.cookie = `classroom-info-modal=true; expires=${expires.toUTCString()}; path=/`;

            document.cookie = `passcard-info-modal=true; path=/`;
          }} />
        </Modal> }
      </AnimatePresence>
    </>
  )
}