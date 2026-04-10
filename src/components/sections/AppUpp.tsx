"use client";

import { useRef } from "react";
import { Icon } from "@iconify/react";
import { motion, useInView } from "framer-motion";
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

const ACCENT = "#1767b1";

type Stage = (typeof APP_STAGES)[number];

function StageBlock({ stage }: { stage: Stage }) {
  return (
    <div className="py-6 md:py-7 border-t border-black/[.08]">
      <div className="flex items-baseline gap-3 mb-4">
        <span
          className="font-mono text-[11px] tracking-[0.15em] opacity-30"
        >
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
              {/* 좌측 바 */}
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
                  {item.content}
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

export default function AppUpp() {
  return (
    <section
      id="app-upp"
      className="bg-[#f0f2f5] relative"
      style={{ padding: "clamp(5rem,8vw,9rem) clamp(0.5rem,5vw,7.75rem)" }}
    >
      {/* WIP 오버레이 — 섹션 전체 위에 덮이는 반투명 레이어 */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/dummy.jpg"
          alt=""
          aria-hidden
          className="w-full h-full object-cover"
          style={{ opacity: 0.25 }}
        />
        <div className="absolute inset-0 flex items-start justify-center pt-10">
          <span className="text-xs md:text-sm uppercase tracking-[.3em] font-semibold text-black/60 bg-white/70 backdrop-blur-sm rounded-full px-5 py-2 shadow-sm">
            Work in Progress · 수정 예정
          </span>
        </div>
      </div>

      <div className="max-w-[80rem] mx-auto relative z-10">
        {/* Header */}
        <RevealBlock>
          <p className="text-sm opacity-40 uppercase tracking-widest mb-5">
            APP / UPP
          </p>
        </RevealBlock>
        <RevealBlock delay={0.08}>
          <h2
            className="tracking-[-0.05em]"
            style={{
              fontSize: "clamp(2rem, 5vw, 4.5rem)",
              lineHeight: 1,
              fontWeight: 600,
            }}
          >
            APP · UPP 선발 대비 교육
          </h2>
        </RevealBlock>
        <RevealBlock delay={0.16}>
          <p
            className="mt-6 opacity-50 leading-relaxed max-w-[62ch]"
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

        {/* 3개 대비 영역 — 전제 */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          {APP_UPP_COVERED_AREAS.map((area, i) => (
            <RevealBlock key={area.key} delay={0.05 * (i + 1)}>
              <div className="h-full rounded-2xl bg-white p-7 md:p-8 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${ACCENT}10` }}
                  >
                    <Icon
                      icon={area.icon}
                      className="text-xl"
                      style={{ color: ACCENT }}
                    />
                  </div>
                  <span className="font-mono text-[11px] opacity-25 tracking-[0.15em]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h4
                  className="tracking-[-0.02em] mb-2"
                  style={{
                    fontSize: "clamp(1.15rem, 1.5vw, 1.4rem)",
                    fontWeight: 600,
                    lineHeight: 1.2,
                  }}
                >
                  {area.label}
                </h4>
                <p
                  className="opacity-55 leading-relaxed"
                  style={{ fontSize: "clamp(0.875rem, 1vw, 1rem)" }}
                >
                  {area.desc}
                </p>
              </div>
            </RevealBlock>
          ))}
        </div>

        {/* APP / UPP 선발 절차 — 2열 비교 */}
        <div className="mt-14">
          <RevealBlock>
            <div className="flex items-baseline justify-between mb-8">
              <p className="text-sm opacity-40 uppercase tracking-widest">
                Selection Process
              </p>
              <p className="text-xs opacity-30">
                <span className="font-mono">ASEA Prep</span> 배지가 표시된
                단계는 대비 교육 대상
              </p>
            </div>
          </RevealBlock>

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
    </section>
  );
}
