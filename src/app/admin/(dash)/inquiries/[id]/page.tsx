import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db/client";
import type { InquiryRow } from "@/lib/db/types";
import { InquiryActions } from "@/components/admin/InquiryActions";
import { formatDateTime } from "@/lib/admin-format";

/* 문의 상세 — 9개 항목 전체 + 전달 로그 + 재전달/삭제 */
export default async function AdminInquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { rows } = await sql<InquiryRow>`SELECT * FROM inquiries WHERE id = ${id} LIMIT 1`;
  const r = rows[0];
  if (!r) notFound();

  const fields: { label: string; value: string | null }[] = [
    { label: "이름", value: r.name },
    { label: "연락처", value: r.phone },
    { label: "이메일", value: r.email },
    { label: "현재 상태", value: r.status },
    { label: "해외 비행유학 계획", value: r.plan },
    { label: "희망 비행학교 및 희망 과정", value: r.schools.join(" · ") },
    { label: "영어 수준", value: r.english },
    { label: "조종 관련 경험", value: r.experience },
    { label: "문의사항", value: r.inquiry },
  ];

  return (
    <section className="max-w-3xl">
      <Link href="/admin/inquiries" className="text-sm text-white/50 hover:text-white transition-colors">
        ← 문의 목록
      </Link>

      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-white/45 font-mono uppercase tracking-[.22em] text-xs mb-2">Inquiry</p>
          <h1 className="font-display font-black text-3xl tracking-[-0.02em]">{r.name}</h1>
          <p className="mt-2 text-sm text-white/60 font-mono tabular-nums">
            {formatDateTime(r.created_at)}
            {r.ip && <span className="ml-3 text-white/35">IP {r.ip}</span>}
          </p>
        </div>
        <InquiryActions id={r.id} forwarded={r.forwarded} />
      </div>

      {/* 전달 상태 */}
      <div
        className={`mt-8 rounded-2xl border px-5 py-4 text-sm ${
          r.forwarded ? "border-emerald-500/25 bg-emerald-500/[.06] text-emerald-200" : "border-red-500/25 bg-red-500/[.06] text-red-200"
        }`}
      >
        <p className="font-semibold">{r.forwarded ? "Google Form 전달됨" : "Google Form 전달 실패"}</p>
        {!r.forwarded && (
          <p className="mt-1 text-red-200/80 break-all">{r.forward_error ?? "사유 미기록"}</p>
        )}
        {!r.forwarded && (
          <p className="mt-2 text-white/50">
            폼 설정을 고친 뒤 우측 상단 재전달 버튼으로 다시 보낼 수 있습니다. DB 에는 이미 저장되어 있습니다.
          </p>
        )}
      </div>

      <dl className="mt-8 divide-y divide-white/[.08] border-y border-white/[.08]">
        {fields.map((f) => (
          <div key={f.label} className="grid grid-cols-[160px_1fr] gap-4 py-4">
            <dt className="text-sm text-white/45">{f.label}</dt>
            <dd className="text-sm whitespace-pre-wrap break-keep-all">
              {f.value && f.value.trim() ? f.value : <span className="text-white/25">—</span>}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
