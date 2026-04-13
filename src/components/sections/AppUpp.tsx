"use client";

import { useRef } from "react";
import { Icon } from "@iconify/react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  APP_STAGES,
  UPP_STAGES,
  APP_UPP_COVERED_AREAS,
} from "@/lib/constants";

function RevealBlock({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
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

const ACCENT = "#467ee9";

const PREP_DESCRIPTIONS: Record<string, string> = {
  aptitude: "학습 능력, 운항 적성, 심리 상태 등 종합 적성 평가를 체계적으로 대비합니다.",
  flight: "Simulator를 활용해 비행 감각, 주의력, 지시사항 이행능력을 집중 훈련합니다.",
  interview: "태도와 인품, 조종사로서의 자질까지 실전형 면접 대비 코칭을 제공합니다.",
};

type Stage = (typeof APP_STAGES)[number];

function StageBlock({ stage }: { stage: Stage }) {
  return (
    <div className="py-6 md:py-7 border-t border-black/[.08]">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="font-mono text-[11px] tracking-[0.15em] opacity-30">
          {String(stage.step).padStart(2, "0")}
        </span>
        <span className="text-[10px] uppercase tracking-[.2em] font-semibold opacity-40">
          Stage {stage.step}
        </span>
      </div>

      <div className="space-y-4">
        {stage.items.map((item) => {
          const isCovered = Boolean(item.covered);
          return (
            <div key={item.method} className="flex items-stretch gap-4">
              <div
                className="w-[3px] rounded-full flex-shrink-0"
                style={{
                  backgroundColor: isCovered ? ACCENT : "rgba(0,0,0,.08)",
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2 mb-1">
                  <p
                    className="tracking-[-0.01em]"
                    style={{
                      fontSize: "clamp(1rem, 1.2vw, 1.15rem)",
                      fontWeight: 600,
                      color: isCovered ? ACCENT : undefined,
                    }}
                  >
                    {item.method}
                  </p>
                  {isCovered && (
                    <span
                      className="text-[9px] uppercase tracking-[.18em] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${ACCENT}14`,
                        color: ACCENT,
                      }}
                    >
                      ASEA Prep
                    </span>
                  )}
                </div>
                <p
                  className="opacity-55 leading-relaxed"
                  style={{ fontSize: "clamp(0.85rem, 0.95vw, 0.95rem)" }}
                >
                  {isCovered && item.covered && PREP_DESCRIPTIONS[item.covered]
                    ? PREP_DESCRIPTIONS[item.covered]
                    : item.content}
                </p>
                <p className="mt-1 text-xs opacity-35">{item.location}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProcessColumn({
  title,
  subtitle,
  stages,
  totalLabel,
}: {
  title: string;
  subtitle: string;
  stages: Stage[];
  totalLabel: string;
}) {
  return (
    <div className="rounded-3xl bg-white p-8 md:p-10">
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <h3
            className="tracking-[-0.02em]"
            style={{
              fontSize: "clamp(2rem, 3vw, 2.75rem)",
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            {title}
          </h3>
          <p className="mt-2 text-sm opacity-40">{subtitle}</p>
        </div>
        <p className="font-mono text-xs opacity-30 tracking-widest">
          {totalLabel}
        </p>
      </div>

      <div>
        {stages.map((stage) => (
          <StageBlock key={stage.step} stage={stage} />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   Zoom Title — 스크롤 시 scale 확대
   ═══════════════════════════════════════ */
function ZoomTitle() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.35, 1]);
  const color = useTransform(scrollYProgress, [0, 0.4], ["#c0c0c0", "#000000"]);

  return (
    <div ref={ref} style={{ height: "200vh" }}>
      <div
        className="sticky top-0 flex items-center justify-center overflow-hidden"
        style={{ height: "100vh" }}
      >
        <motion.div
          className="text-center px-6"
          style={{ scale }}
        >
          <motion.h2
            className="tracking-[-0.05em]"
            style={{
              fontSize: "clamp(3rem, 8vw, 7rem)",
              lineHeight: 1,
              fontWeight: 800,
              color,
            }}
          >
            APP · UPP 선발 대비 교육
          </motion.h2>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   Sticky Stacking — 3개 대비 영역 순차 등장
   ═══════════════════════════════════════ */
const ITEMS_COUNT = APP_UPP_COVERED_AREAS.length;
const STACKING_COLORS = ["#34c772", "#467ee9", "#fb2d54"];

function StickyStacking() {
  return (
    <div className="relative flex flex-col items-center" style={{ marginTop: "-40vh" }}>
      {APP_UPP_COVERED_AREAS.map((area, index) => (
        <div
          key={area.key}
          className="sticky w-full"
          style={{
            top: 0,
            height: "100vh",
            paddingTop: "50vh",
            marginTop: index === 0 ? 0 : "calc(-80vh + 1.4em)",
            fontSize: "clamp(40px, 7vw, 100px)",
            fontWeight: 800,
          }}
        >
          <div
            className="flex items-center justify-center gap-4 md:gap-6"
            style={{
              transform: `translateY(calc((${index} - ${ITEMS_COUNT} * 0.5) * 1.4em))`,
            }}
          >
            <Icon
              icon={area.icon}
              className="flex-shrink-0"
              style={{
                color: STACKING_COLORS[index],
                fontSize: "clamp(40px, 6vw, 80px)",
              }}
            />
            <span className="tracking-[-0.02em]" style={{ color: STACKING_COLORS[index] }}>
              {area.label}
            </span>
          </div>
        </div>
      ))}
      <div style={{ height: "20vh" }} />
    </div>
  );
}

export default function AppUpp() {
  return (
    <section
      id="app-upp"
      className="bg-[#f0f2f5] relative"
    >
      {/* Zoom Title — APP · UPP 선발 대비 교육 */}
      <ZoomTitle />

      {/* Sticky Stacking — 운항 적성검사 / 비행 적성평가 / 면접 코칭 */}
      <StickyStacking />

      {/* 나머지 콘텐츠 */}
      <div
        className="relative"
        style={{ padding: "clamp(3rem,6vw,7rem) clamp(0.5rem,5vw,7.75rem)" }}
      >
        <div className="max-w-[80rem] mx-auto">
          {/* 설명 */}
          <RevealBlock>
            <p
              className="opacity-50 leading-relaxed max-w-[62ch]"
              style={{ fontSize: "clamp(1rem, 1.5vw, 1.375rem)" }}
            >
              APP와 UPP 선발 과정 중 핵심이 되는{" "}
              <span className="font-semibold opacity-100" style={{ color: ACCENT }}>
                운항 적성검사 · 비행 적성평가 · 면접 코칭
              </span>{" "}
              세 영역에 대해, 아세아 비행교육원이 체계적인 대비 교육을
              제공합니다.
            </p>
          </RevealBlock>

          {/* APP / UPP 선발 절차 — 2열 비교 */}
          <div className="mt-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <RevealBlock delay={0.04}>
                <ProcessColumn
                  title="APP"
                  subtitle="Airline Pilot Program"
                  stages={APP_STAGES}
                  totalLabel="5 STAGES"
                />
              </RevealBlock>
              <RevealBlock delay={0.1}>
                <ProcessColumn
                  title="UPP"
                  subtitle="University Pilot Program"
                  stages={UPP_STAGES}
                  totalLabel="4 STAGES"
                />
              </RevealBlock>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
