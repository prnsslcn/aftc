"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ACCENT = "#467ee9";
const EASE = [0.65, 0, 0.35, 1] as const;

const STAGES = [
  {
    num: "01",
    eyebrow: "Pre-Training",
    title: "사전교육",
    subtitle: "해외 비행학교 진학 전",
    desc: "필수 항공이론 및 비행 절차를 사전에 학습하는 단계입니다. 영어와 실습 환경에 자연스럽게 익숙해지도록 돕습니다.",
    points: [
      "FAR · 항공역학 · 항공기 시스템 등 Ground School 교육",
      "C172 FTD 기반 Maneuver 및 Procedure 훈련",
    ],
  },
  {
    num: "02",
    eyebrow: "Flight Training",
    title: "해외 비행유학",
    subtitle: "검증된 해외 비행학교 연계",
    desc: "실제 조종사 면허 취득 및 비행훈련을 진행합니다. 개인의 성향과 목표를 고려한 학교 매칭과 현지 학사 관리까지 이어집니다.",
    points: [
      "Hillsboro Aero Academy · AeroGuard · Phoenix East",
      "개인 맞춤 진로 설계 및 현지 학사 지원",
    ],
  },
  {
    num: "03",
    eyebrow: "Career Prep",
    title: "항공사 입사 준비",
    subtitle: "비행훈련 이후 실전 교육",
    desc: "면허 취득 이후 항공사 입사를 위한 실전 중심 교육 단계입니다. 필기 · 실기 · 면접을 통합한 솔루션으로 마무리합니다.",
    points: [
      "A320 · B737 FTD 기반 Jet Transition",
      "필기 · 실기 · 면접 통합 솔루션",
    ],
  },
];

function Stage({ stage, index }: { stage: typeof STAGES[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const isLast = index === STAGES.length - 1;

  return (
    <div ref={ref} className="relative grid grid-cols-[64px_1fr] md:grid-cols-[128px_1fr] gap-6 md:gap-14">
      <div className="relative flex flex-col items-start">
        <motion.div
          className="font-display font-bold tracking-tight relative z-10"
          style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: ACCENT, lineHeight: 1 }}
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {stage.num}
        </motion.div>
        {/* 마지막 스테이지는 gradient fade-out — 여정 종결을 부드럽게 표현 */}
        <motion.div
          className="w-px flex-1 mt-5 origin-top"
          style={{
            background: isLast
              ? `linear-gradient(to bottom, ${ACCENT}, transparent)`
              : ACCENT,
            opacity: 0.18,
          }}
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{ duration: 1.4, delay: 0.25, ease: EASE }}
        />
      </div>

      <div className={isLast ? "pb-12 md:pb-20" : "pb-20 md:pb-28"}>
        <motion.p
          className="font-mono text-[11px] uppercase tracking-[.28em] opacity-30 mb-4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.3 } : {}}
          transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
        >
          {stage.eyebrow}
        </motion.p>
        <div className="overflow-hidden">
          <motion.h3
            className="font-display tracking-[-0.04em]"
            style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)", fontWeight: 600, lineHeight: 0.95 }}
            initial={{ y: "110%" }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          >
            {stage.title}
          </motion.h3>
        </div>
        <motion.p
          className="mt-3 text-sm tracking-wide opacity-45"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.45 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {stage.subtitle}
        </motion.p>
        <motion.p
          className="mt-7 opacity-65 leading-relaxed max-w-[58ch]"
          style={{ fontSize: "clamp(1.0625rem, 1.3vw, 1.25rem)" }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 0.65, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
        >
          {stage.desc}
        </motion.p>
        <div className="mt-8 space-y-3">
          {stage.points.map((point, pi) => (
            <motion.div
              key={point}
              className="flex items-start gap-3.5 opacity-80"
              style={{ fontSize: "clamp(0.95rem, 1.1vw, 1.0625rem)" }}
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 0.8, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.65 + pi * 0.08, ease: EASE }}
            >
              <span className="w-1 h-1 rounded-full flex-shrink-0 mt-[0.65em]" style={{ backgroundColor: ACCENT }} />
              <span>{point}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Journey() {
  return (
    <div className="mt-24 md:mt-32">
      {STAGES.map((stage, i) => (
        <Stage key={stage.num} stage={stage} index={i} />
      ))}
    </div>
  );
}
