"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { resendInquiry, deleteInquiry } from "@/app/admin/(dash)/inquiries/actions";

/* 문의 행/상세 액션 — Google Form 재전달, 삭제 */
export function InquiryActions({ id, forwarded, compact }: { id: string; forwarded: boolean; compact?: boolean }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  function onResend() {
    startTransition(async () => {
      const res = await resendInquiry(id);
      setMessage(res.ok ? "Google Form 으로 전달했습니다." : `실패: ${res.error}`);
      router.refresh();
    });
  }

  function onDelete() {
    if (!confirm("이 문의를 DB 에서 삭제하시겠습니까? Google Form 응답은 영향받지 않습니다.")) return;
    startTransition(async () => {
      await deleteInquiry(id);
      if (compact) router.refresh();
      else router.push("/admin/inquiries");
    });
  }

  return (
    <div className="flex-none flex items-center gap-1">
      {message && !compact && <span className="mr-2 text-xs text-white/60">{message}</span>}
      <button
        type="button"
        disabled={pending}
        onClick={onResend}
        className={`p-2 rounded-lg transition-colors disabled:opacity-40 ${
          forwarded ? "text-white/40 hover:text-white/70 hover:bg-white/[.05]" : "text-amber-300 hover:bg-amber-500/10"
        }`}
        title={forwarded ? "Google Form 으로 다시 전달" : "Google Form 으로 재전달"}
      >
        <Icon icon="solar:refresh-circle-linear" className="text-base" />
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={onDelete}
        className="p-2 rounded-lg text-white/40 hover:text-red-300 hover:bg-red-500/10 transition-colors disabled:opacity-40"
        title="삭제"
      >
        <Icon icon="solar:trash-bin-trash-linear" className="text-base" />
      </button>
    </div>
  );
}
