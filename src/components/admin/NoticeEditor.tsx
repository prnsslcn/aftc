"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import {
  createNotice,
  updateNotice,
  addAttachment,
  deleteAttachment,
} from "@/app/admin/(dash)/notices/actions";
import type { AttachmentRow } from "@/lib/db/types";

interface InitialNotice {
  id: string;
  title: string;
  body: string;
  is_published: boolean;
  is_pinned: boolean;
}

/* 공지 작성/편집 폼.
   초기값 (initial) 없으면 create 모드, 있으면 update 모드.
   Update 모드에서만 첨부파일 UI 노출 (create 후 id 필요). */
export function NoticeEditor({
  initial,
  attachments = [],
}: {
  initial?: InitialNotice;
  attachments?: AttachmentRow[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const isEdit = !!initial;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = isEdit
        ? await updateNotice(initial!.id, formData)
        : await createNotice(formData);

      if (!res.ok) {
        setError(res.error);
        return;
      }
      if (!isEdit && "data" in res && res.data) {
        router.push(`/admin/notices/${res.data.id}`);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 text-sm text-white/50">
        <Link href="/admin/notices" className="hover:text-white transition-colors">
          <Icon icon="solar:arrow-left-linear" className="inline text-base mr-1" />
          목록
        </Link>
        <span>/</span>
        <span>{isEdit ? "공지 편집" : "새 공지"}</span>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-xs font-mono uppercase tracking-[.2em] text-white/50 mb-2"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            maxLength={200}
            defaultValue={initial?.title}
            className="w-full bg-white/[.05] border border-white/[.1] rounded-xl px-4 py-3 text-white text-lg font-semibold placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
            placeholder="공지 제목"
          />
        </div>

        <div>
          <label
            htmlFor="body"
            className="block text-xs font-mono uppercase tracking-[.2em] text-white/50 mb-2"
          >
            Body <span className="text-white/30">(Markdown 지원)</span>
          </label>
          <textarea
            id="body"
            name="body"
            required
            rows={16}
            defaultValue={initial?.body}
            className="w-full bg-white/[.05] border border-white/[.1] rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors font-mono text-sm leading-relaxed resize-y"
            placeholder="# 제목&#10;&#10;본문 …&#10;&#10;- 리스트&#10;- 항목&#10;&#10;[링크](https://...)"
          />
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={initial?.is_published}
              className="w-4 h-4 accent-blue-500"
            />
            <span className="text-sm">게시 (공개)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="is_pinned"
              defaultChecked={initial?.is_pinned}
              className="w-4 h-4 accent-emerald-500"
            />
            <span className="text-sm">상단 고정</span>
          </label>
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={pending}
            className="bg-white text-[#0a0a0a] font-bold rounded-full px-6 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {pending ? "저장 중…" : isEdit ? "저장" : "생성"}
          </button>
          <Link
            href="/admin/notices"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            취소
          </Link>
        </div>
      </form>

      {isEdit && (
        <AttachmentPanel noticeId={initial!.id} attachments={attachments} />
      )}
    </div>
  );
}

/* ────────────────────────────────
   첨부파일 패널 (편집 모드 전용)
   ──────────────────────────────── */
function AttachmentPanel({
  noticeId,
  attachments,
}: {
  noticeId: string;
  attachments: AttachmentRow[];
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);

    const fd = new FormData();
    fd.append("file", file);
    const res = await addAttachment(noticeId, fd);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.refresh();
  }

  function onDelete(id: string) {
    if (!confirm("이 첨부를 삭제하시겠습니까?")) return;
    startTransition(async () => {
      const res = await deleteAttachment(id);
      if (!res.ok) alert(res.error);
      router.refresh();
    });
  }

  return (
    <div className="border-t border-white/[.08] pt-8">
      <p className="text-xs font-mono uppercase tracking-[.2em] text-white/50 mb-4">
        Attachments
      </p>

      {attachments.length > 0 && (
        <ul className="mb-4 divide-y divide-white/[.06] border border-white/[.08] rounded-xl overflow-hidden">
          {attachments.map((a) => (
            <li key={a.id} className="flex items-center gap-3 px-4 py-3">
              <Icon
                icon={
                  a.content_type.startsWith("image/")
                    ? "solar:gallery-linear"
                    : "solar:file-text-linear"
                }
                className="text-lg text-white/60 flex-none"
              />
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-0 truncate text-sm hover:underline"
              >
                {a.filename}
              </a>
              <span className="text-xs text-white/40 flex-none">
                {formatBytes(a.size)}
              </span>
              <button
                type="button"
                onClick={() => onDelete(a.id)}
                className="p-1.5 rounded-lg text-white/40 hover:text-red-300 hover:bg-red-500/10 transition-colors flex-none"
                title="삭제"
              >
                <Icon icon="solar:trash-bin-minimalistic-linear" className="text-base" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <label className="inline-flex items-center gap-2 cursor-pointer bg-white/[.05] border border-white/[.1] hover:bg-white/[.08] rounded-full px-4 py-2 text-sm transition-colors">
        <Icon icon="solar:upload-linear" className="text-base" />
        <span>{uploading ? "업로드 중…" : "파일 추가"}</span>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,image/png,image/jpeg,image/jpg,image/webp,image/gif"
          onChange={onFile}
          disabled={uploading}
          className="sr-only"
        />
      </label>
      <p className="mt-2 text-xs text-white/40">
        PDF · 이미지, 최대 20MB
      </p>

      {error && (
        <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
