"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ACCENT = "#467ee9";
const ACCENT_RED = "#fb2d54";
const EASE = [0.65, 0, 0.35, 1] as const;

const TRACK_A = [
  "CFI, CFII 취득",
  "교관 취임 후 1,000~1,500hr",
  "항공사 공채 준비",
  "미국 / 국내 항공사 입사",
];

const TRACK_B = [
  "CFI, CFII 취득(MEI 선택)",
  "Jet Rating 취득 (선택)",
  "항공사 공채 준비",
  "국내 항공사 입사",
];

function TrackCard({ letter, dest, steps, color, delay }: {
  letter: string;
  dest: string;
  steps: string[];
  color: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  return (
    <motion.div
      ref={ref}
      className="border border-black/[.08] rounded-2xl p-7 md:p-9 bg-white/40"
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      <div className="flex items-baseline gap-3 mb-4">
        <span className="font-mono text-[11px] tracking-[.28em]" style={{ color }}>TRACK</span>
        <span className="font-display font-bold" style={{ fontSize: "1.625rem", color, lineHeight: 1 }}>{letter}</span>
      </div>
      <h4 className="font-display tracking-[-0.03em]" style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 600 }}>
        {dest}
      </h4>
      <ol className="mt-8 space-y-4">
        {steps.map((step, i) => {
          const isFinal = i === steps.length - 1;
          return (
            <motion.li
              key={step}
              className="flex gap-4 items-start"
              initial={{ opacity: 0, x: -12 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: delay + 0.25 + i * 0.08, ease: EASE }}
            >
              <span
                className="font-mono text-[10px] tracking-[.18em] mt-[5px] flex-shrink-0 tabular-nums"
                style={{ color, opacity: isFinal ? 1 : 0.4 }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={`leading-snug ${isFinal ? "font-semibold" : "opacity-65"}`}
                style={isFinal ? { color } : undefined}
              >
                {step}
              </span>
            </motion.li>
          );
        })}
      </ol>
    </motion.div>
  );
}

export default function Tracks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  return (
    <section ref={ref} className="mt-32 md:mt-40">
      <motion.p
        className="font-mono text-[11px] opacity-40 uppercase tracking-[.28em] mb-4"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 0.4 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
      >
        After Certification
      </motion.p>
      <motion.h3
        className="font-display tracking-[-0.05em]"
        style={{ fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: 1.2, fontWeight: 800 }}
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
      >
        면허 취득 이후,
        <br />
        <span className="opacity-40">두 갈래의 길이 열립니다.</span>
      </motion.h3>
      <motion.p
        className="mt-7 opacity-50 leading-relaxed max-w-[55ch]"
        style={{ fontSize: "clamp(1rem, 1.3vw, 1.25rem)" }}
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 0.5, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.16, ease: EASE }}
      >
        사전교육과 비행학교를 거쳐 면허를 취득한 후, 개인의 목표와 상황에 따라 두 가지 경로로 항공사 입사를 준비합니다.
      </motion.p>

      {/* Common path indicator */}
      <motion.div
        className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.24 }}
      >
        <span className="font-mono text-[10px] tracking-[.25em] opacity-35">COMMON</span>
        <span className="text-sm font-medium opacity-80">사전교육 및 입교 수속</span>
        <span className="opacity-25">→</span>
        <span className="text-sm font-semibold" style={{ color: ACCENT }}>PPL · IR · CPL · ME 취득</span>
      </motion.div>

      {/* Two tracks */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
        <TrackCard letter="A" dest="미국 / 국내 항공사" steps={TRACK_A} color={ACCENT_RED} delay={0.32} />
        <TrackCard letter="B" dest="국내 항공사" steps={TRACK_B} color={ACCENT} delay={0.42} />
      </div>
    </section>
  );
}
