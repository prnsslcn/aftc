"use client";

import { useRef, useState, useLayoutEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const WHY_ASEA = [
  { category: "Partnership", title: "Embry-Riddle 항공대학 연계과정을 보유한 교육원" },
  { category: "Expertise", title: "항공정비 교수 시스템 심화강의" },
  { category: "Training", title: "FTD 기반 실습 교육으로 이해도 향상" },
  { category: "Network", title: "해외 비행학교 연계 맞춤형 관리" },
  { category: "Pipeline", title: "항공사 입사 준비까지 이어지는 교육 시스템" },
  { category: "Preparation", title: "필기·실기·면접 통합 솔루션" },
  { category: "Mentorship", title: "소수 정예 맞춤형 교육" },
];

const ACCENT = "#1767b1";
const N = WHY_ASEA.length;
const EASE = [0.16, 1, 0.3, 1] as const;
const PX = "clamp(2rem,10vw,14rem)";
const COMPACT = 60; // px — inactive row height

function Row({
  index,
  item,
  isActive,
  expandedH,
}: {
  index: number;
  item: (typeof WHY_ASEA)[number];
  isActive: boolean;
  expandedH: number;
}) {
  return (
    <motion.div
      animate={{ height: isActive ? expandedH : COMPACT }}
      transition={{ duration: 0.65, ease: EASE }}
      className="relative flex-shrink-0 overflow-hidden border-b border-black/[0.07]"
    >
      <div className="relative flex gap-8 md:gap-12 h-full">
        {/* Left accent stripe */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-[3px]"
          animate={{ backgroundColor: isActive ? ACCENT : "rgba(0,0,0,0)" }}
          transition={{ duration: 0.4 }}
        />

        {/* Number */}
        <div className="w-12 md:w-16 shrink-0 flex items-start pt-[18px] pl-4">
          <span
            className="font-mono text-[11px] tracking-[0.12em]"
            style={{ color: isActive ? ACCENT : "rgba(0,0,0,0.25)" }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Category + Title */}
        <div className="flex-1 flex flex-col pt-[18px] pr-6 pb-5">
          <span
            className="font-mono text-[10px] tracking-[0.38em] uppercase shrink-0 transition-colors duration-300"
            style={{ color: isActive ? ACCENT : "rgba(0,0,0,0.3)" }}
          >
            {item.category}
          </span>
          <motion.div
            className="mt-auto"
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 16 }}
            transition={{ duration: 0.5, delay: isActive ? 0.2 : 0, ease: EASE }}
          >
            <h3
              className="font-display font-bold max-w-[20ch]"
              style={{
                fontSize: "clamp(1.75rem,3.5vw,3.25rem)",
                letterSpacing: "-0.035em",
                lineHeight: 1.08,
              }}
            >
              {item.title}
            </h3>
          </motion.div>
        </div>

        {/* Ghost number */}
        <motion.div
          className="hidden md:flex items-end pb-5 pr-6 shrink-0"
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.45, delay: isActive ? 0.1 : 0 }}
        >
          <span
            className="font-display font-black leading-none select-none"
            style={{
              fontSize: "clamp(5rem,9vw,9rem)",
              letterSpacing: "-0.07em",
              color: ACCENT,
              opacity: 0.07,
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function WhyAseaV3() {
  const deckRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [expandedH, setExpandedH] = useState(320);

  const { scrollYProgress } = useScroll({
    target: deckRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(N - 1, Math.max(0, Math.floor(v * N)));
    setActive(idx);
  });

  // Measure rows container height after mount + on resize
  useLayoutEffect(() => {
    const measure = () => {
      if (!rowsRef.current) return;
      const h = rowsRef.current.offsetHeight;
      setExpandedH(Math.max(200, h - (N - 1) * COMPACT));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (rowsRef.current) ro.observe(rowsRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <section className="relative bg-[#f8f8f6] text-black">
      {/* Intro */}
      <div style={{ padding: `clamp(5rem,8vw,9rem) ${PX} clamp(3rem,5vw,5rem)` }}>
        <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-black/30">
          07 Principles
        </span>
        <h2
          className="font-display mt-5"
          style={{
            fontSize: "clamp(4rem,10vw,9rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 0.9,
          }}
        >
          <span className="text-[#555] font-light">Why </span>
          <span style={{ color: ACCENT }}>ASEA</span>
          <span className="text-[#555] font-light">?</span>
        </h2>
      </div>

      {/* Sticky accordion */}
      <div ref={deckRef} style={{ height: `${N * 120 + 60}vh` }}>
        <div
          className="sticky top-0 flex flex-col overflow-hidden"
          style={{ height: "100svh" }}
        >
          {/* Top bar */}
          <div
            className="flex items-center justify-between shrink-0 border-b border-black/[0.07]"
            style={{ padding: `clamp(0.9rem,1.8vw,1.4rem) ${PX}` }}
          >
            <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-black/25">
              Why ASEA
            </span>
            <motion.span
              key={active}
              className="font-mono text-[10px] tracking-[0.2em] text-black/30"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
            </motion.span>
          </div>

          {/* Accordion rows */}
          <div
            ref={rowsRef}
            className="flex-1 flex flex-col overflow-hidden"
            style={{ paddingLeft: PX, paddingRight: PX }}
          >
            {WHY_ASEA.map((item, i) => (
              <Row
                key={i}
                index={i}
                item={item}
                isActive={i === active}
                expandedH={expandedH}
              />
            ))}
          </div>

          {/* Bottom progress */}
          <div
            className="shrink-0"
            style={{ padding: `clamp(0.9rem,1.8vw,1.4rem) ${PX}` }}
          >
            <div className="flex gap-1.5">
              {Array.from({ length: N }).map((_, i) => (
                <div
                  key={i}
                  className="h-px flex-1 overflow-hidden"
                  style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                >
                  <motion.div
                    className="h-full origin-left"
                    animate={{ scaleX: i <= active ? 1 : 0 }}
                    transition={{ duration: 0.55, ease: EASE }}
                    style={{ backgroundColor: ACCENT }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
