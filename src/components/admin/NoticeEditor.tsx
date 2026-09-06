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
import {
  MAX_FILE_SIZE,
  MAX_FILE_SIZE_LABEL,
  isAllowedFileType,
} from "@/lib/validation";

interface InitialNotice {
  id: string;
  title: string;
  body: string;
  is_published: boolean;
  is_pinned: boolean;
}

/* 공지 작성/편집 폼.
   초기값 (initial) 없으면 create 모드, 있으면 update 모드.
   Create 모드에서도 첨부 UI 를 노출하되 파일은 클라이언트 state 에 버퍼링 →
   저장 시 create 완료 후 순차 업로드. */
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

  /* Create 모드용 pending files (아직 서버 업로드 안 됨) */
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      if (isEdit) {
        const res = await updateNotice(initial!.id, formData);
        if (!res.ok) {
          setError(res.error);
          return;
        }
        router.refresh();
        return;
      }

      /* Create 모드 — notice 생성 후 pending files 순차 업로드 */
      const res = await createNotice(formData);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      const newId = "data" in res && res.data ? res.data.id : null;
      if (!newId) {
        setError("생성 응답이 잘못됐습니다.");
        return;
      }

      /* 첨부 순차 업로드 */
      for (let i = 0; i < pendingFiles.length; i++) {
        const file = pendingFiles[i];
        setUploadProgress(
          `첨부 업로드 중 (${i + 1}/${pendingFiles.length}) — ${file.name}`
        );
        const fd = new FormData();
        fd.append("file", file);
        const upRes = await addAttachment(newId, fd);
        if (!upRes.ok) {
          setError(`첨부 업로드 실패 (${file.name}): ${upRes.error}`);
          setUploadProgress(null);
          /* 부분 성공: 편집 화면으로 이동 → 사용자가 남은 파일 재시도 가능 */
          router.push(`/admin/notices/${newId}`);
          return;
        }
      }
      setUploadProgress(null);
      /* 성공: 새 탭으로 공개 게시물 열고, 현재 탭은 관리자 목록으로 */
      window.open(`/notices/${newId}`, "_blank", "noopener,noreferrer");
      router.push("/admin/notices");
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

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <IconToggle
            name="is_published"
            defaultChecked={initial ? initial.is_published : true}
            iconOn="solar:eye-bold"
            iconOff="solar:eye-closed-linear"
            tone="blue"
            labelOn="게시"
            labelOff="초안"
          />
          <IconToggle
            name="is_pinned"
            defaultChecked={initial?.is_pinned ?? false}
            iconOn="solar:pin-bold"
            iconOff="solar:pin-linear"
            tone="emerald"
            labelOn="상단 고정"
            labelOff="상단 고정"
          />
        </div>

        {/* 첨부 UI — create/edit 공통 */}
        <AttachmentPanel
          mode={isEdit ? "edit" : "create"}
          noticeId={initial?.id}
          attachments={attachments}
          pendingFiles={pendingFiles}
          setPendingFiles={setPendingFiles}
          setError={setError}
        />

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}
        {uploadProgress && (
          <p className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-200">
            {uploadProgress}
          </p>
        )}

        {!isEdit && pendingFiles.length > 0 && (
          <p className="text-xs text-white/50 leading-relaxed border-l-2 border-blue-500/40 pl-3">
            <span className="text-blue-300 font-medium">게시</span> 버튼을 누르면
            대기 중인 첨부파일 {pendingFiles.length}개가 함께 업로드됩니다.
            업로드 진행률을 확인하세요. 완료되면 새 탭으로 게시물이 열립니다.
          </p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={pending}
            className="bg-white text-[#0a0a0a] font-bold rounded-full px-6 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {pending ? "저장 중…" : isEdit ? "저장" : "게시"}
          </button>
          <Link
            href="/admin/notices"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}

/* ────────────────────────────────
   첨부파일 패널 — create / edit 공통
   ──────────────────────────────── */
function AttachmentPanel({
  mode,
  noticeId,
  attachments,
  pendingFiles,
  setPendingFiles,
  setError,
}: {
  mode: "create" | "edit";
  noticeId?: string;
  attachments: AttachmentRow[];
  pendingFiles: File[];
  setPendingFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setError: (v: string | null) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (!file) return;

    /* 클라이언트 사이드 사전 검증 */
    if (file.size > MAX_FILE_SIZE) {
      setError(`파일 크기가 ${MAX_FILE_SIZE_LABEL} 를 초과합니다.`);
      return;
    }
    if (!isAllowedFileType(file.type)) {
      setError("허용되지 않는 파일 형식입니다 (PDF · 이미지만).");
      return;
    }
    setError(null);

    if (mode === "create") {
      /* pending 큐에 추가 (실제 업로드는 저장 시점) */
      setPendingFiles((prev) => [...prev, file]);
      return;
    }

    /* Edit 모드 — 즉시 서버 업로드 */
    if (!noticeId) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await addAttachment(noticeId, fd);
    setUploading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.refresh();
  }

  function onDeletePending(idx: number) {
    setPendingFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  function onDeleteAttachment(id: string) {
    if (!confirm("이 첨부를 삭제하시겠습니까?")) return;
    startTransition(async () => {
      const res = await deleteAttachment(id);
      if (!res.ok) alert(res.error);
      router.refresh();
    });
  }

  const hasAny = attachments.length > 0 || pendingFiles.length > 0;

  return (
    <div className="border-t border-white/[.08] pt-8">
      <p className="text-xs font-mono uppercase tracking-[.2em] text-white/50 mb-4">
        Attachments {mode === "create" && pendingFiles.length > 0 && (
          <span className="text-white/40 normal-case tracking-normal">
            · 저장 시 업로드
          </span>
        )}
      </p>

      {hasAny && (
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
                onClick={() => onDeleteAttachment(a.id)}
                className="p-1.5 rounded-lg text-white/40 hover:text-red-300 hover:bg-red-500/10 transition-colors flex-none"
                title="삭제"
              >
                <Icon icon="solar:trash-bin-minimalistic-linear" className="text-base" />
              </button>
            </li>
          ))}
          {pendingFiles.map((f, i) => (
            <li key={`pending-${i}`} className="flex items-center gap-3 px-4 py-3 bg-blue-500/[.04]">
              <Icon
                icon={
                  f.type.startsWith("image/")
                    ? "solar:gallery-linear"
                    : "solar:file-text-linear"
                }
                className="text-lg text-blue-300/70 flex-none"
              />
              <span className="flex-1 min-w-0 truncate text-sm text-white/85">
                {f.name}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[.15em] text-blue-300/60 flex-none">
                pending
              </span>
              <span className="text-xs text-white/40 flex-none">
                {formatBytes(f.size)}
              </span>
              <button
                type="button"
                onClick={() => onDeletePending(i)}
                className="p-1.5 rounded-lg text-white/40 hover:text-red-300 hover:bg-red-500/10 transition-colors flex-none"
                title="대기 목록에서 제거"
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
        PDF · 이미지, 최대 {MAX_FILE_SIZE_LABEL}
      </p>
    </div>
  );
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

/* ────────────────────────────────
   Icon 토글 — 목록의 pin/eye 스타일과 통일
   숨긴 checkbox + Tailwind `group-has-[input:checked]:` 로 아이콘/색상 스위칭
   ──────────────────────────────── */
function IconToggle({
  name,
  defaultChecked,
  iconOn,
  iconOff,
  tone,
  labelOn,
  labelOff,
}: {
  name: string;
  defaultChecked: boolean;
  iconOn: string;
  iconOff: string;
  tone: "blue" | "emerald";
  labelOn: string;
  labelOff: string;
}) {
  const toneClasses =
    tone === "blue"
      ? "group-has-[input:checked]:text-blue-300 group-has-[input:checked]:bg-blue-500/15 group-has-[input:checked]:ring-blue-500/30"
      : "group-has-[input:checked]:text-emerald-300 group-has-[input:checked]:bg-emerald-500/15 group-has-[input:checked]:ring-emerald-500/30";

  return (
    <label className="group inline-flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="sr-only"
      />
      <span
        className={`grid place-items-center w-9 h-9 rounded-xl transition-colors text-white/40 ring-1 ring-transparent bg-white/[.02] group-hover:text-white/70 group-hover:bg-white/[.06] ${toneClasses}`}
      >
        <Icon
          icon={iconOn}
          className="col-start-1 row-start-1 text-[17px] opacity-0 scale-75 group-has-[input:checked]:opacity-100 group-has-[input:checked]:scale-100 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.65,0,0.35,1)]"
        />
        <Icon
          icon={iconOff}
          className="col-start-1 row-start-1 text-[17px] opacity-100 group-has-[input:checked]:opacity-0 transition-opacity duration-200"
        />
      </span>
      <span className="text-xs font-medium text-white/50 group-hover:text-white/70 group-has-[input:checked]:text-white/85 transition-colors">
        <span className="group-has-[input:checked]:hidden">{labelOff}</span>
        <span className="hidden group-has-[input:checked]:inline">{labelOn}</span>
      </span>
    </label>
  );
}
