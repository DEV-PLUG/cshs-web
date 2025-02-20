'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useSWR from 'swr';
import { OpacityAnimation } from "@components/animation";

export default function Seat() {

  const [grade, setGrade] = useState(1);
  const [time, setTime] = useState('1');

  const { data:user } = useSWR('/api/user');
  useEffect(() => {
    if(user?.success === true) {
      if(user.user.grade) setGrade(user.user.grade);
    }
  }, [user]);

  const { data } = useSWR(`/api/activity/seat?grade=${grade}`);

  const seatData = [
    [
      1121, 1115, 1116,    1103, 1122, 1122,
      1122, 1122, 1122,    1122, 1115, 1103,

      1122, 1122, 1122,    1122, 1122, 1122,
      1122, 1122, 1122,    1122, 1122, 1122,

      1122, 1122, 1122,    1122, 1122, 1122,
      1122, 1122, 1122,    1122, 1122, 1122,

      1122, 1122, 1122,    1122, 1122, 1122,
      1122, 1122, 1122,    1122, 1122, 1121,
    ],
    [
    ],
    [
    ]
  ];

  return (
    <>
      <div className="flex space-x-4 md:space-x-6 md:text-base text-sm">
        <div onClick={() => setGrade(1)} className={ grade === 1 ? "border-b-2 border-zinc-800 pb-3 cursor-pointer" : "border-b-0 border-zinc-800 pb-3 cursor-pointer" }>
          <div className={ grade === 1 ? "font-bold" : "font-bold text-lightgray-200" }>1학년</div>
        </div>
        <div onClick={() => setGrade(2)} className={ grade === 2 ? "border-b-2 border-zinc-800 pb-3 cursor-pointer" : "border-b-0 border-zinc-800 pb-3 cursor-pointer" }>
          <div className={ grade === 2 ? "font-bold" : "font-bold text-lightgray-200" }>2학년</div>
        </div>
        <div onClick={() => setGrade(3)} className={ grade === 3 ? "border-b-2 border-zinc-800 pb-3 cursor-pointer" : "border-b-0 border-zinc-800 pb-3 cursor-pointer" }>
          <div className={ grade === 3 ? "font-bold" : "font-bold text-lightgray-200" }>3학년</div>
        </div>
      </div>
      <div className="w-full h-[1px] mb-5 bg-lightgray-100"></div>
      <div className="flex">
        <div className="flex rounded-full px-1 py-1 bg-gray-100 md:w-auto w-full">
          <div onClick={() => setTime('1')} className={ time === '1' ? "rounded-full w-full py-1 md:w-[100px] md:py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer" : "rounded-full w-full py-1 md:w-[100px] md:py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-colors" }>7교시</div>
          <div onClick={() => setTime('2')} className={ time === '2' ? "rounded-full w-full py-1 md:w-[100px] md:py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer" : "rounded-full w-full py-1 md:w-[100px] md:py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-colors" }>8교시</div>
          <div onClick={() => setTime('3')} className={ time === '3' ? "rounded-full w-full py-1 md:w-[100px] md:py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer" : "rounded-full w-full py-1 md:w-[100px] md:py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-colors" }>야자 1교시</div>
          <div onClick={() => setTime('4')} className={ time === '4' ? "rounded-full w-full py-1 md:w-[100px] md:py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer" : "rounded-full w-full py-1 md:w-[100px] md:py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-colors" }>야자 2교시</div>
          <div onClick={() => setTime('5')} className={ time === '5' ? "rounded-full w-full py-1 md:w-[100px] md:py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer" : "rounded-full w-full py-1 md:w-[100px] md:py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-colors" }>야자 3교시</div>
        </div>
      </div>
      <div className="mt-8 flex justify-between space-x-5 overflow-x-auto">
        { !(data?.success === true && user?.success === true) ? <div className="w-full">
          <div className="flex space-x-5">
            <div className="space-y-5">
              { [...Array(7)].map((value, index) => {
                return (
                  <div className="space-y-1 !text-base font-bold" key={index}>
                    <div className="flex space-x-1">
                      <div className="bg-gray-100 animate-pulse rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center">
                      </div>
                      <div className="bg-gray-100 animate-pulse rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center">
                      </div>
                      <div className="bg-gray-100 animate-pulse rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center">
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <div className="bg-gray-100 animate-pulse rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center">
                      </div>
                      <div className="bg-gray-100 animate-pulse rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center">
                      </div>
                      <div className="bg-gray-100 animate-pulse rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center">
                      </div>
                    </div>
                  </div>
                )
              }) }
            </div>
            <div className="space-y-5">
              { [...Array(7)].map((value, index) => {
                return (
                  <div className="space-y-1 !text-base font-bold" key={index}>
                    <div className="flex space-x-1">
                      <div className="bg-gray-100 animate-pulse rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center">
                      </div>
                      <div className="bg-gray-100 animate-pulse rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center">
                      </div>
                      <div className="bg-gray-100 animate-pulse rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center">
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <div className="bg-gray-100 animate-pulse rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center">
                      </div>
                      <div className="bg-gray-100 animate-pulse rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center">
                      </div>
                      <div className="bg-gray-100 animate-pulse rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center">
                      </div>
                    </div>
                  </div>
                )
              }) }
            </div>
          </div>
        </div> : <OpacityAnimation><div className="w-full">
          <div className="flex space-x-5">
            <div className="space-y-5">
              { [...Array(seatData[grade - 1].length / 12)].map((value, idx) => {
                const index = idx * 12;
                return (
                  <div className="space-y-1 !text-base font-bold" key={index}>
                    <div className="flex items-center space-x-5">
                      <div className="flex space-x-1">
                        <div className={ (data?.activity.find((activity: { user: { grade: number; class: number; number: number; }, activity: { perio: string } }) => 
                            activity.user.grade === Math.floor(seatData[grade - 1][index] / 1000) &&
                            activity.user.class === Math.floor((seatData[grade - 1][index] % 1000) / 100) &&
                            activity.user.number === seatData[grade - 1][index] % 100 && activity.activity.perio.split(',').indexOf(time) !== -1) || data?.activityWriter.find((activity: { writer: { grade: number; class: number; number: number; }, perio: string }) => 
                              activity.writer.grade === Math.floor(seatData[grade - 1][index] / 1000) &&
                              activity.writer.class === Math.floor((seatData[grade - 1][index] % 1000) / 100) &&
                              activity.writer.number === seatData[grade - 1][index] % 100 && activity.perio.split(',').indexOf(time) !== -1)) ? "bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer text-white rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center" : "bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer text-lightgray-200 rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center" }>
                          <div className={ (data?.activity.find((activity: { user: { grade: number; class: number; number: number; }, activity: { perio: string } }) => 
                            activity.user.grade === Math.floor(seatData[grade - 1][index] / 1000) &&
                            activity.user.class === Math.floor((seatData[grade - 1][index] % 1000) / 100) &&
                            activity.user.number === seatData[grade - 1][index] % 100 && activity.activity.perio.split(',').indexOf(time) !== -1) || data?.activityWriter.find((activity: { writer: { grade: number; class: number; number: number; }, perio: string }) => 
                              activity.writer.grade === Math.floor(seatData[grade - 1][index] / 1000) &&
                              activity.writer.class === Math.floor((seatData[grade - 1][index] % 1000) / 100) &&
                              activity.writer.number === seatData[grade - 1][index] % 100 && activity.perio.split(',').indexOf(time) !== -1)) ? "font-medium text-blue-100 text-sm" : "font-medium text-lightgray-200 text-sm" }>{seatData[grade - 1][index]}</div>
                          <div>
                            {data?.seat.find((seat: { grade: number; class: number; number: number; }) => seat.grade === Math.floor(seatData[grade - 1][index] / 1000) &&
                            seat.class === Math.floor((seatData[grade - 1][index] % 1000) / 100) &&
                            seat.number === seatData[grade - 1][index] % 100)?.name || "Unknown"}
                          </div>
                        </div>
                        <div className={ (data?.activity.find((activity: { user: { grade: number; class: number; number: number; }, activity: { perio: string } }) => 
                            activity.user.grade === Math.floor(seatData[grade - 1][index+1] / 1000) &&
                            activity.user.class === Math.floor((seatData[grade - 1][index+1] % 1000) / 100) &&
                            activity.user.number === seatData[grade - 1][index+1] % 100 && activity.activity.perio.split(',').indexOf(time) !== -1) || data?.activityWriter.find((activity: { writer: { grade: number; class: number; number: number; }, perio: string }) => 
                              activity.writer.grade === Math.floor(seatData[grade - 1][index+1] / 1000) &&
                              activity.writer.class === Math.floor((seatData[grade - 1][index+1] % 1000) / 100) &&
                              activity.writer.number === seatData[grade - 1][index+1] % 100 && activity.perio.split(',').indexOf(time) !== -1)) ? "bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer text-white rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center" : "bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer text-lightgray-200 rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center" }>
                          <div className={ (data?.activity.find((activity: { user: { grade: number; class: number; number: number; }, activity: { perio: string } }) => 
                            activity.user.grade === Math.floor(seatData[grade - 1][index+1] / 1000) &&
                            activity.user.class === Math.floor((seatData[grade - 1][index+1] % 1000) / 100) &&
                            activity.user.number === seatData[grade - 1][index+1] % 100 && activity.activity.perio.split(',').indexOf(time) !== -1) || data?.activityWriter.find((activity: { writer: { grade: number; class: number; number: number; }, perio: string }) => 
                              activity.writer.grade === Math.floor(seatData[grade - 1][index+1] / 1000) &&
                              activity.writer.class === Math.floor((seatData[grade - 1][index+1] % 1000) / 100) &&
                              activity.writer.number === seatData[grade - 1][index+1] % 100 && activity.perio.split(',').indexOf(time) !== -1)) ? "font-medium text-blue-100 text-sm" : "font-medium text-lightgray-200 text-sm" }>{seatData[grade - 1][index+1]}</div>
                          <div>
                            {data?.seat.find((seat: { grade: number; class: number; number: number; }) => seat.grade === Math.floor(seatData[grade - 1][index+1] / 1000) &&
                            seat.class === Math.floor((seatData[grade - 1][index+1] % 1000) / 100) &&
                            seat.number === seatData[grade - 1][index+1] % 100)?.name || "Unknown"}
                          </div>
                        </div>
                        <div className={ (data?.activity.find((activity: { user: { grade: number; class: number; number: number; }, activity: { perio: string } }) => 
                            activity.user.grade === Math.floor(seatData[grade - 1][index+2] / 1000) &&
                            activity.user.class === Math.floor((seatData[grade - 1][index+2] % 1000) / 100) &&
                            activity.user.number === seatData[grade - 1][index+2] % 100 && activity.activity.perio.split(',').indexOf(time) !== -1) || data?.activityWriter.find((activity: { writer: { grade: number; class: number; number: number; }, perio: string }) => 
                              activity.writer.grade === Math.floor(seatData[grade - 1][index+2] / 1000) &&
                              activity.writer.class === Math.floor((seatData[grade - 1][index+2] % 1000) / 100) &&
                              activity.writer.number === seatData[grade - 1][index+2] % 100 && activity.perio.split(',').indexOf(time) !== -1)) ? "bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer text-white rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center" : "bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer text-lightgray-200 rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center" }>
                          <div className={ (data?.activity.find((activity: { user: { grade: number; class: number; number: number; }, activity: { perio: string } }) => 
                            activity.user.grade === Math.floor(seatData[grade - 1][index+2] / 1000) &&
                            activity.user.class === Math.floor((seatData[grade - 1][index+2] % 1000) / 100) &&
                            activity.user.number === seatData[grade - 1][index+2] % 100 && activity.activity.perio.split(',').indexOf(time) !== -1) || data?.activityWriter.find((activity: { writer: { grade: number; class: number; number: number; }, perio: string }) => 
                              activity.writer.grade === Math.floor(seatData[grade - 1][index+2] / 1000) &&
                              activity.writer.class === Math.floor((seatData[grade - 1][index+2] % 1000) / 100) &&
                              activity.writer.number === seatData[grade - 1][index+2] % 100 && activity.perio.split(',').indexOf(time) !== -1)) ? "font-medium text-blue-100 text-sm" : "font-medium text-lightgray-200 text-sm" }>{seatData[grade - 1][index+2]}</div>
                          <div>
                            {data?.seat.find((seat: { grade: number; class: number; number: number; }) => seat.grade === Math.floor(seatData[grade - 1][index+2] / 1000) &&
                            seat.class === Math.floor((seatData[grade - 1][index+2] % 1000) / 100) &&
                            seat.number === seatData[grade - 1][index+2] % 100)?.name || "Unknown"}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <div className={ (data?.activity.find((activity: { user: { grade: number; class: number; number: number; }, activity: { perio: string } }) => 
                            activity.user.grade === Math.floor(seatData[grade - 1][index+3] / 1000) &&
                            activity.user.class === Math.floor((seatData[grade - 1][index+3] % 1000) / 100) &&
                            activity.user.number === seatData[grade - 1][index+3] % 100 && activity.activity.perio.split(',').indexOf(time) !== -1) || data?.activityWriter.find((activity: { writer: { grade: number; class: number; number: number; }, perio: string }) => 
                              activity.writer.grade === Math.floor(seatData[grade - 1][index+3] / 1000) &&
                              activity.writer.class === Math.floor((seatData[grade - 1][index+3] % 1000) / 100) &&
                              activity.writer.number === seatData[grade - 1][index+3] % 100 && activity.perio.split(',').indexOf(time) !== -1)) ? "bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer text-white rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center" : "bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer text-lightgray-200 rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center" }>
                          <div className={ (data?.activity.find((activity: { user: { grade: number; class: number; number: number; }, activity: { perio: string } }) => 
                            activity.user.grade === Math.floor(seatData[grade - 1][index+3] / 1000) &&
                            activity.user.class === Math.floor((seatData[grade - 1][index+3] % 1000) / 100) &&
                            activity.user.number === seatData[grade - 1][index+3] % 100 && activity.activity.perio.split(',').indexOf(time) !== -1) || data?.activityWriter.find((activity: { writer: { grade: number; class: number; number: number; }, perio: string }) => 
                              activity.writer.grade === Math.floor(seatData[grade - 1][index+3] / 1000) &&
                              activity.writer.class === Math.floor((seatData[grade - 1][index+3] % 1000) / 100) &&
                              activity.writer.number === seatData[grade - 1][index+3] % 100 && activity.perio.split(',').indexOf(time) !== -1)) ? "font-medium text-blue-100 text-sm" : "font-medium text-lightgray-200 text-sm" }>{seatData[grade - 1][index+3]}</div>
                          <div>
                            {data?.seat.find((seat: { grade: number; class: number; number: number; }) => seat.grade === Math.floor(seatData[grade - 1][index+3] / 1000) &&
                            seat.class === Math.floor((seatData[grade - 1][index+3] % 1000) / 100) &&
                            seat.number === seatData[grade - 1][index+3] % 100)?.name || "Unknown"}
                          </div>
                        </div>
                        <div className={ (data?.activity.find((activity: { user: { grade: number; class: number; number: number; }, activity: { perio: string } }) => 
                            activity.user.grade === Math.floor(seatData[grade - 1][index+4] / 1000) &&
                            activity.user.class === Math.floor((seatData[grade - 1][index+4] % 1000) / 100) &&
                            activity.user.number === seatData[grade - 1][index+4] % 100 && activity.activity.perio.split(',').indexOf(time) !== -1) || data?.activityWriter.find((activity: { writer: { grade: number; class: number; number: number; }, perio: string }) => 
                              activity.writer.grade === Math.floor(seatData[grade - 1][index+4] / 1000) &&
                              activity.writer.class === Math.floor((seatData[grade - 1][index+4] % 1000) / 100) &&
                              activity.writer.number === seatData[grade - 1][index+4] % 100 && activity.perio.split(',').indexOf(time) !== -1)) ? "bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer text-white rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center" : "bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer text-lightgray-200 rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center" }>
                          <div className={ (data?.activity.find((activity: { user: { grade: number; class: number; number: number; }, activity: { perio: string } }) => 
                            activity.user.grade === Math.floor(seatData[grade - 1][index+4] / 1000) &&
                            activity.user.class === Math.floor((seatData[grade - 1][index+4] % 1000) / 100) &&
                            activity.user.number === seatData[grade - 1][index+4] % 100 && activity.activity.perio.split(',').indexOf(time) !== -1) || data?.activityWriter.find((activity: { writer: { grade: number; class: number; number: number; }, perio: string }) => 
                              activity.writer.grade === Math.floor(seatData[grade - 1][index+4] / 1000) &&
                              activity.writer.class === Math.floor((seatData[grade - 1][index+4] % 1000) / 100) &&
                              activity.writer.number === seatData[grade - 1][index+4] % 100 && activity.perio.split(',').indexOf(time) !== -1)) ? "font-medium text-blue-100 text-sm" : "font-medium text-lightgray-200 text-sm" }>{seatData[grade - 1][index+4]}</div>
                          <div>
                            {data?.seat.find((seat: { grade: number; class: number; number: number; }) => seat.grade === Math.floor(seatData[grade - 1][index+4] / 1000) &&
                            seat.class === Math.floor((seatData[grade - 1][index+4] % 1000) / 100) &&
                            seat.number === seatData[grade - 1][index+4] % 100)?.name || "Unknown"}
                          </div>
                        </div>
                        <div className={ (data?.activity.find((activity: { user: { grade: number; class: number; number: number; }, activity: { perio: string } }) => 
                            activity.user.grade === Math.floor(seatData[grade - 1][index+5] / 1000) &&
                            activity.user.class === Math.floor((seatData[grade - 1][index+5] % 1000) / 100) &&
                            activity.user.number === seatData[grade - 1][index+5] % 100 && activity.activity.perio.split(',').indexOf(time) !== -1) || data?.activityWriter.find((activity: { writer: { grade: number; class: number; number: number; }, perio: string }) => 
                              activity.writer.grade === Math.floor(seatData[grade - 1][index+5] / 1000) &&
                              activity.writer.class === Math.floor((seatData[grade - 1][index+5] % 1000) / 100) &&
                              activity.writer.number === seatData[grade - 1][index+5] % 100 && activity.perio.split(',').indexOf(time) !== -1)) ? "bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer text-white rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center" : "bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer text-lightgray-200 rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center" }>
                          <div className={ (data?.activity.find((activity: { user: { grade: number; class: number; number: number; }, activity: { perio: string } }) => 
                            activity.user.grade === Math.floor(seatData[grade - 1][index+5] / 1000) &&
                            activity.user.class === Math.floor((seatData[grade - 1][index+5] % 1000) / 100) &&
                            activity.user.number === seatData[grade - 1][index+5] % 100 && activity.activity.perio.split(',').indexOf(time) !== -1) || data?.activityWriter.find((activity: { writer: { grade: number; class: number; number: number; }, perio: string }) => 
                              activity.writer.grade === Math.floor(seatData[grade - 1][index+5] / 1000) &&
                              activity.writer.class === Math.floor((seatData[grade - 1][index+5] % 1000) / 100) &&
                              activity.writer.number === seatData[grade - 1][index+5] % 100 && activity.perio.split(',').indexOf(time) !== -1)) ? "font-medium text-blue-100 text-sm" : "font-medium text-lightgray-200 text-sm" }>{seatData[grade - 1][index+5]}</div>
                          <div>
                            {data?.seat.find((seat: { grade: number; class: number; number: number; }) => seat.grade === Math.floor(seatData[grade - 1][index+5] / 1000) &&
                            seat.class === Math.floor((seatData[grade - 1][index+5] % 1000) / 100) &&
                            seat.number === seatData[grade - 1][index+5] % 100)?.name || "Unknown"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-5">
                      <div className="flex space-x-1">
                        <div className={ (data?.activity.find((activity: { user: { grade: number; class: number; number: number; }, activity: { perio: string } }) => 
                            activity.user.grade === Math.floor(seatData[grade - 1][index+6] / 1000) &&
                            activity.user.class === Math.floor((seatData[grade - 1][index+6] % 1000) / 100) &&
                            activity.user.number === seatData[grade - 1][index+6] % 100 && activity.activity.perio.split(',').indexOf(time) !== -1) || data?.activityWriter.find((activity: { writer: { grade: number; class: number; number: number; }, perio: string }) => 
                              activity.writer.grade === Math.floor(seatData[grade - 1][index+6] / 1000) &&
                              activity.writer.class === Math.floor((seatData[grade - 1][index+6] % 1000) / 100) &&
                              activity.writer.number === seatData[grade - 1][index+6] % 100 && activity.perio.split(',').indexOf(time) !== -1)) ? "bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer text-white rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center" : "bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer text-lightgray-200 rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center" }>
                          <div className={ (data?.activity.find((activity: { user: { grade: number; class: number; number: number; }, activity: { perio: string } }) => 
                            activity.user.grade === Math.floor(seatData[grade - 1][index+6] / 1000) &&
                            activity.user.class === Math.floor((seatData[grade - 1][index+6] % 1000) / 100) &&
                            activity.user.number === seatData[grade - 1][index+6] % 100 && activity.activity.perio.split(',').indexOf(time) !== -1) || data?.activityWriter.find((activity: { writer: { grade: number; class: number; number: number; }, perio: string }) => 
                              activity.writer.grade === Math.floor(seatData[grade - 1][index+6] / 1000) &&
                              activity.writer.class === Math.floor((seatData[grade - 1][index+6] % 1000) / 100) &&
                              activity.writer.number === seatData[grade - 1][index+6] % 100 && activity.perio.split(',').indexOf(time) !== -1)) ? "font-medium text-blue-100 text-sm" : "font-medium text-lightgray-200 text-sm" }>{seatData[grade - 1][index+6]}</div>
                          <div>
                            {data?.seat.find((seat: { grade: number; class: number; number: number; }) => seat.grade === Math.floor(seatData[grade - 1][index+6] / 1000) &&
                            seat.class === Math.floor((seatData[grade - 1][index+6] % 1000) / 100) &&
                            seat.number === seatData[grade - 1][index+6] % 100)?.name || "Unknown"}
                          </div>
                        </div>
                        <div className={ (data?.activity.find((activity: { user: { grade: number; class: number; number: number; }, activity: { perio: string } }) => 
                            activity.user.grade === Math.floor(seatData[grade - 1][index+7] / 1000) &&
                            activity.user.class === Math.floor((seatData[grade - 1][index+7] % 1000) / 100) &&
                            activity.user.number === seatData[grade - 1][index+7] % 100 && activity.activity.perio.split(',').indexOf(time) !== -1) || data?.activityWriter.find((activity: { writer: { grade: number; class: number; number: number; }, perio: string }) => 
                              activity.writer.grade === Math.floor(seatData[grade - 1][index+7] / 1000) &&
                              activity.writer.class === Math.floor((seatData[grade - 1][index+7] % 1000) / 100) &&
                              activity.writer.number === seatData[grade - 1][index+7] % 100 && activity.perio.split(',').indexOf(time) !== -1)) ? "bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer text-white rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center" : "bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer text-lightgray-200 rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center" }>
                          <div className={ (data?.activity.find((activity: { user: { grade: number; class: number; number: number; }, activity: { perio: string } }) => 
                            activity.user.grade === Math.floor(seatData[grade - 1][index+7] / 1000) &&
                            activity.user.class === Math.floor((seatData[grade - 1][index+7] % 1000) / 100) &&
                            activity.user.number === seatData[grade - 1][index+7] % 100 && activity.activity.perio.split(',').indexOf(time) !== -1) || data?.activityWriter.find((activity: { writer: { grade: number; class: number; number: number; }, perio: string }) => 
                              activity.writer.grade === Math.floor(seatData[grade - 1][index+7] / 1000) &&
                              activity.writer.class === Math.floor((seatData[grade - 1][index+7] % 1000) / 100) &&
                              activity.writer.number === seatData[grade - 1][index+7] % 100 && activity.perio.split(',').indexOf(time) !== -1)) ? "font-medium text-blue-100 text-sm" : "font-medium text-lightgray-200 text-sm" }>{seatData[grade - 1][index+7]}</div>
                          <div>
                            {data?.seat.find((seat: { grade: number; class: number; number: number; }) => seat.grade === Math.floor(seatData[grade - 1][index+7] / 1000) &&
                            seat.class === Math.floor((seatData[grade - 1][index+7] % 1000) / 100) &&
                            seat.number === seatData[grade - 1][index+7] % 100)?.name || "Unknown"}
                          </div>
                        </div>
                        <div className={ (data?.activity.find((activity: { user: { grade: number; class: number; number: number; }, activity: { perio: string } }) => 
                            activity.user.grade === Math.floor(seatData[grade - 1][index+8] / 1000) &&
                            activity.user.class === Math.floor((seatData[grade - 1][index+8] % 1000) / 100) &&
                            activity.user.number === seatData[grade - 1][index+8] % 100 && activity.activity.perio.split(',').indexOf(time) !== -1) || data?.activityWriter.find((activity: { writer: { grade: number; class: number; number: number; }, perio: string }) => 
                              activity.writer.grade === Math.floor(seatData[grade - 1][index+8] / 1000) &&
                              activity.writer.class === Math.floor((seatData[grade - 1][index+8] % 1000) / 100) &&
                              activity.writer.number === seatData[grade - 1][index+8] % 100 && activity.perio.split(',').indexOf(time) !== -1)) ? "bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer text-white rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center" : "bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer text-lightgray-200 rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center" }>
                          <div className={ (data?.activity.find((activity: { user: { grade: number; class: number; number: number; }, activity: { perio: string } }) => 
                            activity.user.grade === Math.floor(seatData[grade - 1][index+8] / 1000) &&
                            activity.user.class === Math.floor((seatData[grade - 1][index+8] % 1000) / 100) &&
                            activity.user.number === seatData[grade - 1][index+8] % 100 && activity.activity.perio.split(',').indexOf(time) !== -1) || data?.activityWriter.find((activity: { writer: { grade: number; class: number; number: number; }, perio: string }) => 
                              activity.writer.grade === Math.floor(seatData[grade - 1][index+8] / 1000) &&
                              activity.writer.class === Math.floor((seatData[grade - 1][index+8] % 1000) / 100) &&
                              activity.writer.number === seatData[grade - 1][index+8] % 100 && activity.perio.split(',').indexOf(time) !== -1)) ? "font-medium text-blue-100 text-sm" : "font-medium text-lightgray-200 text-sm" }>{seatData[grade - 1][index+8]}</div>
                          <div>
                            {data?.seat.find((seat: { grade: number; class: number; number: number; }) => seat.grade === Math.floor(seatData[grade - 1][index+8] / 1000) &&
                            seat.class === Math.floor((seatData[grade - 1][index+8] % 1000) / 100) &&
                            seat.number === seatData[grade - 1][index+8] % 100)?.name || "Unknown"}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <div className={ (data?.activity.find((activity: { user: { grade: number; class: number; number: number; }, activity: { perio: string } }) => 
                            activity.user.grade === Math.floor(seatData[grade - 1][index+9] / 1000) &&
                            activity.user.class === Math.floor((seatData[grade - 1][index+9] % 1000) / 100) &&
                            activity.user.number === seatData[grade - 1][index+9] % 100 && activity.activity.perio.split(',').indexOf(time) !== -1) || data?.activityWriter.find((activity: { writer: { grade: number; class: number; number: number; }, perio: string }) => 
                              activity.writer.grade === Math.floor(seatData[grade - 1][index+9] / 1000) &&
                              activity.writer.class === Math.floor((seatData[grade - 1][index+9] % 1000) / 100) &&
                              activity.writer.number === seatData[grade - 1][index+9] % 100 && activity.perio.split(',').indexOf(time) !== -1)) ? "bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer text-white rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center" : "bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer text-lightgray-200 rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center" }>
                          <div className={ (data?.activity.find((activity: { user: { grade: number; class: number; number: number; }, activity: { perio: string } }) => 
                            activity.user.grade === Math.floor(seatData[grade - 1][index+9] / 1000) &&
                            activity.user.class === Math.floor((seatData[grade - 1][index+9] % 1000) / 100) &&
                            activity.user.number === seatData[grade - 1][index+9] % 100 && activity.activity.perio.split(',').indexOf(time) !== -1) || data?.activityWriter.find((activity: { writer: { grade: number; class: number; number: number; }, perio: string }) => 
                              activity.writer.grade === Math.floor(seatData[grade - 1][index+9] / 1000) &&
                              activity.writer.class === Math.floor((seatData[grade - 1][index+9] % 1000) / 100) &&
                              activity.writer.number === seatData[grade - 1][index+9] % 100 && activity.perio.split(',').indexOf(time) !== -1)) ? "font-medium text-blue-100 text-sm" : "font-medium text-lightgray-200 text-sm" }>{seatData[grade - 1][index+9]}</div>
                          <div>
                            {data?.seat.find((seat: { grade: number; class: number; number: number; }) => seat.grade === Math.floor(seatData[grade - 1][index+9] / 1000) &&
                            seat.class === Math.floor((seatData[grade - 1][index+9] % 1000) / 100) &&
                            seat.number === seatData[grade - 1][index+9] % 100)?.name || "Unknown"}
                          </div>
                        </div>
                        <div className={ (data?.activity.find((activity: { user: { grade: number; class: number; number: number; }, activity: { perio: string } }) => 
                            activity.user.grade === Math.floor(seatData[grade - 1][index+10] / 1000) &&
                            activity.user.class === Math.floor((seatData[grade - 1][index+10] % 1000) / 100) &&
                            activity.user.number === seatData[grade - 1][index+10] % 100 && activity.activity.perio.split(',').indexOf(time) !== -1) || data?.activityWriter.find((activity: { writer: { grade: number; class: number; number: number; }, perio: string }) => 
                              activity.writer.grade === Math.floor(seatData[grade - 1][index+10] / 1000) &&
                              activity.writer.class === Math.floor((seatData[grade - 1][index+10] % 1000) / 100) &&
                              activity.writer.number === seatData[grade - 1][index+10] % 100 && activity.perio.split(',').indexOf(time) !== -1)) ? "bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer text-white rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center" : "bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer text-lightgray-200 rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center" }>
                          <div className={ (data?.activity.find((activity: { user: { grade: number; class: number; number: number; }, activity: { perio: string } }) => 
                            activity.user.grade === Math.floor(seatData[grade - 1][index+10] / 1000) &&
                            activity.user.class === Math.floor((seatData[grade - 1][index+10] % 1000) / 100) &&
                            activity.user.number === seatData[grade - 1][index+10] % 100 && activity.activity.perio.split(',').indexOf(time) !== -1) || data?.activityWriter.find((activity: { writer: { grade: number; class: number; number: number; }, perio: string }) => 
                              activity.writer.grade === Math.floor(seatData[grade - 1][index+10] / 1000) &&
                              activity.writer.class === Math.floor((seatData[grade - 1][index+10] % 1000) / 100) &&
                              activity.writer.number === seatData[grade - 1][index+10] % 100 && activity.perio.split(',').indexOf(time) !== -1)) ? "font-medium text-blue-100 text-sm" : "font-medium text-lightgray-200 text-sm" }>{seatData[grade - 1][index+10]}</div>
                          <div>
                            {data?.seat.find((seat: { grade: number; class: number; number: number; }) => seat.grade === Math.floor(seatData[grade - 1][index+10] / 1000) &&
                            seat.class === Math.floor((seatData[grade - 1][index+10] % 1000) / 100) &&
                            seat.number === seatData[grade - 1][index+10] % 100)?.name || "Unknown"}
                          </div>
                        </div>
                        <div className={ (data?.activity.find((activity: { user: { grade: number; class: number; number: number; }, activity: { perio: string } }) => 
                            activity.user.grade === Math.floor(seatData[grade - 1][index+11] / 1000) &&
                            activity.user.class === Math.floor((seatData[grade - 1][index+11] % 1000) / 100) &&
                            activity.user.number === seatData[grade - 1][index+11] % 100 && activity.activity.perio.split(',').indexOf(time) !== -1) || data?.activityWriter.find((activity: { writer: { grade: number; class: number; number: number; }, perio: string }) => 
                              activity.writer.grade === Math.floor(seatData[grade - 1][index+11] / 1000) &&
                              activity.writer.class === Math.floor((seatData[grade - 1][index+11] % 1000) / 100) &&
                              activity.writer.number === seatData[grade - 1][index+11] % 100 && activity.perio.split(',').indexOf(time) !== -1)) ? "bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer text-white rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center" : "bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer text-lightgray-200 rounded-xl w-[110px] h-[50px] flex flex-col justify-center items-center text-center" }>
                          <div className={ (data?.activity.find((activity: { user: { grade: number; class: number; number: number; }, activity: { perio: string } }) => 
                            activity.user.grade === Math.floor(seatData[grade - 1][index+11] / 1000) &&
                            activity.user.class === Math.floor((seatData[grade - 1][index+11] % 1000) / 100) &&
                            activity.user.number === seatData[grade - 1][index+11] % 100 && activity.activity.perio.split(',').indexOf(time) !== -1) || data?.activityWriter.find((activity: { writer: { grade: number; class: number; number: number; }, perio: string }) => 
                              activity.writer.grade === Math.floor(seatData[grade - 1][index+11] / 1000) &&
                              activity.writer.class === Math.floor((seatData[grade - 1][index+11] % 1000) / 100) &&
                              activity.writer.number === seatData[grade - 1][index+11] % 100 && activity.perio.split(',').indexOf(time) !== -1)) ? "font-medium text-blue-100 text-sm" : "font-medium text-lightgray-200 text-sm" }>{seatData[grade - 1][index+11]}</div>
                          <div>
                            {data?.seat.find((seat: { grade: number; class: number; number: number; }) => seat.grade === Math.floor(seatData[grade - 1][index+11] / 1000) &&
                            seat.class === Math.floor((seatData[grade - 1][index+11] % 1000) / 100) &&
                            seat.number === seatData[grade - 1][index+11] % 100)?.name || "Unknown"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }) }
            </div>
          </div>
        </div></OpacityAnimation> }
      </div>
    </>
  );
}
