'use client';

import { useRef, useState } from 'react';
import { Icon } from "@iconify/react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { AIRLINE_PREP } from "@/lib/constants";

function RevealBlock({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AirlinePrep() {
  const [benefitOpen, setBenefitOpen] = useState(false);
  return (
    <section id="airline-prep" className="py-[clamp(5rem,8vw,9rem)] px-[clamp(0.5rem,5vw,7.75rem)] bg-white">
      <div className="max-w-[80rem] mx-auto">
        <RevealBlock>
          <p className="text-sm opacity-40 uppercase tracking-widest mb-5">
            Airline Career Preparation
          </p>
        </RevealBlock>
        <RevealBlock delay={0.08}>
          <h2
            className="tracking-[-0.05em]"
            style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', lineHeight: 1, fontWeight: 600 }}
          >
            항공사 입사과정 교육
          </h2>
        </RevealBlock>
        <RevealBlock delay={0.16}>
          <p className="mt-6 opacity-40 leading-relaxed max-w-[60ch]" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.375rem)' }}>
            비행훈련 이후 항공사 입사를 위한 실전 중심 교육 단계입니다.
            강의부터 1:1 코칭, 모의고사, 면접 컨설팅·모의면접까지
            항공사 입사 전형 전과정을 체계적으로 준비합니다.
          </p>
        </RevealBlock>

        {/* Programs — editorial list */}
        <div className="mt-24">
          <div className="flex items-baseline justify-between mb-10 md:mb-14">
            <RevealBlock>
              <p className="text-sm opacity-40 uppercase tracking-widest">Programs</p>
            </RevealBlock>
            <RevealBlock delay={0.05}>
              <p className="text-sm opacity-30 font-mono">
                8 Components
              </p>
            </RevealBlock>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 md:gap-x-20 gap-y-0 border-t border-black/[.08]">
            {[
              ...AIRLINE_PREP.programs.map((p) => ({ ...p, kind: "Program" })),
              ...AIRLINE_PREP.highlights.map((h) => ({ ...h, kind: "Highlight" })),
            ].map((item, i) => (
              <RevealBlock key={item.title} delay={0.04 * i}>
                <div className="group py-8 md:py-10 border-b border-black/[.08] h-full">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-[11px] opacity-25 tracking-[0.15em]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] uppercase tracking-[.18em] font-semibold opacity-40">
                        {item.kind}
                      </span>
                    </div>
                    <Icon
                      icon={item.icon}
                      className="text-xl opacity-15 group-hover:opacity-50 transition-opacity flex-shrink-0"
                    />
                  </div>
                  <h4
                    className="mt-4 tracking-[-0.02em]"
                    style={{
                      fontSize: "clamp(1.35rem, 1.8vw, 1.75rem)",
                      fontWeight: 500,
                      lineHeight: 1.2,
                    }}
                  >
                    {item.title}
                  </h4>
                  <p
                    className="mt-3 opacity-55 max-w-[50ch]"
                    style={{ fontSize: "clamp(0.9rem, 1vw, 1rem)", lineHeight: 1.65 }}
                  >
                    {item.desc}
                  </p>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>

        {/* Cost + Benefit 토글 */}
        <RevealBlock delay={0.16}>
          <div className="mt-10 flex items-stretch gap-3">
            {/* Cost — 95% */}
            <div className="flex-1 min-w-0 rounded-full border border-black/[.06] bg-[#f5f6f8] px-6 py-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-[.18em] font-semibold opacity-40">Cost</span>
                <span className="text-sm opacity-60">{AIRLINE_PREP.cost.note}</span>
              </div>
              <p className="font-semibold tracking-tight" style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.35rem)" }}>
                {AIRLINE_PREP.cost.value}
              </p>
            </div>

            {/* Benefit 토글 — 5% */}
            <button
              type="button"
              onClick={() => setBenefitOpen((v) => !v)}
              aria-expanded={benefitOpen}
              aria-label="Benefit 보기"
              className="flex-shrink-0 aspect-square rounded-full border border-black/[.06] bg-[#f5f6f8] hover:bg-[#eef0f3] transition-colors flex items-center justify-center"
              style={{ width: "clamp(60px, 5%, 80px)", minWidth: 60 }}
            >
              <motion.div animate={{ rotate: benefitOpen ? 180 : 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                <Icon
                  icon={benefitOpen ? "solar:close-circle-linear" : "solar:cup-hot-bold"}
                  className="text-2xl text-amber-600"
                />
              </motion.div>
            </button>
          </div>
        </RevealBlock>

        {/* Benefit — 토글 시 출력 */}
        <AnimatePresence initial={false}>
          {benefitOpen && (
            <motion.div
              key="benefit"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-10 flex flex-col items-center text-center">
                <span className="text-[10px] uppercase tracking-[.25em] font-semibold text-amber-700/80 mb-3">Benefit</span>
                <p className="font-semibold tracking-tight" style={{ fontSize: "clamp(1.1rem, 1.4vw, 1.25rem)" }}>
                  {AIRLINE_PREP.benefit.title}
                </p>
                <p className="text-sm opacity-50 mt-1">{AIRLINE_PREP.benefit.desc}</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={AIRLINE_PREP.benefit.image}
                  alt={AIRLINE_PREP.benefit.title}
                  className="mt-6 w-full max-w-[240px] h-auto object-contain select-none"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
