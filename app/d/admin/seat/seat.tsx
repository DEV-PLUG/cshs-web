'use client';

import { useEffect, useState } from "react";
import useSWR from 'swr';
import { OpacityAnimation } from "@components/animation";
import { AnimatePresence } from "framer-motion";
import Modal from "@components/modal";
import SelectMember from "@components/member";
import Button from "@components/button";
import { setNotification } from "@libs/client/redux/notification";
import { useAppDispatch } from "@libs/client/redux/hooks";
import Loading from "@components/loading";

export default function Seat() {
  const [grade, setGrade] = useState(1);
  const [ready, setReady] = useState(false);

  const { data } = useSWR(`/api/admin/seat?grade=${grade}`);

  function CustomSeat({ seatNumber, horizontal = false }: { seatNumber:number, horizontal?: boolean }) {
    // 학년에 따라 백의 자리 결정
    const seatUser = localSeat?.find((u:any) => u.seat === seatNumber);
    const seatBgClass = "bg-gray-100 hover:bg-gray-200";

    return (
      <div
        className={horizontal === true ? `${seatBgClass} rounded-lg w-[85px] h-[60px] cursor-pointer flex flex-col items-center justify-center` : `${seatBgClass} rounded-lg w-[65px] h-[100px] cursor-pointer flex flex-col items-center justify-center`}
        onClick={() => {
          setMemberModal(true);
          setSelectedSeat(seatNumber);
          setSelected(localSeat.filter((u:any) => u.seat === seatNumber));
        }}
      >
        {seatUser ? (
          <>
            <div className={ "font-bold" }>{seatUser.name}</div>
            <div className={ "text-xs text-zinc-500" }>
              {seatUser.grade}{seatUser.class}{seatUser.number < 10 ? `0${seatUser.number}` : seatUser.number}
            </div>
          </>
        ) : (
          <div className="text-lightgray-200 text-xs">비어있음</div>
        )}
      </div>
    );
  }

  const [memberModal, setMemberModal] = useState(false);
  const [selected, setSelected] = useState<any>([]);

  const [localSeat, setLocalSeat] = useState<any>([]);
  useEffect(() => {
    if(data?.success === true) {
      setLocalSeat(data.seat);
      setReady(true);
    }
  }, [data]);

  const [selectedSeat, setSelectedSeat] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  async function postSeat() {
    if(loading) return;

    setLoading(true);
    await fetch(`/api/admin/seat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        seat: localSeat
      })
    })
    .then((response) => response.json())
    .then((response) => {
      setLoading(false);
      if(response.success === true) {
        dispatch(setNotification({ type: "success", text: '좌석 정보를 저장했습니다' }));
      } else {
        dispatch(setNotification({ type: "error", text: response.message }));
      }
    });
  }

  return (
    <>
      <AnimatePresence initial={false} mode="wait">
        { memberModal && <Modal handleClose={() => {
          setMemberModal(false);
        }}>
          <SelectMember disableGroup disableFavorite limit={1} selected={selected} fn={(selected) => {
            // selectedSeat 번호의 localSeat 유저 아이디를 selected[0]으로 바꿔줌
            setLocalSeat((prev: any[]) => {
                // 선택된 유저가 없으면 해당 좌석을 빈 좌석으로 처리
                if (!selected[0]) {
                return prev.map((u: any) =>
                  u.seat === selectedSeat ? { ...u, seat: null } : u
                );
                }

                // 해당 좌석에 이미 유저가 있으면 교체, 없으면 새로 추가
                const selectedUserId = selected[0]?.id;
                let updatedSeats = prev.map((u: any) => {
                // 선택된 유저가 이미 다른 자리에 있으면 그 자리를 비움
                if (u.id === selectedUserId) {
                  return { seat: null };
                }
                // 현재 좌석에 유저가 있으면 교체
                if (u.seat === selectedSeat) {
                  return { ...selected[0], seat: selectedSeat };
                }
                return u;
                });

                // 만약 현재 좌석에 아무도 없으면 새로 추가
                const exists = prev.some((u: any) => u.seat === selectedSeat);
                if (!exists) {
                updatedSeats = [...updatedSeats, { ...selected[0], seat: selectedSeat }];
                }
                return updatedSeats;
            });
            
            setSelected(selected);
            setMemberModal(false);
          }} />
        </Modal> }
      </AnimatePresence>
      <div className="flex justify-between items-center">
        <div className="flex space-x-4 md:space-x-6">
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
      </div>
      <div className="w-full h-[1px] mb-5 bg-lightgray-100"></div>
      <div className="md:flex space-y-2 md:space-y-0 justify-between">
        <div className="p-2 px-3 text-sm rounded-xl bg-blue-100 text-blue-500">
          수정 후 반드시 저장 버튼을 눌러 저장해주세요.<br/>저장 전 다른 학년을 선택하면 변경 사항이 폐기되니 조심하세요.
        </div>
        <Button disabled={loading} color="blue" fn={() => postSeat()}>
          { loading ? <div className="flex items-center justify-center space-x-2 w-[140px] h-[17px] font-semibold">
            <Loading size={20} />
          </div> : <div className="flex items-center justify-center space-x-2 w-[140px] h-[17px] font-semibold">
            <svg className="stroke-white w-6 h-6 mr-1" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            저장하기
          </div> }
        </Button>
      </div>
      { grade !== 3 ? <div className="mt-8 mb-10 flex flex-col overflow-x-auto">
        {!(ready) ? (
          <div className="w-full">
            <div className="flex flex-col">
              {[...Array(14)].map((_, rowIdx) => (
                <div className={ (rowIdx+1)%2 === 0 ? "flex space-x-1 !mb-6" : "flex space-x-1 mb-1" } key={rowIdx}>
                  {[...Array(6)].map((_, colIdx) => {
                    const MR = colIdx === 2 ? "!mr-6" : ""
                    return (
                      <div
                        className={`${MR} bg-gray-100 animate-pulse rounded-xl min-w-[110px] w-[110px] h-[50px] flex flex-col justify-center items-center text-center`}
                        key={colIdx}
                      ></div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <OpacityAnimation>
            <div className="w-full flex justify-between">
              <div className="w-full flex flex-col">
                {[...Array(14)].map((_, rowIdx) => (
                  <div className={ (rowIdx+1)%2 === 0 ? "flex space-x-1 !mb-6" : "flex space-x-1 mb-1" } key={rowIdx}>
                    {[...Array(6)].map((_, colIdx) => {
                      // 학년에 따라 백의 자리 결정
                      const base = grade === 1 ? 200 : grade === 2 ? 300 : 400;
                      const seatNumber = base + 1 + rowIdx * 6 + colIdx;
                      if (seatNumber > base + 84) return null;
                      const seatUser = localSeat?.find((u:any) => u.seat === seatNumber);
                      const seatBgClass = "bg-gray-100 hover:bg-gray-200";
                      const MR = colIdx === 2 ? "!mr-6" : ""

                      return (
                        <div
                          key={colIdx}
                          className={`${seatBgClass} ${MR} cursor-pointer transition-colors rounded-xl min-w-[110px] w-[110px] h-[50px] flex flex-col justify-center items-center text-center`}
                          onClick={() => {
                            setMemberModal(true);
                            setSelectedSeat(seatNumber);
                            setSelected(localSeat.filter((u:any) => u.seat === seatNumber));
                          }}
                        >
                          {seatUser ? (
                            <>
                              <div className={ "font-bold" }>{seatUser.name}</div>
                              <div className={ "text-xs text-zinc-500" }>
                                {seatUser.grade}{seatUser.class}{seatUser.number < 10 ? `0${seatUser.number}` : seatUser.number}
                              </div>
                              {/* 필요하다면 firstActivity 정보 활용 가능 */}
                            </>
                          ) : (
                            <div className="text-lightgray-200 text-xs">비어있음</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </OpacityAnimation>
        )}
      </div> : <div className="mt-8 mb-10 flex overflow-x-auto space-x-10">
        {!(ready) ? (
          <div className="space-x-10 flex">
            <div className="space-y-2 mt-20">
              <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="space-x-2 flex"> 
                <div className="rounded-lg w-[85px] h-[60px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[85px] h-[60px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[85px] h-[60px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[85px] h-[60px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[85px] h-[60px] bg-gray-100 animate-pulse"></div>
              </div>
              <div className="space-x-2 flex mt-14"> 
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              </div>
              <div className="space-x-2 flex mt-2"> 
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              </div>
              <div className="space-x-2 flex mt-10"> 
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              </div>
              <div className="space-x-2 flex mt-2"> 
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="space-x-2 flex"> 
                <div className="rounded-lg w-[85px] h-[60px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[85px] h-[60px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[85px] h-[60px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[85px] h-[60px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[85px] h-[60px] bg-gray-100 animate-pulse"></div>
              </div>
              <div className="space-x-2 flex mt-14"> 
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              </div>
              <div className="space-x-2 flex mt-2"> 
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              </div>
              <div className="space-x-2 flex mt-10"> 
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              </div>
              <div className="space-x-2 flex mt-2"> 
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
                <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-2 mt-20">
              <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
              <div className="rounded-lg w-[65px] h-[100px] bg-gray-100 animate-pulse"></div>
            </div>
          </div>
        ) : <OpacityAnimation>
          <div className="space-x-10 flex">
            <div className="space-y-2 mt-20">
              <CustomSeat seatNumber={311} />
              <CustomSeat seatNumber={312} />
              <CustomSeat seatNumber={313} />
              <CustomSeat seatNumber={314} />
              <CustomSeat seatNumber={315} />
            </div>
            <div className="flex flex-col items-center">
              <div className="space-x-2 flex"> 
                <CustomSeat seatNumber={301} horizontal={true} />
                <CustomSeat seatNumber={302} horizontal={true} />
                <CustomSeat seatNumber={303} horizontal={true} />
                <CustomSeat seatNumber={304} horizontal={true} />
                <CustomSeat seatNumber={305} horizontal={true} />
              </div>
              <div className="space-x-2 flex mt-14"> 
                <CustomSeat seatNumber={321} />
                <CustomSeat seatNumber={322} />
                <CustomSeat seatNumber={323} />
                <CustomSeat seatNumber={324} />
                <CustomSeat seatNumber={325} />
              </div>
              <div className="space-x-2 flex mt-2"> 
                <CustomSeat seatNumber={326} />
                <CustomSeat seatNumber={327} />
                <CustomSeat seatNumber={328} />
                <CustomSeat seatNumber={329} />
                <CustomSeat seatNumber={330} />
              </div>
              <div className="space-x-2 flex mt-10"> 
                <CustomSeat seatNumber={331} />
                <CustomSeat seatNumber={332} />
                <CustomSeat seatNumber={333} />
                <CustomSeat seatNumber={334} />
                <CustomSeat seatNumber={335} />
              </div>
              <div className="space-x-2 flex mt-2"> 
                <CustomSeat seatNumber={336} />
                <CustomSeat seatNumber={337} />
                <CustomSeat seatNumber={338} />
                <CustomSeat seatNumber={339} />
                <CustomSeat seatNumber={340} />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="space-x-2 flex"> 
                <CustomSeat seatNumber={306} horizontal={true} />
                <CustomSeat seatNumber={307} horizontal={true} />
                <CustomSeat seatNumber={308} horizontal={true} />
                <CustomSeat seatNumber={309} horizontal={true} />
                <CustomSeat seatNumber={310} horizontal={true} />
              </div>
              <div className="space-x-2 flex mt-14"> 
                <CustomSeat seatNumber={341} />
                <CustomSeat seatNumber={342} />
                <CustomSeat seatNumber={343} />
                <CustomSeat seatNumber={344} />
                <CustomSeat seatNumber={345} />
              </div>
              <div className="space-x-2 flex mt-2"> 
                <CustomSeat seatNumber={346} />
                <CustomSeat seatNumber={347} />
                <CustomSeat seatNumber={348} />
                <CustomSeat seatNumber={349} />
                <CustomSeat seatNumber={350} />
              </div>
              <div className="space-x-2 flex mt-10"> 
                <CustomSeat seatNumber={351} />
                <CustomSeat seatNumber={352} />
                <CustomSeat seatNumber={353} />
                <CustomSeat seatNumber={354} />
                <CustomSeat seatNumber={355} />
              </div>
              <div className="space-x-2 flex mt-2"> 
                <CustomSeat seatNumber={356} />
                <CustomSeat seatNumber={357} />
                <CustomSeat seatNumber={358} />
                <CustomSeat seatNumber={359} />
                <CustomSeat seatNumber={360} />
              </div>
            </div>
            <div className="space-y-2 mt-20">
              <CustomSeat seatNumber={316} />
              <CustomSeat seatNumber={317} />
              <CustomSeat seatNumber={318} />
              <CustomSeat seatNumber={319} />
              <CustomSeat seatNumber={320} />
            </div>
          </div>
        </OpacityAnimation> }
      </div> }
    </>
  );
}
