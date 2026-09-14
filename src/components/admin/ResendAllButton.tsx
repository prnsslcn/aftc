"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { resendAllFailed } from "@/app/admin/(dash)/inquiries/actions";

/* 전달 실패 건 일괄 재전달 버튼 — 목록 헤더. 결과 요약을 옆에 표시 */
export function ResendAllButton({ failedCount }: { failedCount: number }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  if (failedCount === 0) return null;

  function onClick() {
    if (!confirm(`전달 실패 ${failedCount}건을 Google Form 으로 다시 보내시겠습니까?`)) return;
    startTransition(async () => {
      const res = await resendAllFailed();
      setMessage(res.ok ? `전달 ${res.data?.sent ?? 0}건 성공 · ${res.data?.failed ?? 0}건 실패` : `실패: ${res.error}`);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-3">
      {message && <span className="text-xs text-white/60">{message}</span>}
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="rounded-full border border-amber-400/40 px-4 py-1.5 text-sm text-amber-200 transition-colors hover:bg-amber-500/10 disabled:opacity-40"
      >
        {pending ? "재전달 중…" : `실패 ${failedCount}건 일괄 재전달`}
      </button>
    </div>
  );
}
