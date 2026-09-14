import Link from "next/link";
import { sql } from "@/lib/db/client";
import type { InquiryRow } from "@/lib/db/types";
import { InquiryActions } from "@/components/admin/InquiryActions";
import { formatDateTime } from "@/lib/admin-format";

/* 관리자 문의 목록 — 실운영 확인·검증용. 최신순, Google 전달 실패 건 강조. ?filter=failed 로 실패만 */
export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const failedOnly = filter === "failed";

  const [listRes, statRes] = await Promise.all([
    failedOnly
      ? sql<InquiryRow>`SELECT * FROM inquiries WHERE forwarded = FALSE ORDER BY created_at DESC LIMIT 200`
      : sql<InquiryRow>`SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 200`,
    sql<{ total: number; failed: number }>`
      SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE forwarded = FALSE)::int AS failed FROM inquiries
    `,
  ]);
  const rows = listRes.rows;
  const stat = statRes.rows[0] ?? { total: 0, failed: 0 };

  return (
    <section>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-white/45 font-mono uppercase tracking-[.22em] text-xs mb-2">Inquiries</p>
          <h1 className="font-display font-black text-3xl tracking-[-0.02em]">문의 접수 현황</h1>
          <p className="mt-2 text-sm text-white/60">
            총 {stat.total} 건 · Google Form 전달 실패 {stat.failed} 건
          </p>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <FilterTab href="/admin/inquiries" active={!failedOnly}>
            전체
          </FilterTab>
          <FilterTab href="/admin/inquiries?filter=failed" active={failedOnly}>
            전달 실패
          </FilterTab>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="text-white/50 border border-white/[.08] rounded-2xl py-16 text-center">
          {failedOnly ? "전달 실패한 문의가 없습니다." : "아직 접수된 문의가 없습니다."}
        </p>
      ) : (
        <ul className="divide-y divide-white/[.08] border border-white/[.08] rounded-2xl overflow-hidden">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[.03] transition-colors">
              <div className="flex-none w-[88px]">
                {r.forwarded ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-medium">
                    전달됨
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-300 text-xs font-medium">
                    전달 실패
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/admin/inquiries/${r.id}`} className="block truncate font-semibold hover:underline">
                  {r.name}
                  <span className="ml-2 font-normal text-white/50">{r.phone}</span>
                </Link>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-white/45">
                  <span className="font-mono tabular-nums">{formatDateTime(r.created_at)}</span>
                  <span className="truncate">{r.schools.join(" · ")}</span>
                  {!r.forwarded && r.forward_error && (
                    <span className="text-red-300/80 truncate">{r.forward_error}</span>
                  )}
                </div>
              </div>
              <InquiryActions id={r.id} forwarded={r.forwarded} compact />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function FilterTab({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`px-3.5 py-1.5 rounded-full transition-colors ${
        active ? "bg-white text-[#0a0a0a] font-semibold" : "text-white/60 hover:text-white hover:bg-white/[.06]"
      }`}
    >
      {children}
    </Link>
  );
}
