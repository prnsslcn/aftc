"use server";

import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";
import { sql } from "@/lib/db/client";
import { requireRole } from "@/lib/auth/session";
import {
  noticeSchema,
  isAllowedFileType,
  MAX_FILE_SIZE,
  type ActionResult,
} from "@/lib/validation";
import type { NoticeRow, AttachmentRow } from "@/lib/db/types";

/* 공통 가드 */
async function guard(): Promise<{ ok: true; sub: string } | { ok: false; error: string }> {
  const session = await requireRole("admin");
  if (!session) return { ok: false, error: "권한이 없습니다." };
  return { ok: true, sub: session.sub };
}

function revalidateAll() {
  revalidatePath("/admin/notices");
  revalidatePath("/notices");
}

/* ────────────────────────────────
   생성 / 수정 / 삭제
   ──────────────────────────────── */

export async function createNotice(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const g = await guard();
  if (!g.ok) return g;

  const parsed = noticeSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    is_published: formData.get("is_published") === "on",
    is_pinned: formData.get("is_pinned") === "on",
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "입력값 오류" };
  }

  const { title, body, is_published, is_pinned } = parsed.data;
  const publishedAt = is_published ? new Date().toISOString() : null;

  const res = await sql<{ id: string }>`
    INSERT INTO notices (title, body, is_published, is_pinned, published_at, author_id)
    VALUES (${title}, ${body}, ${is_published}, ${is_pinned}, ${publishedAt}, ${g.sub})
    RETURNING id
  `;

  revalidateAll();
  return { ok: true, data: { id: res.rows[0].id } };
}

export async function updateNotice(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const g = await guard();
  if (!g.ok) return g;

  const parsed = noticeSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    is_published: formData.get("is_published") === "on",
    is_pinned: formData.get("is_pinned") === "on",
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "입력값 오류" };
  }

  const { title, body, is_published, is_pinned } = parsed.data;

  /* published_at: 초안 → 게시로 처음 전환될 때만 세팅. 이미 게시된 것은 유지. */
  const current = await sql<Pick<NoticeRow, "is_published" | "published_at">>`
    SELECT is_published, published_at FROM notices WHERE id = ${id} LIMIT 1
  `;
  const row = current.rows[0];
  if (!row) return { ok: false, error: "공지를 찾을 수 없습니다." };

  const nextPublishedAt =
    is_published && !row.is_published
      ? new Date().toISOString()
      : is_published
        ? row.published_at
        : null;

  await sql`
    UPDATE notices
    SET title = ${title},
        body = ${body},
        is_published = ${is_published},
        is_pinned = ${is_pinned},
        published_at = ${nextPublishedAt}
    WHERE id = ${id}
  `;

  revalidateAll();
  revalidatePath(`/notices/${id}`);
  return { ok: true };
}

export async function deleteNotice(id: string): Promise<ActionResult> {
  const g = await guard();
  if (!g.ok) return g;

  /* 첨부파일 blob 삭제 (DB 는 CASCADE) */
  const atts = await sql<Pick<AttachmentRow, "url">>`
    SELECT url FROM attachments WHERE notice_id = ${id}
  `;
  await Promise.all(
    atts.rows.map((a) => del(a.url).catch(() => null))
  );

  await sql`DELETE FROM notices WHERE id = ${id}`;
  revalidateAll();
  return { ok: true };
}

/* ────────────────────────────────
   토글 (published, pinned)
   ──────────────────────────────── */

export async function togglePublished(id: string): Promise<ActionResult> {
  const g = await guard();
  if (!g.ok) return g;
  await sql`
    UPDATE notices
    SET is_published = NOT is_published,
        published_at = CASE
          WHEN NOT is_published THEN NOW()   -- 초안 → 게시
          ELSE NULL                          -- 게시 → 초안
        END
    WHERE id = ${id}
  `;
  revalidateAll();
  return { ok: true };
}

export async function togglePinned(id: string): Promise<ActionResult> {
  const g = await guard();
  if (!g.ok) return g;
  await sql`UPDATE notices SET is_pinned = NOT is_pinned WHERE id = ${id}`;
  revalidateAll();
  return { ok: true };
}

/* ────────────────────────────────
   첨부파일
   ──────────────────────────────── */

export async function addAttachment(
  noticeId: string,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const g = await guard();
  if (!g.ok) return g;

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "파일이 없습니다." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { ok: false, error: "파일 크기가 20MB 를 초과합니다." };
  }
  if (!isAllowedFileType(file.type)) {
    return { ok: false, error: "허용되지 않는 파일 형식입니다 (PDF · 이미지만)." };
  }

  /* Vercel Blob 업로드 — filename 은 collision 방지 위해 uuid 접두 */
  const blob = await put(`notices/${noticeId}/${crypto.randomUUID()}-${file.name}`, file, {
    access: "public",
    contentType: file.type,
    addRandomSuffix: false,
  });

  const res = await sql<{ id: string }>`
    INSERT INTO attachments (notice_id, filename, url, content_type, size)
    VALUES (${noticeId}, ${file.name}, ${blob.url}, ${file.type}, ${file.size})
    RETURNING id
  `;

  revalidateAll();
  revalidatePath(`/notices/${noticeId}`);
  revalidatePath(`/admin/notices/${noticeId}`);
  return { ok: true, data: { id: res.rows[0].id } };
}

export async function deleteAttachment(id: string): Promise<ActionResult> {
  const g = await guard();
  if (!g.ok) return g;

  const res = await sql<Pick<AttachmentRow, "url" | "notice_id">>`
    SELECT url, notice_id FROM attachments WHERE id = ${id} LIMIT 1
  `;
  const row = res.rows[0];
  if (!row) return { ok: false, error: "첨부를 찾을 수 없습니다." };

  await del(row.url).catch(() => null);
  await sql`DELETE FROM attachments WHERE id = ${id}`;

  revalidateAll();
  revalidatePath(`/notices/${row.notice_id}`);
  revalidatePath(`/admin/notices/${row.notice_id}`);
  return { ok: true };
}
