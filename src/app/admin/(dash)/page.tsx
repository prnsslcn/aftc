import Link from "next/link";
import { Icon } from "@iconify/react";
import { sql } from "@/lib/db/client";
import { ADMIN_SECTIONS } from "@/lib/admin-sections";

/* 관리자 대시보드 (/admin) — 로그인 랜딩. 섹션별 카드 그리드 + 핵심 수치.
   카드 목록은 lib/admin-sections, 수치는 섹션 key 별로 여기서 조회. */
export default async function AdminDashboardPage() {
  const [noticeRes, inquiryRes] = await Promise.all([
    sql<{ total: number; published: number; drafts: number }>`
      SELECT COUNT(*)::int AS total,
             COUNT(*) FILTER (WHERE is_published)::int AS published,
             COUNT(*) FILTER (WHERE NOT is_published)::int AS drafts
      FROM notices
    `,
    sql<{ total: number; failed: number; week: number }>`
      SELECT COUNT(*)::int AS total,
             COUNT(*) FILTER (WHERE NOT forwarded)::int AS failed,
             COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')::int AS week
      FROM inquiries
    `,
  ]);
  const n = noticeRes.rows[0] ?? { total: 0, published: 0, drafts: 0 };
  const q = inquiryRes.rows[0] ?? { total: 0, failed: 0, week: 0 };

  const stats: Record<string, { label: string; value: number; warn?: boolean }[]> = {
    notices: [
      { label: "전체", value: n.total },
      { label: "게시", value: n.published },
      { label: "초안", value: n.drafts },
    ],
    inquiries: [
      { label: "전체", value: q.total },
      { label: "최근 7일", value: q.week },
      { label: "전달 실패", value: q.failed, warn: q.failed > 0 },
    ],
  };

  return (
    <section>
      <div className="mb-8">
        <h1 className="font-display font-bold text-5xl md:text-6xl tracking-[-0.03em]">Dashboard</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ADMIN_SECTIONS.map((s) => (
          <Link
            key={s.key}
            href={s.href}
            className="group rounded-2xl border border-white/[.08] bg-white/[.03] p-6 transition-colors hover:border-white/20 hover:bg-white/[.05]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[.22em] text-white/40">{s.eyebrow}</p>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em]">{s.label}</h2>
              </div>
              <Icon icon={s.icon} className="text-2xl text-white/40 transition-colors group-hover:text-white/80" />
            </div>
            <p className="mt-3 text-sm text-white/55 break-keep-all">{s.description}</p>
            {stats[s.key] && (
              <dl className="mt-6 grid grid-cols-3 gap-2 border-t border-white/[.08] pt-5">
                {stats[s.key].map((st) => (
                  <div key={st.label}>
                    <dt className="text-[11px] text-white/45">{st.label}</dt>
                    <dd className={`mt-1 font-display text-2xl font-bold tabular-nums ${st.warn ? "text-red-300" : ""}`}>
                      {st.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            <p className="mt-6 text-sm text-white/50 transition-colors group-hover:text-white">바로가기 →</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
