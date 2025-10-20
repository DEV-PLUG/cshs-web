'use client';

import useSWR from "swr";
import { useState } from "react";
import Link from "next/link";
import Loading from "@components/loading";

export default function AdminPetitionsList() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');
  const { data, mutate, isLoading } = useSWR(`/api/petitions/admin?page=${page}&status=${status}`);

  const petitions = data?.petitions || [];
  const totalPages = data?.totalPages || 0;

  const getStatusBadge = (status: string) => {
    const badges: any = {
      'pending': { label: '심사중', color: 'bg-yellow-100 text-yellow-800' },
      'open': { label: '공개', color: 'bg-green-100 text-green-800' },
      'closed': { label: '비공개', color: 'bg-gray-100 text-gray-800' },
      'rejected': { label: '반려', color: 'bg-red-100 text-red-800' }
    };
    return badges[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <div className="w-full">
      <div className="justify-between items-center mb-6">
        <div>
          <h1 className="font-bold text-2xl md:text-3xl mb-8 text-zinc-800 cursor-pointer">청원 관리</h1>
          <div className="w-full h-[1px] my-5 bg-lightgray-100 xl:block hidden"></div>
        </div>
      </div>

      {/* 상태 필터 */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setStatus('all'); setPage(1); }}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            status === 'all'
              ? 'bg-teal-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          전체
        </button>
        <button
          onClick={() => { setStatus('pending'); setPage(1); }}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            status === 'pending'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          심사중
        </button>
        <button
          onClick={() => { setStatus('open'); setPage(1); }}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            status === 'open'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          공개
        </button>
        <button
          onClick={() => { setStatus('closed'); setPage(1); }}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            status === 'closed'
              ? 'bg-gray-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          비공개
        </button>
        <button
          onClick={() => { setStatus('rejected'); setPage(1); }}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            status === 'rejected'
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          반려
        </button>
      </div>
      <div className="bg-orange-100 text-orange-500 p-3 rounded-lg text-sm my-3 font-bold">심사 내용을 비공개로 유지하기 위해 이 페이지는 공개된 공간에서 접속하지 마세요.</div>

      {/* 청원 목록 */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="w-full">
            <div className="flex justify-center my-52 text-teal-500">
              <Loading size={35} />
            </div>
          </div>
        ) : petitions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">청원이 없습니다.</div>
        ) : (
          petitions.map((petition: any) => {
            const badge = getStatusBadge(petition.status);
            return (
              <Link className="block" key={petition.id} href={`/d/admin/petitions/${petition.id}`}>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-lg text-zinc-800">{petition.title}</h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
                        {badge.label}
                      </span>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-5">
                        {/* <span><span className="tossface">👤</span> {petition.writer.name} ({petition.writer.grade}학년 {petition.writer.class}반)</span> */}
                        <span><span className="tossface">🔗</span> 동의 {petition.supportCount}명</span>
                        <span><span className="tossface">📅</span> {new Date(petition.createdAt).toLocaleDateString('ko-KR')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-50 hover:bg-gray-200 transition-colors"
          >
            이전
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                page === p
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-50 hover:bg-gray-200 transition-colors"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
