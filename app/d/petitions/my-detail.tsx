'use client';

import useSWR from "swr";
import Link from "next/link";
import Loading from "@components/loading";

export default function MyPetitionDetail({ id }: { id: string }) {
  const { data, isLoading } = useSWR(`/api/petitions/my/${id}`);

  const petition = data?.petition;

  const getStatusBadge = (status: string) => {
    const badges: any = {
      'pending': { label: '심사중', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      'open': { label: '공개', color: 'bg-green-100 text-green-800', icon: '🔓' },
      'closed': { label: '비공개', color: 'bg-gray-100 text-gray-800', icon: '🔒' },
      'rejected': { label: '반려', color: 'bg-red-100 text-red-800', icon: '❌' }
    };
    return badges[status] || { label: status, color: 'bg-gray-100 text-gray-800', icon: '❓' };
  };

  const getStatusDescription = (status: string) => {
    const descriptions: any = {
      'pending': '심사 결과를 기다려주세요.',
      'open': '공개되었습니다. 다른 학생들이 이 청원을 볼 수 있습니다.',
      'closed': '비공개되었습니다. 당신과 관리자만 이 청원을 볼 수 있습니다.',
      'rejected': '관리자가 이 청원을 반려했습니다. 반려 사유를 확인하세요.'
    };
    return descriptions[status] || '상태를 알 수 없습니다.';
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex justify-center my-52 text-teal-500">
          <Loading size={35} />
        </div>
      </div>
    );
  }

  if (!petition) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">청원을 찾을 수 없습니다.</div>
      </div>
    );
  }

  const badge = getStatusBadge(petition.status);
  const hasResponse = petition.response;
  const isPending = petition.status === 'pending';

  return (
    <div className="w-full">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold text-zinc-800">{petition.title}</h1>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-bold ${badge.color}`}>
          <span className="tossface">{badge.icon}</span> {badge.label}
        </span>
        <p className="text-gray-600 text-base mb-4 mt-5">{getStatusDescription(petition.status)}</p>
        <div className="flex items-center gap-6 text-gray-600">
          <div><span className="tossface">🔗</span> 동의 {petition.supportCount}명</div>
          <div><span className="tossface">📅</span> {new Date(petition.createdAt).toLocaleDateString('ko-KR')}</div>
          {petition.expiresAt && (
            <div>
              <span className="tossface">⏰</span> 만료: {new Date(petition.expiresAt).toLocaleDateString('ko-KR')}
              {new Date(petition.expiresAt) < new Date() && (
                <span className="text-red-600 font-bold ml-2">(만료됨)</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 상태 안내 */}
      {isPending && (
        <div className="bg-yellow-50 rounded-lg p-5 mb-8">
          <p className="text-yellow-900 font-semibold">
            이 청원은 현재 심사 중입니다.
          </p>
          <p className="text-yellow-800 mt-2">
            심사가 완료되기 전까지는 다른 학생들에게 공개되지 않습니다.
          </p>
        </div>
      )}

      {petition.status === 'rejected' && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 mb-8">
          <p className="text-red-900 font-semibold">
            <span className="tossface">❌</span> 이 청원은 반려되었습니다.
          </p>
          <p className="text-red-800 mt-2">
            관리자가 이 청원을 승인하지 않았습니다. 자세한 내용은 학교 관리자에게 문의해주세요.
          </p>
        </div>
      )}

      {/* 청원 내용 */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-zinc-800 mb-3">청원 이유</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{petition.reason}</p>
        </div>

        <hr className="my-6" />

        <div>
          <h2 className="text-lg font-bold text-zinc-800 mb-3">청원 내용</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{petition.content}</p>
        </div>
      </div>

      {/* 답변 섹션 */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-8">
        <h2 className="text-lg font-bold text-zinc-800 mb-6">답변</h2>

        {hasResponse ? (
          <div>
            <div className="bg-blue-50 rounded-lg p-5 mb-4">
              <div className="text-sm text-gray-600 mb-2">
                <strong>학생회 청원부</strong>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{petition.response}</p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <p className="text-gray-600">아직 답변이 없습니다.</p>
            {isPending && (
              <p className="text-gray-500 text-sm mt-2">심사 완료 후 답변이 등록될 예정입니다.</p>
            )}
            {petition.status === 'open' && (
              <p className="text-gray-500 text-sm mt-2">답변이 등록될 때까지 기다려주세요.</p>
            )}
          </div>
        )}
      </div>

      {/* 안내 메시지 */}
      <div className="bg-teal-50 rounded-lg p-5">
        <h3 className="font-bold text-teal-900 mb-2">도움말</h3>
        <ul className="text-teal-800 text-sm space-y-1">
          <li>• 심사 중인 청원은 다른 학생들에게 보이지 않습니다.</li>
          <li>• 공개된 청원은 모든 학생들이 동의할 수 있습니다.</li>
          <li>• 비공개 청원은 나과 관리자만 볼 수 있습니다.</li>
          <li>• 청원이 반려되면 다시 작성해서 올릴 수 있습니다.</li>
          <li>• <strong>공개/비공개 전환 및 반려는 관리자만 처리 가능합니다.</strong></li>
        </ul>
      </div>
    </div>
  );
}
