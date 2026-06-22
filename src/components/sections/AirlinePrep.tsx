'use client';

import { useRef } from 'react';
import { Icon } from "@iconify/react";
import { motion, useInView } from "framer-motion";
import { AIRLINE_PREP } from "@/lib/constants";

const ACCENT = "#467ee9";

function RevealBlock({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.65, 0, 0.35, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══ Hero — 원본 콘텐츠 그대로, Parker 풍 타이포만 적용 ═══ */
function Hero() {
  return (
    <div className="max-w-[80rem] mx-auto">
      <RevealBlock>
        <p className="font-mono text-[11px] uppercase tracking-[.28em] opacity-50 mb-6">
          Airline Career Preparation
        </p>
      </RevealBlock>
      <RevealBlock delay={0.08}>
        <h2
          className="tracking-[-0.05em]"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', lineHeight: 1.02, fontWeight: 800 }}
        >
          항공사 입사과정 교육
        </h2>
      </RevealBlock>
      <RevealBlock delay={0.16}>
        <p
          className="mt-8 opacity-55 leading-relaxed max-w-[60ch]"
          style={{ fontSize: 'clamp(1.0625rem, 1.5vw, 1.375rem)' }}
        >
          비행훈련 이후 항공사 입사를 위한 실전 중심 교육 단계입니다.
          강의부터 1:1 코칭, 모의고사, 면접 컨설팅·모의면접까지
          항공사 입사 전형 전과정을 체계적으로 준비합니다.
        </p>
      </RevealBlock>
    </div>
  );
}

/* ═══ Stat strip — 데이터에서 직접 도출된 값만 (sub-text 없음) ═══ */
const STATS = [
  { value: String(AIRLINE_PREP.programs.length), label: "Programs" },
  { value: String(AIRLINE_PREP.highlights.length), label: "Highlights" },
  { value: "1:1", label: "Coaching" },
  { value: "전·현직", label: "Examiners" },
];

function StatStrip() {
  return (
    <div className="max-w-[80rem] mx-auto mt-20 md:mt-28">
      <div className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-black/[.1]">
        {STATS.map((s, i) => (
          <RevealBlock key={s.label} delay={0.04 * i}>
            <div
              className={`py-10 md:py-12 px-5 md:px-7 h-full ${
                i < STATS.length - 1 ? "md:border-r border-black/[.08]" : ""
              } ${i < 2 ? "border-b md:border-b-0 border-black/[.08]" : ""}`}
            >
              <p
                className="tracking-[-0.045em] tabular-nums"
                style={{
                  fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                  fontWeight: 700,
                  lineHeight: 0.95,
                }}
              >
                {s.value}
              </p>
              <p className="mt-3 font-mono text-[11.5px] uppercase tracking-[.28em] opacity-55">
                {s.label}
              </p>
            </div>
          </RevealBlock>
        ))}
      </div>
    </div>
  );
}

/* ═══ Programs editorial — 원본 데이터만, minimal block ═══ */
function ProgramsEditorial() {
  return (
    <div className="max-w-[80rem] mx-auto mt-24 md:mt-32">
      <RevealBlock>
        <div className="flex items-baseline gap-3 mb-10 md:mb-14">
          <span
            className="font-mono text-[11px] tabular-nums tracking-[.15em]"
            style={{ color: ACCENT }}
          >
            {String(AIRLINE_PREP.programs.length).padStart(2, "0")}
          </span>
          <span className="h-px w-8" style={{ background: ACCENT, opacity: 0.5 }} aria-hidden="true" />
          <p
            className="font-mono text-[10.5px] uppercase tracking-[.28em]"
            style={{ color: ACCENT }}
          >
            Programs
          </p>
        </div>
      </RevealBlock>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 md:gap-x-20 gap-y-0 border-t border-black/[.1]">
        {AIRLINE_PREP.programs.map((p, i) => (
          <RevealBlock key={p.title} delay={0.04 * i}>
            <div className="group py-8 md:py-10 border-b border-black/[.08] h-full">
              <div className="flex items-start justify-between gap-6">
                <span className="font-mono text-[11px] tabular-nums tracking-[.15em] opacity-40">
                  {String(i + 1).padStart(2, "0")} / {String(AIRLINE_PREP.programs.length).padStart(2, "0")}
                </span>
                <Icon
                  icon={p.icon}
                  className="text-xl opacity-20 group-hover:opacity-55 transition-opacity flex-shrink-0"
                />
              </div>
              <h4
                className="mt-5 tracking-[-0.02em]"
                style={{
                  fontSize: "clamp(1.5rem, 2.2vw, 2.125rem)",
                  fontWeight: 800,
                  lineHeight: 1.2,
                }}
              >
                {p.title}
              </h4>
              <p
                className="mt-3 opacity-55 max-w-[44ch]"
                style={{ fontSize: "clamp(0.975rem, 1.1vw, 1.0625rem)", lineHeight: 1.65 }}
              >
                {p.desc}
              </p>
            </div>
          </RevealBlock>
        ))}
      </div>
    </div>
  );
}

/* ═══ Highlights — 원본 데이터만, minimal 3-block ═══ */
function Highlights() {
  return (
    <div className="max-w-[80rem] mx-auto mt-24 md:mt-32">
      <RevealBlock>
        <div className="flex items-baseline gap-3 mb-10 md:mb-14">
          <span className="font-mono text-[11px] tabular-nums tracking-[.15em] opacity-55">
            {String(AIRLINE_PREP.highlights.length).padStart(2, "0")}
          </span>
          <span className="h-px w-8 bg-black/[.3]" aria-hidden="true" />
          <p className="font-mono text-[10.5px] uppercase tracking-[.28em] opacity-55">
            Highlights
          </p>
        </div>
      </RevealBlock>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
        {AIRLINE_PREP.highlights.map((h, i) => (
          <RevealBlock key={h.title} delay={0.08 * i}>
            <div className="h-full">
              <Icon icon={h.icon} className="text-3xl" style={{ color: ACCENT }} />
              <h4
                className="mt-6 tracking-[-0.02em]"
                style={{
                  fontSize: "clamp(1.375rem, 1.9vw, 1.875rem)",
                  fontWeight: 800,
                  lineHeight: 1.25,
                }}
              >
                {h.title}
              </h4>
              <p
                className="mt-3 opacity-55 leading-relaxed max-w-[38ch]"
                style={{ fontSize: "clamp(0.975rem, 1.1vw, 1.0625rem)" }}
              >
                {h.desc}
              </p>
            </div>
          </RevealBlock>
        ))}
      </div>
    </div>
  );
}

/* ═══ Transition (medium 강조) + Cost (작은 footnote) + Benefit (작은 pill) ═══ */
function BenefitClosing() {
  return (
    <div className="max-w-[80rem] mx-auto mt-24 md:mt-32">
      {/* Callout box — 비용 + Transition 안내 한 박스에 (비용 먼저) */}
      <RevealBlock>
        <div className="rounded-2xl border border-black/[.08] bg-white px-6 md:px-7 py-6 md:py-7 flex items-start gap-3">
          <Icon
            icon="solar:info-circle-bold"
            className="text-2xl flex-shrink-0 mt-0.5"
            style={{ color: ACCENT }}
          />
          <div className="flex-1 min-w-0 space-y-3">
            <p
              className="opacity-75 leading-relaxed"
              style={{ fontSize: "clamp(1.0625rem, 1.3vw, 1.25rem)", fontWeight: 600 }}
            >
              패키지 비용: {AIRLINE_PREP.cost.value} ({AIRLINE_PREP.cost.note})
            </p>
            <p
              className="opacity-75 leading-relaxed"
              style={{ fontSize: "clamp(1.0625rem, 1.3vw, 1.25rem)" }}
            >
              {AIRLINE_PREP.transitionNote}
            </p>
          </div>
        </div>
      </RevealBlock>

      {/* Benefit — 콤팩트 다크 pill 형태. 위 여백 충분히 */}
      <RevealBlock delay={0.16}>
        <div className="mt-14 md:mt-20 rounded-2xl bg-[#0a0a0a] text-white p-6 md:p-8 flex items-center gap-5 md:gap-7">
          <Icon
            icon="solar:cup-hot-bold"
            className="text-3xl md:text-4xl text-amber-400 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-[.28em] text-amber-300/80 mb-1.5">
              Benefit
            </p>
            <p className="text-lg md:text-xl font-semibold tracking-[-0.01em]">
              {AIRLINE_PREP.benefit.title}{" "}
              <span className="text-white/55 font-normal">— {AIRLINE_PREP.benefit.desc}</span>
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={AIRLINE_PREP.benefit.image}
            alt={AIRLINE_PREP.benefit.title}
            className="hidden md:block w-[96px] h-auto object-contain select-none flex-shrink-0"
          />
        </div>
      </RevealBlock>
    </div>
  );
}

/* ═══ 메인 ═══ */
export default function AirlinePrep() {
  return (
    <section
      id="airline-prep"
      className="py-[clamp(5rem,8vw,9rem)] px-[clamp(0.5rem,5vw,7.75rem)] bg-[#fafaf8]"
    >
      <Hero />
      <StatStrip />
      <ProgramsEditorial />
      <Highlights />
      <BenefitClosing />
    </section>
  );
}
