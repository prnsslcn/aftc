/* Postgres 테이블 → TypeScript 타입. 수동 관리 (codegen 없음). */

export interface AdminRow {
  id: string; // uuid
  email: string;
  password_hash: string;
  name: string;
  created_at: string; // ISO
}

export interface NoticeRow {
  id: string; // uuid
  title: string;
  body: string; // markdown source
  is_published: boolean;
  is_pinned: boolean;
  published_at: string | null; // ISO — 게시 시점 (재정렬 기준)
  created_at: string;
  updated_at: string;
  author_id: string | null; // admin.id
}

export interface AttachmentRow {
  id: string; // uuid
  notice_id: string;
  filename: string; // 원본 파일명 (다운로드 시 표시)
  url: string; // Vercel Blob public URL
  content_type: string; // MIME
  size: number; // bytes
  created_at: string;
}

export interface LoginAttemptRow {
  id: string;
  identifier: string;
  ip: string | null;
  success: boolean;
  attempted_at: string;
}

/* 목록 페이지에서 쓸 요약 뷰 — attachment 개수만 포함 */
export interface NoticeSummary
  extends Pick<
    NoticeRow,
    | "id"
    | "title"
    | "is_published"
    | "is_pinned"
    | "published_at"
    | "created_at"
    | "updated_at"
  > {
  attachment_count: number;
}
