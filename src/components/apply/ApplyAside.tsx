"use client";

import { motion } from "framer-motion";
import { CONTACT } from "@/lib/constants";
import { blockIn } from "@/lib/motion";

const BLOCK_STYLE = { willChange: "opacity, filter, transform" } as const;

const STEPS = [
  { num: "01", title: "접수", desc: "양식을 작성해 보내 주세요." },
  { num: "02", title: "확인", desc: "담당자가 내용을 검토하고 연락드립니다." },
  { num: "03", title: "상담", desc: "과정 · 일정 · 비용을 안내해 드립니다." },
];

/* 좌측 안내 블록 — 데스크탑에서 sticky. 상담 흐름 3단계 + 연락처 */
export default function ApplyAside() {
  return (
    <aside className="lg:sticky lg:top-32 self-start">
      <motion.p
        className="font-mono uppercase tracking-[.22em] text-xs text-[#0a0a0a]/55"
        style={BLOCK_STYLE}
        {...blockIn(8, "14%", 0.78, 0.5, true)}
      >
        How it works
      </motion.p>

      <div className="mt-6 border-b border-black/[.08]">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.num}
            className="grid grid-cols-[40px_1fr] gap-x-4 py-5 border-t border-black/[.08]"
            style={BLOCK_STYLE}
            {...blockIn(8, "14%", 0.78, 0.6 + i * 0.1, true)}
          >
            <span className="font-mono text-[11px] tracking-[.2em] text-[#0a0a0a]/35 tabular-nums pt-[3px]">{s.num}</span>
            <div>
              <p className="font-medium">{s.title}</p>
              <p className="mt-1 text-sm text-[#0a0a0a]/55 break-keep-all">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div className="mt-10" style={BLOCK_STYLE} {...blockIn(8, "14%", 0.78, 0.95, true)}>
        <p className="font-mono uppercase tracking-[.22em] text-xs text-[#0a0a0a]/55">Contact</p>
        <a
          href={`tel:${CONTACT.phone.replace(/-/g, "")}`}
          className="mt-4 inline-block font-display tracking-[-0.03em] tabular-nums hover:opacity-60 transition-opacity"
          style={{ fontSize: "clamp(1.5rem, 2.4vw, 2rem)", fontWeight: 700, lineHeight: 1 }}
        >
          {CONTACT.phone}
        </a>
        <p className="mt-3 text-sm text-[#0a0a0a]/55 leading-relaxed">
          {CONTACT.location}
          <br />
          {CONTACT.address}
        </p>
      </motion.div>
    </aside>
  );
}
