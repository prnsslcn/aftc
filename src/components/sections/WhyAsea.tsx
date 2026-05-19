"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { Icon } from "@iconify/react";
import { CONTACT } from "@/lib/constants";

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
const N = WHY_ASEA.length; // 7 principles
const M = N + 1; // 8 phases (마지막 1개는 outro CTA)
const EASE = [0.65, 0, 0.35, 1] as const;
const PX = "clamp(2rem,10vw,14rem)";
// stage 당 스크롤 길이 (vh). iOS Safari 긴 sticky 컨테이너 jitter 회피 목적으로
// 기존 120vh → 70vh 로 축소 (총 deck: 1020vh → 600vh)
const STAGE_VH = 70;
const TAIL_VH = 40;

function SegmentBar({ scrollYProgress, index }: { scrollYProgress: MotionValue<number>; index: number }) {
  // 각 segment 는 1/M 만큼의 scroll 진행을 차지 (outro 구간은 segment 없음)
  const scaleX = useTransform(scrollYProgress, [index / M, (index + 1) / M], [0, 1], { clamp: true });
  return (
    <div className="h-px flex-1 overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.07)" }}>
      <motion.div className="h-full origin-left" style={{ backgroundColor: ACCENT, scaleX }} />
    </div>
  );
}

export default function WhyAsea() {
  const deckRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: deckRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(M - 1, Math.max(0, Math.floor(v * M)));
    setActive(idx);
  });

  const isOutro = active === N; // active === 7 → outro stage
  const item = isOutro ? null : WHY_ASEA[active];

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
      <div ref={deckRef} style={{ height: `${M * STAGE_VH + TAIL_VH}vh` }}>
        <div
          className="sticky top-0 overflow-hidden"
          style={{ height: "100svh" }}
        >

          {/* Background grid — mask-image 제거 (iOS Safari paint 부하). opacity 낮춰서 끝까지 옅게 표시 */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />

          {/* Watermark number — solid fill (outro 에선 숨김) */}
          <AnimatePresence mode="wait">
            {!isOutro && (
              <motion.span
                key={active}
                aria-hidden
                className="absolute font-display font-black pointer-events-none select-none leading-none"
                style={{
                  right: "-0.05em",
                  bottom: "-0.08em",
                  fontSize: "clamp(16rem,42vw,56rem)",
                  letterSpacing: "-0.1em",
                  // WebkitTextStroke 는 거대 폰트 + 모바일 환경에서 paint 부하 큼 → 옅은 solid fill 로 대체
                  color: "rgba(255,255,255,0.04)",
                }}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                {String(active + 1).padStart(2, "0")}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Top bar — outro 에선 위로 슬라이드+페이드 */}
          <motion.div
            className="absolute top-0 inset-x-0 z-20 flex items-center justify-between"
            style={{ padding: `clamp(1.75rem,3.5vw,3rem) ${PX}` }}
            animate={{ opacity: isOutro ? 0 : 1, y: isOutro ? -20 : 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-white">
              Why ASEA
            </span>
            <AnimatePresence mode="wait">
              {!isOutro && (
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
              )}
            </AnimatePresence>
          </motion.div>

          {/* Stage content — 7가지 카드 또는 outro CTA */}
          <div
            className="absolute inset-0 flex flex-col justify-center"
            style={{ padding: `0 ${PX}` }}
          >
            <AnimatePresence mode="wait">
              {isOutro ? (
                <motion.div
                  key="outro"
                  initial={{ opacity: 0, y: 36 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -36 }}
                  transition={{ duration: 0.65, ease: EASE }}
                >
                  <h3
                    className="font-display tracking-[-0.04em]"
                    style={{
                      fontSize: "clamp(3.5rem, 9vw, 8.5rem)",
                      fontWeight: 100,
                      lineHeight: 0.95,
                    }}
                  >
                    Your flight career
                    <br />
                    starts here.
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-10">
                    <Link
                      href="/apply"
                      className="inline-flex items-center gap-3 h-[48px] pl-6 pr-2 bg-white text-black text-sm font-medium rounded-full hover:scale-[1.03] active:scale-[0.97] transition-transform"
                    >
                      과정 문의 및 지원
                      <span className="w-8 h-8 rounded-full bg-black/[.08] flex items-center justify-center">
                        <Icon icon="solar:arrow-right-up-linear" className="text-sm" />
                      </span>
                    </Link>
                    <a
                      href={`tel:${CONTACT.phone}`}
                      className="inline-flex items-center gap-3 h-[48px] px-6 bg-white/[.06] text-white text-sm font-medium rounded-full border border-white/10 hover:bg-white/[.12] active:scale-[0.97] transition-all"
                    >
                      <Icon icon="solar:phone-bold" className="text-sm opacity-70" />
                      전화 상담
                    </a>
                  </div>
                </motion.div>
              ) : (
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
                      {item!.category}
                    </span>
                  </div>

                  <h3
                    className="font-display font-bold max-w-[18ch]"
                    style={{
                      fontSize: "clamp(2.5rem,6.5vw,6rem)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.1,
                    }}
                  >
                    {item!.title}
                  </h3>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom — outro 에선 Footer 정보, 그 외엔 progress segments + dot indicators */}
          <div
            className="absolute bottom-0 inset-x-0 z-20"
            style={{ padding: `clamp(1.75rem,3.5vw,3rem) ${PX}` }}
          >
            <AnimatePresence mode="wait">
              {isOutro ? (
                <motion.div
                  key="footer"
                  initial={{ opacity: 0, y: 36 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -36 }}
                  transition={{ duration: 0.65, ease: EASE }}
                  className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-white/35"
                >
                  <p>&copy; 2026 아세아 비행교육원</p>
                  <p>{CONTACT.location} · {CONTACT.phone}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="indicators"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.55, ease: EASE }}
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
