'use client';

import Button from "@components/button";
import Image from "next/image";

export default function PetitionModal({ fn }:{ fn:()=>void }) {
  return (
    <div className="w-full md:w-[380px] h-[520px]">
      <div className="absolute w-full h-[200px] -m-5 rounded-t-xl">
        <Image
          src="/images/petition-info.png"
          alt="청원 게시판 안내"
          width={420}
          height={200}
          className="object-cover rounded-t-xl"
          quality={100}
          priority
        />
      </div>
      <div className="flex flex-col justify-between h-full pb-0">
        <div className="mt-[200px]">
          <div className="font-bold text-2xl">깨끗한 청원 문화 조성에<br/>함께해주세요.</div>
          <div className="text-base text-lightgray-200 mt-2">학생 청원 게시판은 '<span className="text-teal-500">학생 청원 게시판 운영계획</span>'에 따라 학생회 청원부가 관리하며 <span className="text-teal-500">실명제</span>로 운영되는 게시판입니다.<br/>청원은 심사를 거쳐 공개되며, 150명 이상 동의 시 담당자 또는 담당 부서의 답변을 구해 게시하고 있습니다.<br/><br/>학교를 변화시킬 좋은 제안을 기다립니다.</div>
        </div>
        <Button color="teal" fn={fn}>
          확인 후, 다시 보지 않기
        </Button>
      </div>
    </div>
  )
}