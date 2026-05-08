"use client";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";

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

function NavItem({
  index,
  item,
  isActive,
  isPast,
}: {
  index: number;
  item: (typeof WHY_ASEA)[number];
  isActive: boolean;
  isPast: boolean;
}) {
  return (
    <motion.div
      className="flex items-center gap-3 py-[clamp(0.65rem,1.1vw,0.9rem)] border-b border-white/[0.05]"
      animate={{ opacity: isActive ? 1 : isPast ? 0.35 : 0.18 }}
      transition={{ duration: 0.4 }}
    >
      {/* Active indicator */}
      <motion.div
        className="shrink-0 rounded-full"
        animate={{
          width: isActive ? "0.35rem" : "0.2rem",
          height: isActive ? "0.35rem" : "0.2rem",
          backgroundColor: isActive ? ACCENT : "rgba(255,255,255,0.3)",
        }}
        transition={{ duration: 0.4 }}
      />
      <span
        className="font-mono text-[9px] tracking-[0.12em] shrink-0"
        style={{ color: isActive ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.3)" }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <motion.div
        className="h-px shrink-0"
        animate={{ width: isActive ? "1.25rem" : "0.4rem", backgroundColor: isActive ? ACCENT : "rgba(255,255,255,0.15)" }}
        transition={{ duration: 0.4 }}
      />
      <span
        className="font-mono text-[9px] tracking-[0.28em] uppercase truncate"
        style={{ color: isActive ? ACCENT : "rgba(255,255,255,0.3)" }}
      >
        {item.category}
      </span>
    </motion.div>
  );
}

export default function WhyAseaV4() {
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
    <section className="relative bg-[#080c14] text-white">
      {/* Intro */}
      <div
        style={{
          padding:
            "clamp(5rem,8vw,9rem) clamp(2rem,10vw,14rem) clamp(3rem,5vw,5rem)",
        }}
      >
        <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/25">
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
          <span className="text-white/30 font-light">Why </span>
          <span style={{ color: ACCENT }}>ASEA</span>
          <span className="text-white/30 font-light">?</span>
        </h2>
      </div>

      {/* Sticky two-column */}
      <div ref={deckRef} style={{ height: `${N * 120 + 60}vh` }}>
        <div
          className="sticky top-0 flex overflow-hidden"
          style={{ height: "100svh" }}
        >
          {/* ── Left nav ── */}
          <div
            className="shrink-0 flex flex-col justify-center border-r border-white/[0.06]"
            style={{
              width: "clamp(200px,28%,360px)",
              padding: "0 clamp(1.5rem,2.5vw,3rem)",
            }}
          >
            <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-white/20 mb-8">
              Why ASEA
            </p>
            {WHY_ASEA.map((it, i) => (
              <NavItem
                key={i}
                index={i}
                item={it}
                isActive={i === active}
                isPast={i < active}
              />
            ))}
            {/* Bottom progress */}
            <div className="flex gap-1 mt-8">
              {Array.from({ length: N }).map((_, i) => (
                <div
                  key={i}
                  className="h-px flex-1 overflow-hidden"
                  style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
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

          {/* ── Right stage ── */}
          <div className="flex-1 relative flex flex-col justify-center overflow-hidden">

            {/* Watermark number — blue-tinted fill */}
            <AnimatePresence mode="wait">
              <motion.span
                key={active}
                aria-hidden
                className="absolute font-display font-black pointer-events-none select-none leading-none"
                style={{
                  right: "-0.06em",
                  bottom: "-0.08em",
                  fontSize: "clamp(18rem,38vw,52rem)",
                  letterSpacing: "-0.1em",
                  color: `rgba(23,103,177,0.055)`,
                }}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                {String(active + 1).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>

            {/* Counter — top right */}
            <div
              className="absolute top-[clamp(1.75rem,3.5vw,3rem)] right-[clamp(1.75rem,3.5vw,3rem)] z-10"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={active}
                  className="font-mono text-[10px] tracking-[0.2em] text-white/25"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Title content */}
            <div style={{ padding: "0 clamp(3rem,5vw,7rem)" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                  animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
                  exit={{ opacity: 0, clipPath: "inset(100% 0 0% 0)" }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  <div className="flex items-center gap-3 mb-7">
                    <div className="h-px w-8 shrink-0" style={{ backgroundColor: ACCENT }} />
                    <span
                      className="font-mono text-[11px] tracking-[0.42em] uppercase"
                      style={{ color: ACCENT }}
                    >
                      {item.category}
                    </span>
                  </div>
                  <h3
                    className="font-display font-bold max-w-[15ch]"
                    style={{
                      fontSize: "clamp(2.25rem,4.5vw,4.5rem)",
                      letterSpacing: "-0.04em",
                      lineHeight: 1.05,
                    }}
                  >
                    {item.title}
                  </h3>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
