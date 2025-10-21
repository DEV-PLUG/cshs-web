'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@components/button";
import Input, { Textarea } from "@components/input";
import { useAppDispatch } from "@libs/client/redux/hooks";
import { setNotification } from "@libs/client/redux/notification";
import Link from "next/link";
import Image from "next/image";

export default function NewPetition() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;
    if (title.length < 10) {
      dispatch(setNotification({ text: "제목은 10자 이상 입력해주세요.", type: "error" }));
      return;
    }
    if (reason.length < 100) {
      dispatch(setNotification({ text: "청원 취지는 100자 이상 입력해주세요.", type: "error" }));
      return;
    }
    if (content.length < 500) {
      dispatch(setNotification({ text: "내용은 500자 이상 입력해주세요.", type: "error" }));
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/petitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, reason }),
      });
      const data = await res.json();
      
      if (data.success) {
        dispatch(setNotification({ text: "청원이 등록되었습니다.", type: "success" }));
        router.replace("/d/petitions");
      } else {
        dispatch(setNotification({ text: data.message || "청원 등록에 실패했습니다.", type: "error" }));
      }
    } catch (error) {
      dispatch(setNotification({ text: "오류가 발생했습니다.", type: "error" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-20 px-5">
      <div className="flex mb-10">
        <Link href='/d/petitions'>
          <div className="transition-colors cursor-pointer space-x-2 rounded-full text-gray-500 flex items-center">
            <svg className="w-5 h-5" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            <div>청원 목록으로 돌아가기</div>
          </div>
        </Link>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">학생 청원 작성</h1>
        <div className="text-sm text-zinc-500">
          <p>• 반드시 <a href="/d/petitions/terms" target="_blank" className="text-teal-500 hover:underline">청원 게시판 이용규칙</a> 숙지 후 작성해주시기 바랍니다.</p>
          <p>• 청원 작성 후 심사를 통과하면 청원 내용이 공개됩니다.(약 1~3일 소요)</p>
          <p>• 청원 동의는 청원 공개 후 30일간 진행됩니다.</p>
          <p>• 청원 게시판은 익명제로 운영됩니다.</p>
          <p>• 부적절한 내용의 청원은 관리자에 의해 삭제될 수 있습니다.</p>
          <p>• 청원 게시판은 <a href="/docs/온라인 청원 게시판 운영계획.pdf" className="text-teal-500 hover:underline">학생 청원 게시판 운영 계획</a>에 따라 운영됩니다.</p>
        </div>
      </div>
      <div className="mb-10 hidden md:block">
        <Image
          src="/images/petition-illustration.png"
          alt="청원 일러스트"
          width={728}
          height={100}
          quality={100}
          priority
        />
      </div>
      <div className="mb-10 md:hidden block">
        <Image
          src="/images/petition-illustration-mobile.png"
          alt="청원 일러스트"
          width={728}
          height={200}
          quality={100}
          priority
        />
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-base font-medium mb-1 block">청원 제목</label>
          <div className="max-w-3xl w-full">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="청원 제목을 입력해주세요. (10자 이상)"
              className="w-full h-[55px] rounded-2xl hover:border-gray-300 focus:border-teal-500 transition-all px-4 outline-none border-2 border-lightgray-100"
            />
          </div>
          <div className="text-xs text-right text-zinc-400 mt-1">
            {title.length}/100자
          </div>
        </div>
        <div>
          <label className="text-base font-medium mb-1 block">청원 취지</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="청원 취지를 간략하게 작성해주세요. (100자 이상)"
            className="w-full h-[100px] py-3 rounded-2xl hover:border-gray-300 focus:border-teal-500 transition-all px-4 outline-none border-2 border-lightgray-100"
          />
          <div className="text-xs text-right text-zinc-400 mt-1">
            {reason.length}/1000자
          </div>
        </div>
        <div>
          <label className="text-base font-medium mb-1 block">청원 내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="청원 내용을 상세히 작성해주세요. (500자 이상)"
            className="w-full h-[350px] py-3 rounded-2xl hover:border-gray-300 focus:border-teal-500 transition-all px-4 outline-none border-2 border-lightgray-100"
          />
          <div className="text-xs text-right text-zinc-400 mt-1">
            {content.length}/5000자
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 w-full">
          <Button
            color="teal"
            fn={handleSubmit}
            loading={loading}
          >
            <div className="text-center w-[250px]">
              청원 등록하기
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
