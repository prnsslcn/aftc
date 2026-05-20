"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FLIGHT_SCHOOL_COURSES } from "@/lib/constants";

const ACCENT = "#467ee9";
const EASE = [0.65, 0, 0.35, 1] as const;

export default function Cost() {
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
        Cost Estimation
      </motion.p>
      <motion.h3
        className="font-display tracking-[-0.04em]"
        style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1 }}
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
      >
        해외 비행학교 과정 비용
      </motion.h3>
      <motion.p
        className="mt-5 text-sm opacity-40 max-w-[60ch] leading-relaxed"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 0.4 } : {}}
        transition={{ duration: 0.6, delay: 0.16 }}
      >
        학생의 영어 · 준비상태 · 기량 등에 따라 기간 및 비용은 상이합니다 · 생활비 별도
      </motion.p>

      {/* Course rows — Apple-style spec list */}
      <div className="mt-12 divide-y divide-black/[.08] border-t border-black/[.08]">
        {FLIGHT_SCHOOL_COURSES.map((c, i) => (
          <motion.div
            key={c.name}
            className="grid grid-cols-[36px_1fr_auto] md:grid-cols-[40px_1fr_140px_200px] items-center gap-4 py-5 md:py-6"
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.07, ease: EASE }}
          >
            <span className="font-mono text-[11px] tracking-[.2em] opacity-30 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <p className="text-lg md:text-xl font-semibold tracking-tight">{c.name}</p>
              <p className="md:hidden text-[11px] opacity-45 mt-1 tabular-nums tracking-wide">
                {c.hours}h · {c.months}m
              </p>
            </div>
            <p className="hidden md:block text-sm opacity-50 tabular-nums tracking-wide">
              {c.hours}h · {c.months}m
            </p>
            <p
              className="text-base md:text-xl font-bold text-right tabular-nums tracking-tight"
              style={{ color: ACCENT }}
            >
              {c.cost}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Total — 코스 row 와 동일한 시각 weight 로 마무리 (강조 절제) */}
      <motion.div
        className="grid grid-cols-[36px_1fr_auto] md:grid-cols-[40px_1fr_140px_200px] items-baseline gap-4 py-5 md:py-6 border-t border-black/[.12]"
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
      >
        <span className="font-mono text-[11px] tracking-[.25em] opacity-45">TOTAL</span>
        <div className="min-w-0">
          <p className="text-sm md:text-base font-medium opacity-70">합계</p>
          <p className="md:hidden text-[11px] opacity-45 mt-1 tabular-nums tracking-wide">14-20개월</p>
        </div>
        <p className="hidden md:block text-sm opacity-50 tabular-nums tracking-wide">14-20개월</p>
        <p
          className="text-base md:text-lg font-semibold text-right tabular-nums tracking-tight opacity-80 whitespace-nowrap"
        >
          $110,000 ~ $135,000
        </p>
      </motion.div>
    </section>
  );
}
