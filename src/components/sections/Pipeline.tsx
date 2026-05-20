"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Journey from "./pipeline/Journey";
import Flow from "./pipeline/Flow";
import Tracks from "./pipeline/Tracks";
import Cost from "./pipeline/Cost";

const ACCENT = "#467ee9";
const EASE = [0.65, 0, 0.35, 1] as const;

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Pipeline() {
  return (
    <section
      id="pipeline"
      className="bg-[#fafaf8] relative"
      style={{ padding: "clamp(5rem,8vw,9rem) clamp(1rem,5vw,7.75rem)" }}
    >
      <div className="max-w-[80rem] mx-auto relative">

        {/* Header — Apple-style minimal intro */}
        <Reveal>
          <p className="font-mono text-[11px] opacity-40 uppercase tracking-[.28em] mb-7">
            Integrated Pilot Program
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            className="font-display tracking-[-0.05em]"
            style={{ fontSize: "clamp(2.0rem, 6.5vw, 5.5rem)", lineHeight: 1.2, fontWeight: 800 }}
          >
            조종사 훈련은 단순한 훈련이 아닌
            <br />
            <span className="opacity-40">체계적인 단계와 전략이 필요합니다.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            className="mt-10 opacity-55 leading-relaxed max-w-[62ch]"
            style={{ fontSize: "clamp(1.0625rem, 1.4vw, 1.375rem)" }}
          >
            아세아 비행교육원은 사전교육 · 해외 비행유학 · 항공사 입사준비로 이어지는 통합 시스템을 통해 조종사 커리어 전과정을 설계합니다. 단순한 교육 제공이 아닌, 커리어의 완성을 목표로 합니다.
          </p>
        </Reveal>

        {/* Mini indicator: 3 Stages · 6 Steps · 1 Career */}
        <Reveal delay={0.24}>
          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[12px] tracking-[.2em] uppercase opacity-50">
            <span>
              <span className="font-bold opacity-100" style={{ color: ACCENT }}>3</span> Stages
            </span>
            <span className="opacity-30">·</span>
            <span>
              <span className="font-bold opacity-100" style={{ color: ACCENT }}>6</span> Steps
            </span>
            <span className="opacity-30">·</span>
            <span>
              <span className="font-bold opacity-100" style={{ color: ACCENT }}>1</span> Career
            </span>
          </div>
        </Reveal>

        {/* The Journey — 3 stage Apple-style vertical stepper */}
        <Journey />

        {/* Program Flow — 6 step process */}
        <Flow />

        {/* Tracks — A vs B after certification */}
        <Tracks />

        {/* Cost — flight school course pricing */}
        <Cost />
      </div>
    </section>
  );
}
