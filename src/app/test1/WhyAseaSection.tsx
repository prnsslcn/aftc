"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useInView,
  type MotionValue,
} from "framer-motion";

const WHY_ASEA = [
  {
    category: "Partnership",
    title: "Embry-Riddle 항공대학 연계과정을 보유한 교육원",
  },
  {
    category: "Expertise",
    title: "항공정비 교수 시스템 심화강의",
  },
  {
    category: "Training",
    title: "FTD 기반 실습 교육으로 이해도 향상",
  },
  {
    category: "Network",
    title: "해외 비행학교 연계 맞춤형 관리",
  },
  {
    category: "Pipeline",
    title: "항공사 입사 준비까지 이어지는 교육 시스템",
  },
  {
    category: "Preparation",
    title: "필기·실기·면접 통합 솔루션",
  },
  {
    category: "Mentorship",
    title: "소수 정예 맞춤형 교육",
  },
];

const ACCENT = "#1767b1";
const EASE = [0.16, 1, 0.3, 1] as const;
const N = WHY_ASEA.length; // 7

// 각 카드 전환 phase 구성 — phase 전체 동안 slide-in + 기존 카드 shift 동시 진행
const PHASE_VH = 120; // 한 카드 전환 당 스크롤 거리
const SECTION_VH = (N - 1) * PHASE_VH + 100; // sticky viewport 100svh 포함

// Stack 레이아웃
const BASE_ROW_VH = 22; // 카드 한 줄 높이 (scale 1 기준)
const USABLE_VH = 50; // viewport 내 사용 가능 세로 공간 (k=7 에서도 이 높이 이내로)

// 현재 보이는 카드 수 k 에 따라 전체 stack scale 계산
// - k * BASE_ROW_VH 가 USABLE_VH 를 넘으면 비율에 맞춰 축소, 아니면 scale 1
function baseScale(k: number): number {
  if (k <= 0) return 1;
  return Math.min(1, USABLE_VH / (k * BASE_ROW_VH));
}

// slot i (0-indexed from top) 가 state k(=보이는 카드 수) 에서 위치할 y (vh)
// 스택을 viewport 중앙(50vh)에 정렬
function slotY(i: number, k: number): number {
  const rowH = baseScale(k) * BASE_ROW_VH;
  const stackTop = 50 - (k * rowH) / 2;
  return stackTop + i * rowH;
}

function RevealBlock({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StackLine({
  index,
  item,
  scrollYProgress,
}: {
  index: number;
  item: (typeof WHY_ASEA)[number];
  scrollYProgress: MotionValue<number>;
}) {
  const isFirst = index === 0;
  const step = 1 / (N - 1);

  // 키프레임 구성 (shift 와 slide-in 을 phase 전체 기간에 걸쳐 동시에 진행)
  // - 카드 i 는 phase (i-1) 전체 동안 slide-in (x: 100vw → 0vw)
  // - 동시에 기존 카드들(0..i-1)은 state i → state i+1 로 scale/y 선형 전환
  // - 이후 subsequent phase k 마다 state k+1 → k+2 (자연스러운 linear interp)
  const progressKfs: number[] = [];
  const yKfs: string[] = [];
  const scaleKfs: number[] = [];
  const xKfs: string[] = [];

  if (isFirst) {
    // card 0: p=0 부터 state 1 에 위치
    progressKfs.push(0);
    yKfs.push(`${slotY(0, 1)}vh`);
    scaleKfs.push(baseScale(1));
    xKfs.push("0vw");
  } else {
    // card i: 자기 entry phase 전체 동안 slide-in
    const entryStart = (index - 1) * step;
    const entryEnd = index * step;

    progressKfs.push(entryStart);
    yKfs.push(`${slotY(index, index + 1)}vh`);
    scaleKfs.push(baseScale(index + 1));
    xKfs.push("100vw");

    progressKfs.push(entryEnd);
    yKfs.push(`${slotY(index, index + 1)}vh`);
    scaleKfs.push(baseScale(index + 1));
    xKfs.push("0vw");
  }

  // subsequent phases: 각 phase 끝에 state k+2 위치 키프레임만 추가
  // (phase 동안은 linear interp 로 자연스럽게 shift)
  for (let k = index; k <= N - 2; k++) {
    const phaseEnd = (k + 1) * step;
    const nextState = k + 2;

    progressKfs.push(phaseEnd);
    yKfs.push(`${slotY(index, nextState)}vh`);
    scaleKfs.push(baseScale(nextState));
    xKfs.push("0vw");
  }

  // 키프레임 최소 2개 보장 (마지막 카드 대비)
  if (progressKfs.length < 2) {
    progressKfs.push(1);
    yKfs.push(yKfs[0]);
    scaleKfs.push(scaleKfs[0]);
    xKfs.push(xKfs[0]);
  }

  const y = useTransform(scrollYProgress, progressKfs, yKfs);
  const scale = useTransform(scrollYProgress, progressKfs, scaleKfs);
  const x = useTransform(scrollYProgress, progressKfs, xKfs);

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        top: 0,
        left: "clamp(2.5rem, 10vw, 14rem)",
        right: "clamp(2.5rem, 10vw, 14rem)",
        y,
        x,
        scale,
        zIndex: index,
        transformOrigin: "top left",
        willChange: "transform",
      }}
    >
      <div className="max-w-[90rem] flex items-baseline gap-[clamp(1rem,3vw,3rem)]">
        <span
          className="font-display font-bold shrink-0"
          style={{
            color: ACCENT,
            fontSize: "clamp(4rem, 12vw, 11rem)",
            letterSpacing: "-0.06em",
            lineHeight: 0.85,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className="flex-1 tracking-[-0.03em]"
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2.75rem)",
            fontWeight: 500,
            lineHeight: 1.1,
          }}
        >
          {item.title}
        </span>
        <span
          className="font-mono uppercase tracking-[0.3em] opacity-40 shrink-0 hidden md:inline-block self-start pt-2"
          style={{ fontSize: "clamp(0.6rem, 0.8vw, 0.75rem)" }}
        >
          {item.category}
        </span>
      </div>
    </motion.div>
  );
}

function StackingDeck() {
  const stackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // 현재 'bottom/front' 카드 인덱스 = round(v * (N-1))
    const idx = Math.min(N - 1, Math.max(0, Math.round(v * (N - 1))));
    setActive(idx);
  });

  return (
    <div
      ref={stackRef}
      className="relative"
      style={{ height: `${SECTION_VH}vh` }}
    >
      <div className="sticky top-0 overflow-hidden" style={{ height: "100svh" }}>
        {/* 배경 subtle grid */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse at center, #000 35%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, #000 35%, transparent 85%)",
          }}
        />

        {/* 상단 바: 카테고리 + 카운터 */}
        <div className="absolute top-[clamp(5rem,8vw,7rem)] left-0 right-0 z-50 px-[clamp(1.5rem,6vw,8rem)]">
          <div className="max-w-[90rem] mx-auto flex items-baseline justify-between gap-6">
            <div className="flex items-baseline gap-4 flex-wrap">
              <span className="text-[10px] tracking-[0.3em] uppercase opacity-40 font-mono">
                Principle
              </span>
              <motion.span
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="text-[11px] tracking-[0.3em] uppercase font-mono font-medium font-display"
                style={{ color: ACCENT }}
              >
                {WHY_ASEA[active].category}
              </motion.span>
            </div>
            <span className="text-[10px] tracking-[0.3em] uppercase opacity-40 font-mono whitespace-nowrap">
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(N).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* 스택 라인들 */}
        {WHY_ASEA.map((item, i) => (
          <StackLine
            key={i}
            index={i}
            item={item}
            scrollYProgress={scrollYProgress}
          />
        ))}

        {/* 하단: progress bar */}
        <div className="absolute bottom-[clamp(3rem,5vw,5rem)] left-0 right-0 z-50 px-[clamp(1.5rem,6vw,8rem)]">
          <div className="max-w-[90rem] mx-auto flex items-center gap-6">
            <div className="flex-1 flex gap-1.5">
              {Array.from({ length: N }).map((_, i) => {
                const filled = i <= active;
                return (
                  <div
                    key={i}
                    className="h-[2px] flex-1 relative overflow-hidden"
                    style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                  >
                    <motion.div
                      className="absolute inset-0 origin-left"
                      animate={{ scaleX: filled ? 1 : 0 }}
                      transition={{ duration: 0.7, ease: EASE }}
                      style={{ backgroundColor: ACCENT }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WhyAseaSection() {
  return (
    <section className="relative z-20 bg-white text-black">
      {/* Intro 헤더 — 바로 흰색 배경 */}
      <div
        className="relative"
        style={{
          padding:
            "clamp(5rem,8vw,9rem) clamp(1rem,5vw,7.75rem) clamp(3rem,5vw,5rem)",
        }}
      >
        <div className="max-w-[80rem] mx-auto">
          <RevealBlock>
            <span className="text-[11px] tracking-[0.3em] uppercase opacity-40 font-mono">
              07 Principles
            </span>
          </RevealBlock>
          <RevealBlock delay={0.1}>
            <h2
              className="font-display mt-6"
              style={{
                fontSize: "clamp(3.5rem, 10vw, 9rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
              }}
            >
              <span className="text-[#555] font-light">Why </span>
              <span style={{ color: ACCENT }}>ASEA</span>
              <span className="text-[#555] font-light">?</span>
            </h2>
          </RevealBlock>
          <RevealBlock delay={0.2}>
            <p
              className="mt-8 max-w-[48ch] opacity-50 leading-relaxed"
              style={{ fontSize: "clamp(1rem, 1.4vw, 1.25rem)" }}
            >
              아세아 비행교육원이 구축한 7가지 원칙.
              스크롤하면 한 줄씩 쌓입니다.
            </p>
          </RevealBlock>
        </div>
      </div>

      {/* Stacking Text Lines */}
      <StackingDeck />
    </section>
  );
}
