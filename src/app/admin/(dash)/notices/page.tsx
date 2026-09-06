import Link from "next/link";
import { sql } from "@/lib/db/client";
import type { NoticeSummary } from "@/lib/db/types";
import { NoticeListActions } from "@/components/admin/NoticeListActions";

/* 관리자 공지 목록 — 초안 포함 전체 표시, 최신순 */
export default async function AdminNoticesPage() {
  const { rows } = await sql<NoticeSummary>`
    SELECT
      n.id,
      n.title,
      n.is_published,
      n.is_pinned,
      n.published_at,
      n.created_at,
      n.updated_at,
      COUNT(a.id)::int AS attachment_count
    FROM notices n
    LEFT JOIN attachments a ON a.notice_id = n.id
    GROUP BY n.id
    ORDER BY n.is_pinned DESC, COALESCE(n.published_at, n.created_at) DESC
  `;

  return (
    <section>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-white/45 font-mono uppercase tracking-[.22em] text-xs mb-2">
            Notices
          </p>
          <h1 className="font-display font-black text-3xl tracking-[-0.02em]">
            공지사항 관리
          </h1>
          <p className="mt-2 text-sm text-white/60">
            {rows.length} 건 · 초안 포함
          </p>
        </div>
        <Link
          href="/admin/notices/new"
          className="bg-white text-[#0a0a0a] font-semibold rounded-full px-5 py-2.5 text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          + 새 공지
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="text-white/50 border border-white/[.08] rounded-2xl py-16 text-center">
          아직 등록된 공지가 없습니다.
        </p>
      ) : (
        <ul className="divide-y divide-white/[.08] border border-white/[.08] rounded-2xl overflow-hidden">
          {rows.map((n) => (
            <li key={n.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[.03] transition-colors">
              <div className="flex-none flex items-center gap-1.5 text-xs">
                {n.is_pinned && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-medium">
                    Pinned
                  </span>
                )}
                {n.is_published ? (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 font-medium">
                    게시
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-white/[.08] text-white/60 font-medium">
                    초안
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/admin/notices/${n.id}`}
                  className="block truncate font-semibold hover:underline"
                >
                  {n.title}
                </Link>
                <div className="mt-1 flex items-center gap-3 text-xs text-white/45">
                  <span>
                    {n.is_published && n.published_at
                      ? formatDate(n.published_at) + " 게시"
                      : formatDate(n.created_at) + " 작성"}
                  </span>
                  {n.attachment_count > 0 && (
                    <span>📎 {n.attachment_count}</span>
                  )}
                </div>
              </div>
              <NoticeListActions
                id={n.id}
                isPublished={n.is_published}
                isPinned={n.is_pinned}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}
