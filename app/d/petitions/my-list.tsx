'use client';

import useSWR from "swr";
import { useState } from "react";
import Link from "next/link";
import Loading from "@components/loading";

export default function MyPetitionsList() {
  const [page, setPage] = useState(1);
  const { data, mutate, isLoading } = useSWR(`/api/petitions/my?page=${page}`);

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-800">내 청원</h1>
        <p className="text-gray-500 mt-1">내가 올린 청원의 상태와 답변을 확인할 수 있습니다.</p>
      </div>

      {/* 청원 목록 */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="w-full">
            <div className="flex justify-center my-52 text-teal-500">
              <Loading size={35} />
            </div>
          </div>
        ) : petitions.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <div className="text-gray-500 mb-4">아직 청원을 올리지 않았습니다.</div>
            <Link href="/d/petitions/new">
              <div className="inline-block px-6 py-2 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-colors cursor-pointer">
                청원 작성하기
              </div>
            </Link>
          </div>
        ) : (
          petitions.map((petition: any) => {
            const badge = getStatusBadge(petition.status);
            const isPending = petition.status === 'pending';
            const hasResponse = petition.response;

            return (
              <div key={petition.id}>
                <Link href={`/d/petitions/my/${petition.id}`}>
                  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg text-zinc-800">{petition.title}</h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
                            {badge.label}
                          </span>
                          {hasResponse && (
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              답변 있음
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span><span className="tossface">🔗</span> 동의 {petition.supportCount}명</span>
                      <span><span className="tossface">📅</span> {new Date(petition.createdAt).toLocaleDateString('ko-KR')}</span>
                      {petition.expiresAt && (
                        <span>
                          <span className="tossface">⏰</span> 만료: {new Date(petition.expiresAt).toLocaleDateString('ko-KR')}
                          {new Date(petition.expiresAt) < new Date() && (
                            <span className="text-red-600 font-bold ml-1">(만료됨)</span>
                          )}
                        </span>
                      )}
                    </div>

                    {isPending && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-yellow-700 font-medium">
                          <span className="tossface">⚠️</span> 심사 중에는 공개되지 않습니다.
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
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
