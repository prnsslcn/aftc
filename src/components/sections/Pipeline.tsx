"use client";

import { useRef } from "react";
import { Icon } from "@iconify/react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { PIPELINE_STEPS, FLIGHT_SCHOOL_COURSES } from "@/lib/constants";

const TRACK_A = ["CFI, CFII 취득", "교관 취임 후 1,000~1,500hr", "항공사 공채 준비", "미국 / 국내 항공사 입사"];
const TRACK_B = ["CFI, CFII 취득(MEI 선택)", "Jet Rating 취득 (선택)", "항공사 공채 준비", "국내 항공사 입사"];

function TrackStep({ text, index, total, color, alpha, inView, baseDelay }: {
  text: string; index: number; total: number; color: string; alpha: string; inView: boolean; baseDelay: number;
}) {
  const isLast = index === total - 1;
  return (
    <motion.div
      className="flex gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: baseDelay + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex flex-col items-center">
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: isLast ? color : alpha }} />
        {!isLast && <div className="w-px flex-1 min-h-[24px]" style={{ background: alpha }} />}
      </div>
      <p
        className={`pb-5 ${isLast ? "font-semibold" : "opacity-50"}`}
        style={{ fontSize: "clamp(1.25rem, 2vw, 1.6rem)", color: isLast ? color : undefined }}
      >
        {text}
      </p>
    </motion.div>
  );
}

function DetailFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <div ref={ref}>
      {/* 공통 — 텍스트 순차 등장 */}
      <div className="mt-16 pb-10 border-b border-black/[.06] text-center overflow-hidden">
        <motion.p
          className="text-[11px] uppercase tracking-[.2em] opacity-25 mb-5"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 0.25, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Common Path
        </motion.p>
        <p className="opacity-60 inline-flex flex-wrap items-center justify-center gap-3" style={{ fontSize: "clamp(1.1rem, 2vw, 1.5rem)" }}>
          <motion.span
            className="font-semibold opacity-100"
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            사전교육 및 입교 수속
          </motion.span>
          <motion.span
            className="opacity-25"
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 0.25, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            →
          </motion.span>
          <motion.span
            className="font-semibold opacity-100"
            style={{ color: "#1767b1" }}
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            PPL · IR · CPL · ME 취득
          </motion.span>
        </p>
      </div>

      {/* 분기 — 블라인드 펼쳐짐 */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Track A */}
        <motion.div
          className="py-10 md:pr-12 md:border-r border-b md:border-b-0 border-black/[.06] overflow-hidden"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={inView ? { clipPath: "inset(0 0 0% 0)" } : {}}
          transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[11px] uppercase tracking-[.2em] font-semibold mb-3" style={{ color: "#c0425c" }}>Track A</p>
          <h4 className="tracking-[-0.03em] mb-4" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 600 }}>미국 / 국내 항공사</h4>
          <div className="mt-6 space-y-0">
            {TRACK_A.map((s, i) => (
              <TrackStep
                key={s}
                text={s}
                index={i}
                total={TRACK_A.length}
                color="#c0425c"
                alpha="rgba(192,66,92,0.25)"
                inView={inView}
                baseDelay={1.4}
              />
            ))}
          </div>
        </motion.div>

        {/* Track B */}
        <motion.div
          className="py-10 md:pl-12 overflow-hidden"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={inView ? { clipPath: "inset(0 0 0% 0)" } : {}}
          transition={{ duration: 1, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[11px] uppercase tracking-[.2em] font-semibold mb-3" style={{ color: "#1767b1" }}>Track B</p>
          <h4 className="tracking-[-0.03em] mb-4" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 600 }}>국내 항공사</h4>
          <div className="mt-6 space-y-0">
            {TRACK_B.map((s, i) => (
              <TrackStep
                key={s}
                text={s}
                index={i}
                total={TRACK_B.length}
                color="#1767b1"
                alpha="rgba(23,103,177,0.25)"
                inView={inView}
                baseDelay={1.6}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const AIRLINE_LOGOS = [
  "/airlines/Delta_Air_Lines-Logo.svg",
  "/airlines/Emirates_(airline)-Logo.svg",
  "/airlines/Korean_Air-Logo.svg",
  "/airlines/Lufthansa-Logo.svg",
  "/airlines/Air_France-Logo.svg",
  "/airlines/American_Airlines-Logo.svg",
  "/airlines/British_Airways-Logo.svg",
  "/airlines/Cathay_Pacific-Logo.svg",
  "/airlines/Japan_Airlines-Logo.svg",
  "/airlines/Qatar_Airways-Logo.svg",
];

function AirlineRain() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // 좌/우 두 레인 — 같은 레인 내에서는 동일 속도로 이동(상대 위치 유지 → 겹침 방지)
  const yLeft = useTransform(scrollYProgress, [0, 1], ["-60%", "180%"]);
  const yRight = useTransform(scrollYProgress, [0, 1], ["-100%", "150%"]);

  // 2열 x 5행 그리드로 균등 분포 — 서로 겹치지 않게
  const positions = [
    // 왼쪽 레인
    { left: "-4%", topInit: "1%", y: yLeft, size: 860 },
    { left: "-2%", topInit: "21%", y: yLeft, size: 900 },
    { left: "-3%", topInit: "41%", y: yLeft, size: 820 },
    { left: "-1%", topInit: "61%", y: yLeft, size: 880 },
    { left: "-4%", topInit: "81%", y: yLeft, size: 840 },
    // 오른쪽 레인
    { left: "60%", topInit: "11%", y: yRight, size: 900 },
    { left: "62%", topInit: "31%", y: yRight, size: 840 },
    { left: "59%", topInit: "51%", y: yRight, size: 920 },
    { left: "61%", topInit: "71%", y: yRight, size: 860 },
    { left: "60%", topInit: "91%", y: yRight, size: 880 },
  ];

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {AIRLINE_LOGOS.map((src, i) => {
        const pos = positions[i];
        return (
          <motion.img
            key={src}
            src={src}
            alt=""
            aria-hidden
            className="absolute select-none"
            style={{
              left: pos.left,
              top: pos.topInit,
              width: `${pos.size}px`,
              y: pos.y,
              opacity: 0.07,
              filter: "blur(2px)",
            }}
          />
        );
      })}
    </div>
  );
}

function CostTable() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <motion.div
      ref={ref}
      className="mt-20"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* 헤더 */}
      <div className="mb-8">
        <p className="text-sm font-medium opacity-40 uppercase tracking-widest mb-3">Cost Estimation</p>
        <h3 className="tracking-[-0.03em]" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", fontWeight: 600 }}>
          해외 비행학교 과정 비용
        </h3>
        <p className="mt-3 text-sm opacity-40">학생의 영어, 준비상태, 기량 등에 따라서 기간 및 비용은 상이합니다 · 생활비 별도</p>
      </div>

      {/* 데스크톱: 카드 그리드 */}
      <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-3">
        {FLIGHT_SCHOOL_COURSES.map((c, i) => (
          <motion.div
            key={c.name}
            className="rounded-2xl bg-white p-5 flex flex-col"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{
              duration: 0.6,
              delay: 0.2 + i * 0.08,
              ease: [0.16, 1, 0.3, 1],
              type: "spring",
              stiffness: 200,
              damping: 22,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[11px] opacity-25">{String(i + 1).padStart(2, "0")}</span>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#1767b1" }} />
            </div>
            <p className="text-lg font-bold tracking-tight mb-3">{c.name}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="opacity-40">시간</span>
                <span className="font-medium">{c.hours}h</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-40">기간</span>
                <span className="font-medium">{c.months}m</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-black/[.06]">
              <p className="text-base font-bold" style={{ color: "#1767b1" }}>{c.cost}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 모바일: 컴팩트 리스트 */}
      <div className="md:hidden space-y-2">
        {FLIGHT_SCHOOL_COURSES.map((c, i) => (
          <motion.div
            key={c.name}
            className="rounded-xl bg-white p-4 flex items-center justify-between"
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] opacity-25">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-bold">{c.name}</p>
                <p className="text-xs opacity-40 mt-0.5">{c.hours}h · {c.months}개월</p>
              </div>
            </div>
            <p className="font-bold" style={{ color: "#1767b1" }}>{c.cost}</p>
          </motion.div>
        ))}
      </div>

      {/* 합계 */}
      <motion.div
        className="mt-3 rounded-2xl bg-white px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 + FLIGHT_SCHOOL_COURSES.length * 0.08, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-4">
          <span className="text-[11px] uppercase tracking-[.15em] opacity-30 font-medium">Total</span>
          <span className="text-sm opacity-60">합계 14~20개월</span>
        </div>
        <p className="text-base font-semibold opacity-70">$110,000 ~ $135,000</p>
      </motion.div>
    </motion.div>
  );
}

function ProgramSteps() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <motion.div
      ref={ref}
      className="mt-16"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      <motion.p
        className="text-sm font-medium opacity-60 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 0.6, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        프로그램 절차
      </motion.p>
      <div className="flex flex-wrap items-stretch gap-0">
        {PIPELINE_STEPS.map((step, i) => (
          <div key={step.label} className="flex items-center">
            <motion.div
              className="rounded-xl bg-white px-6 py-4 min-w-[150px]"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.2 + i * 0.12,
                ease: [0.16, 1, 0.3, 1],
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
            >
              <p className="text-base font-medium">{step.label}</p>
              {step.sub && <p className="text-[12px] opacity-40 mt-1 leading-tight">{step.sub}</p>}
            </motion.div>
            {i < PIPELINE_STEPS.length - 1 && (
              <motion.div
                className="w-6 flex justify-center"
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 0.2, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.35 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                <Icon icon="solar:arrow-right-linear" className="text-sm" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function StageItem({ stage, index, isLast }: { stage: typeof STAGES[number]; index: number; isLast: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <motion.div
      ref={ref}
      className={`relative grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 md:gap-10 ${index > 0 ? "mt-16 md:mt-20" : ""}`}
    >
      {/* 좌측 도트 + 번호 */}
      <div className="flex md:flex-col items-center md:items-center gap-3 relative">
        {/* 세로 연결선 */}
        {!isLast && (
          <motion.div
            className="hidden md:block absolute left-1/2 -translate-x-1/2 top-[20px] w-px origin-top"
            style={{ height: "calc(100% + 5rem)", backgroundColor: stage.color, opacity: 0.15 }}
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
        <motion.div
          className="relative z-10 w-[14px] h-[14px] rounded-full bg-white"
          style={{ border: `3px solid ${stage.color}` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1], type: "spring", stiffness: 200, damping: 15 }}
        />
        <motion.span
          className="font-mono text-[11px] opacity-25"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.25 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {stage.num}
        </motion.span>
      </div>

      {/* 우측 콘텐츠 */}
      <div className="pb-2 overflow-hidden">
        <motion.p
          className="text-[13px] uppercase tracking-[.15em] opacity-35 mb-3"
          initial={{ y: "100%", opacity: 0 }}
          animate={inView ? { y: 0, opacity: 0.35 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {stage.subtitle}
        </motion.p>
        <div className="overflow-hidden">
          <motion.h3
            className="tracking-[-0.03em] mb-5"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", fontWeight: 600, color: stage.color }}
            initial={{ y: "110%" }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {stage.title}
          </motion.h3>
        </div>
        <motion.p
          className="opacity-50 leading-relaxed max-w-[55ch] mb-7"
          style={{ fontSize: "clamp(1.05rem, 1.4vw, 1.25rem)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 0.5, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {stage.desc}
        </motion.p>
        <div className="flex flex-wrap gap-x-6 gap-y-2.5">
          {stage.points.map((point, pi) => (
            <motion.span
              key={point}
              className="flex items-center gap-2 opacity-65"
              style={{ fontSize: "clamp(0.95rem, 1.1vw, 1.05rem)" }}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 0.65, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 + pi * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: stage.color }} />
              {point}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

const STAGES = [
  {
    num: "01",
    title: "사전교육",
    subtitle: "해외 비행학교 진학 전",
    desc: "필수 항공이론 및 비행 절차를 사전에 학습하는 단계입니다.",
    points: [
      "FAR, 항공역학, 항공기 시스템 등 Ground School 교육",
      "C172 FTD 기반 Maneuver 및 Procedure 훈련",
    ],
    color: "#1767b1",
    bgColor: "bg-blue-50",
  },
  {
    num: "02",
    title: "해외 비행유학",
    subtitle: "검증된 해외 비행학교 연계",
    desc: "실제 조종사 면허 취득 및 비행훈련을 진행합니다.",
    points: [
      "Hillsboro Aero Academy",
      "AeroGuard Flight Training Center",
      "Phoenix East Aviation",
      "개인의 성향과 목표에 맞는 비행학교 선택 및 진로 설계 지원",
    ],
    color: "#1767b1",
    bgColor: "bg-blue-50",
  },
  {
    num: "03",
    title: "항공사 입사 준비",
    subtitle: "비행훈련 이후 실전 교육",
    desc: "항공사 입사를 위한 실전 중심 교육 단계입니다.",
    points: [
      "A320 / B737 FTD 기반 Jet Transition",
      "필기, 실기 면접준비",
      "항공사 요구 역량을 반영한 실전 교육",
    ],
    color: "#1767b1",
    bgColor: "bg-blue-50",
  },
];

export default function Pipeline() {
  const stageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  return (
    <section id="pipeline" className="bg-[#f0f2f5] relative overflow-hidden" style={{ padding: "clamp(5rem,8vw,9rem) clamp(0.5rem,5vw,7.75rem)" }}>
      <AirlineRain />
      <div className="max-w-[80rem] mx-auto relative">

        {/* Header */}
        <Reveal>
          <p className="text-sm opacity-40 uppercase tracking-widest mb-5">Integrated Pilot Program</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 ref={headingRef} className="tracking-[-0.05em]" style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", lineHeight: 1, fontWeight: 600 }}>
            조종사 훈련은 단순한 훈련이 아닌<br />체계적인 단계와 전략이 필요합니다.
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 opacity-50 leading-relaxed max-w-[60ch]" style={{ fontSize: "clamp(1rem, 1.5vw, 1.375rem)" }}>
            아세아 비행교육원은 사전교육에서 해외 비행유학, 항공사 입사준비까지 이어지는
            통합 조종사 교육시스템을 통해 조종사 커리어 전과정을 설계합니다.
          </p>
        </Reveal>

        {/* 아세아의 지향점 */}
        <Reveal delay={0.2}>
          <div className="mt-10 inline-flex items-center gap-3 rounded-full bg-black px-5 py-2.5">
            <span className="text-white text-sm font-medium">단순한 교육제공이 아닌 조종사로서의 커리어 완성</span>
          </div>
        </Reveal>

        {/* 3단계 — 가운데 흰 컨테이너 */}
        <div className="mt-20 relative" ref={stageRef}>
          {/* 3단계 타임라인 — 글래스모피즘 컨테이너 */}
          <motion.div
            className="relative z-10 rounded-3xl border border-white/50 bg-white/70 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.12)] p-8 md:p-12 lg:p-16"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {STAGES.map((stage, i) => (
              <StageItem key={stage.title} stage={stage} index={i} isLast={i === STAGES.length - 1} />
            ))}
          </motion.div>
        </div>

        {/* 프로그램 절차 — 수평 스텝 */}
        <ProgramSteps />

        {/* 세부 절차 — 텍스트 중심 */}
        <div className="mt-24 relative">
          <div className="relative z-10">
            <Reveal>
              <p className="text-sm font-medium opacity-40 uppercase tracking-widest mb-4">After Certification</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h3 className="tracking-[-0.05em]" style={{ fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: 1.05, fontWeight: 600 }}>
                면허 취득 이후,<br />두 갈래의 길이 열립니다.
              </h3>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 opacity-40 leading-relaxed max-w-[50ch]" style={{ fontSize: "clamp(1rem, 1.5vw, 1.375rem)" }}>
                사전교육과 비행학교를 거쳐 면허를 취득한 후, 개인의 목표와 상황에 따라 두 가지 경로로 항공사 입사를 준비합니다.
              </p>
            </Reveal>

            <DetailFlow />
          </div>
        </div>

        {/* 비행학교 과정 비용 테이블 */}
        <CostTable />
      </div>
    </section>
  );
}
