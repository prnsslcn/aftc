import Link from "next/link";
import type { Metadata } from "next";
import { sql } from "@/lib/db/client";
import type { NoticeSummary } from "@/lib/db/types";

export const metadata: Metadata = {
  title: "공지사항",
  description: "ABC 비행교육원 공지사항.",
};

export const revalidate = 60; // 1분 캐시

/* 공개 공지 목록 — 게시된 것만, 핀 우선 + 게시일 내림차순 */
export default async function NoticesPage() {
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
    WHERE n.is_published = TRUE
    GROUP BY n.id
    ORDER BY n.is_pinned DESC, n.published_at DESC NULLS LAST
  `;

  return (
    <main data-nav-theme="dark" className="min-h-[100dvh] bg-[#0a0a0a] text-white px-6 md:px-10 lg:px-16 pt-32 pb-24">
      <div className="mx-auto max-w-4xl">
        {/* 헤드라인 — pipeline "Integrated Pilot Program" 과 동일 타이포 (Outfit 800) + 한글 서브 */}
        <div className="mb-14">
          <h1
            className="font-display tracking-[-0.045em]"
            style={{ fontSize: "clamp(2.25rem, 5.5vw, 5rem)", fontWeight: 800, lineHeight: 0.95 }}
          >
            Notices
          </h1>
          <p className="mt-4 font-medium text-white/60" style={{ fontSize: "clamp(1rem, 1.3vw, 1.25rem)" }}>
            공지사항
          </p>
        </div>

        {rows.length === 0 ? (
          <p className="text-white/50 border border-white/[.08] rounded-2xl py-24 text-center">
            등록된 공지가 없습니다.
          </p>
        ) : (
          <ul className="divide-y divide-white/[.08] border-t border-b border-white/[.08]">
            {rows.map((n) => (
              <li key={n.id}>
                <Link
                  href={`/notices/${n.id}`}
                  className="flex items-center gap-4 py-5 md:py-6 group hover:bg-white/[.02] px-2 -mx-2 rounded-lg transition-colors"
                >
                  {n.is_pinned && (
                    <span className="flex-none text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-medium">
                      Pinned
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-lg md:text-xl truncate group-hover:text-white">
                      {n.title}
                    </h2>
                    {n.attachment_count > 0 && (
                      <span className="text-xs text-white/45 mt-1 inline-block">
                        📎 첨부 {n.attachment_count}
                      </span>
                    )}
                  </div>
                  <time className="flex-none text-xs md:text-sm text-white/45 font-mono">
                    {formatDate(n.published_at ?? n.created_at)}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}
