"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import {
  togglePublished,
  togglePinned,
  deleteNotice,
} from "@/app/admin/(dash)/notices/actions";

/* 목록 행의 인라인 액션 버튼들 (pin, publish, delete) */
export function NoticeListActions({
  id,
  isPublished,
  isPinned,
}: {
  id: string;
  isPublished: boolean;
  isPinned: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function run(fn: () => Promise<unknown>) {
    startTransition(async () => {
      await fn();
      router.refresh();
    });
  }

  function onDelete() {
    if (!confirm("이 공지를 삭제하시겠습니까? 첨부파일도 함께 삭제됩니다.")) return;
    run(() => deleteNotice(id));
  }

  return (
    <div className="flex-none flex items-center gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={() => run(() => togglePinned(id))}
        className={`p-2 rounded-lg transition-colors ${
          isPinned
            ? "text-emerald-300 hover:bg-emerald-500/10"
            : "text-white/40 hover:text-white/70 hover:bg-white/[.05]"
        } disabled:opacity-40`}
        title={isPinned ? "핀 해제" : "핀 고정"}
      >
        <Icon icon="solar:pin-bold" className="text-base" />
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => run(() => togglePublished(id))}
        className={`p-2 rounded-lg transition-colors ${
          isPublished
            ? "text-blue-300 hover:bg-blue-500/10"
            : "text-white/40 hover:text-white/70 hover:bg-white/[.05]"
        } disabled:opacity-40`}
        title={isPublished ? "초안으로" : "게시"}
      >
        <Icon
          icon={isPublished ? "solar:eye-bold" : "solar:eye-closed-linear"}
          className="text-base"
        />
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={onDelete}
        className="p-2 rounded-lg text-white/40 hover:text-red-300 hover:bg-red-500/10 transition-colors disabled:opacity-40"
        title="삭제"
      >
        <Icon icon="solar:trash-bin-minimalistic-linear" className="text-base" />
      </button>
    </div>
  );
}
