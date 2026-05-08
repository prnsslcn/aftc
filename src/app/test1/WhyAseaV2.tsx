"use client";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";

const WHY_ASEA = [
  { category: "Partnership", title: "Embry-Riddle 항공대학 연계과정을 보유한 교육원" },
  { category: "Expertise", title: "항공정비 교수 시스템 심화강의" },
  { category: "Training", title: "FTD 기반 실습 교육으로 이해도 향상" },
  { category: "Network", title: "해외 비행학교 연계 맞춤형 관리" },
  { category: "Pipeline", title: "항공사 입사 준비까지 이어지는 교육 시스템" },
  { category: "Preparation", title: "필기 · 실기 · 면접 통합 솔루션" },
  { category: "Mentorship", title: "소수 정예 맞춤형 교육" },
];

const ACCENT = "#467ee9";
const N = WHY_ASEA.length;
const EASE = [0.16, 1, 0.3, 1] as const;
const PX = "clamp(2rem,10vw,14rem)";

function SegmentBar({ scrollYProgress, index }: { scrollYProgress: MotionValue<number>; index: number }) {
  const scaleX = useTransform(scrollYProgress, [index / N, (index + 1) / N], [0, 1], { clamp: true });
  return (
    <div className="h-px flex-1 overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.07)" }}>
      <motion.div className="h-full origin-left" style={{ backgroundColor: ACCENT, scaleX }} />
    </div>
  );
}

export default function WhyAseaV2() {
  const deckRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: deckRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(N - 1, Math.max(0, Math.floor(v * N)));
    setActive(idx);
  });

  const item = WHY_ASEA[active];

  return (
    <section className="relative bg-[#0a0a0a] text-white">
      {/* Intro */}
      <div style={{ padding: `clamp(5rem,8vw,9rem) ${PX} clamp(3rem,5vw,5rem)` }}>
        <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-white">
          07 Principles
        </p>
        <h2
          className="font-display mt-5"
          style={{ fontSize: "clamp(4rem,10vw,9rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.9 }}
        >
          <span className="text-white font-light">Why </span>
          <span style={{ color: ACCENT }}>ASEA</span>
          <span className="text-white font-light">?</span>
        </h2>
        <p
          className="mt-6 text-white leading-relaxed max-w-[40ch]"
          style={{ fontSize: "clamp(0.9rem,1.3vw,1.1rem)" }}
        >
          아세아 비행교육원이 구축한 7가지 원칙.
        </p>
      </div>

      {/* Sticky deck */}
      <div ref={deckRef} style={{ height: `${N * 120 + 60}vh` }}>
        <div className="sticky top-0 overflow-hidden" style={{ height: "100svh" }}>

          {/* Background grid */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, #000 30%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, #000 30%, transparent 100%)",
            }}
          />

          {/* Watermark number — outline stroke, bottom-right */}
          <AnimatePresence mode="wait">
            <motion.span
              key={active}
              aria-hidden
              className="absolute font-display font-black pointer-events-none select-none leading-none"
              style={{
                right: "-0.05em",
                bottom: "-0.08em",
                fontSize: "clamp(16rem,42vw,56rem)",
                letterSpacing: "-0.1em",
                color: "transparent",
                WebkitTextStroke: "1.5px rgba(255,255,255,0.05)",
              }}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              {String(active + 1).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>

          {/* Top bar */}
          <div
            className="absolute top-0 inset-x-0 z-20 flex items-center justify-between"
            style={{ padding: `clamp(1.75rem,3.5vw,3rem) ${PX}` }}
          >
            <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-white">
              Why ASEA
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={active}
                className="font-mono text-[10px] tracking-[0.2em] text-white"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Stage content */}
          <div
            className="absolute inset-0 flex flex-col justify-center"
            style={{ padding: `0 ${PX}` }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -36 }}
                transition={{ duration: 0.65, ease: EASE }}
              >
                <div className="flex items-center gap-4 mb-7">
                  <div className="h-px w-10 shrink-0" style={{ backgroundColor: ACCENT }} />
                  <span
                    className="font-mono text-[11px] tracking-[0.42em] uppercase"
                    style={{ color: ACCENT }}
                  >
                    {item.category}
                  </span>
                </div>

                <h3
                  className="font-display font-bold max-w-[18ch]"
                  style={{
                    fontSize: "clamp(2.5rem,6.5vw,6rem)",
                    letterSpacing: "-0.04em",
                    lineHeight: 1.0,
                  }}
                >
                  {item.title}
                </h3>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom — progress segments + dot indicators */}
          <div
            className="absolute bottom-0 inset-x-0 z-20"
            style={{ padding: `clamp(1.75rem,3.5vw,3rem) ${PX}` }}
          >
            <div className="flex items-center gap-2 mb-4">
              {Array.from({ length: N }).map((_, i) => (
                <motion.div
                  key={i}
                  className="rounded-full"
                  animate={{
                    width: i === active ? "1.75rem" : "0.3rem",
                    opacity: i <= active ? 1 : 0.2,
                    backgroundColor: i === active ? ACCENT : "#ffffff",
                  }}
                  style={{ height: "0.3rem" }}
                  transition={{ duration: 0.45, ease: EASE }}
                />
              ))}
            </div>
            <div className="flex gap-1.5">
              {Array.from({ length: N }).map((_, i) => (
                <SegmentBar key={i} scrollYProgress={scrollYProgress} index={i} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
