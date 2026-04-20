"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import Navbar from "@/components/layout/Navbar";

/* ═══════════════════════════════════════
   유틸
   ═══════════════════════════════════════ */
function bezier(x1: number, y1: number, x2: number, y2: number) {
  return (t: number) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    let lo = 0, hi = 1;
    for (let i = 0; i < 16; i++) {
      const mid = (lo + hi) / 2;
      const x = 3 * x1 * mid * (1 - mid) ** 2 + 3 * x2 * mid ** 2 * (1 - mid) + mid ** 3;
      if (x < t) lo = mid; else hi = mid;
    }
    const m = (lo + hi) / 2;
    return 3 * y1 * m * (1 - m) ** 2 + 3 * y2 * m ** 2 * (1 - m) + m ** 3;
  };
}
const EASE = bezier(0.15, 0.61, 0, 1);
function clamp(min: number, max: number, v: number) { return Math.max(min, Math.min(v, max)); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

const SP = 4;
const RD = 12;

const ABOUT_HEADING = "예비 조종사 양성부터 항공사 입사까지 이어지는 통합 교육";
const ABOUT_DESC =
  "아세아 비행교육원은 A320, B737, C172 FTD를 기반으로 이론과 실습을 결합한 현장 중심 교육을 제공하며, 엠브리 리들 항공대학교와의 협력을 통해 검증된 교육을 제공합니다.";

const WHY_STACK = [
  { label: "Why ASEA?", isTitle: true },
  { label: "Embry-Riddle 항공대학 연계과정" },
  { label: "항공정비 교수 시스템 심화강의" },
  { label: "FTD 기반 실습 교육" },
  { label: "해외 비행학교 연계 맞춤형 관리" },
  { label: "항공사 입사 준비과정까지 연계" },
  { label: "필기 · 실기 · 면접 통합 솔루션" },
  { label: "소수 정예 맞춤형 교육" },
];
const WHY_COUNT = WHY_STACK.length;

/* ═══════════════════════════════════════
   AboutZoom — 줌 인 → hold → 우측 exit
   (AppUpp ZoomTitle 패턴 + exit-right 추가)
   ═══════════════════════════════════════ */
function AboutZoom() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // ── Zoom-Through Fade ──
  // 0.00 ~ 0.30: 등장 (scale 0.55 → 1, opacity 0 → 1, blur 8 → 0)
  // 0.30 ~ 0.50: hold (scale 1, 선명하게)
  // 0.50 ~ 0.95: 통과 (scale 1 → 1.6, opacity 1 → 0, blur 0 → 6)
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.95], [0.55, 1, 1, 1.6]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.85], [0, 1, 1, 0]);
  const filterStr = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.95],
    ["blur(8px)", "blur(0px)", "blur(0px)", "blur(6px)"]
  );
  const color = useTransform(
    scrollYProgress,
    [0, 0.3],
    ["rgba(255,255,255,0.35)", "rgba(255,255,255,1)"]
  );

  return (
    <div ref={ref} style={{ height: "280svh" }}>
      <div
        className="sticky top-0 flex items-center justify-center overflow-hidden"
        style={{ height: "100svh" }}
      >
        <motion.div
          className="max-w-[70rem] mx-auto px-6 md:px-10 text-center"
          style={{ scale, opacity, filter: filterStr }}
        >
          <p className="text-[11px] md:text-sm opacity-70 uppercase tracking-[.25em] mb-6 text-white">
            About ASEA
          </p>
          <motion.h2
            className="tracking-[-0.04em]"
            style={{
              fontSize: "clamp(2rem, 5vw, 4.5rem)",
              fontWeight: 700,
              lineHeight: 1.08,
              color,
            }}
          >
            {ABOUT_HEADING}
          </motion.h2>
          <motion.p
            className="mt-6 md:mt-8 leading-relaxed max-w-[55ch] mx-auto"
            style={{
              fontSize: "clamp(0.95rem, 1.3vw, 1.2rem)",
              color,
              opacity: 0.85,
            }}
          >
            {ABOUT_DESC}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   WhyStack — sticky 스태킹(AppUpp 패턴)
   모든 항목이 쌓인 후 전체가 우측으로 exit
   ═══════════════════════════════════════ */
function WhyStack() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // ── 스태킹 완료 후 통과 효과 (Zoom + blur + fade) ──
  // 0.65 ~ 0.95: 전체 스택이 살짝 확대되며 부드럽게 사라짐
  const stackScale = useTransform(scrollYProgress, [0.65, 0.95], [1, 1.15]);
  const stackOpacity = useTransform(scrollYProgress, [0.7, 0.95], [1, 0]);
  const stackFilter = useTransform(
    scrollYProgress,
    [0.65, 0.95],
    ["blur(0px)", "blur(8px)"]
  );

  return (
    <div
      ref={ref}
      className="relative flex flex-col items-center"
    >
      {WHY_STACK.map((item, index) => (
        <div
          key={item.label}
          className="sticky w-full"
          style={{
            top: 0,
            height: "100svh",
            paddingTop: "50svh",
            marginTop: index === 0 ? 0 : "calc(-80svh + 1.4em)",
            fontSize: "clamp(22px, 3.2vw, 48px)",
            fontWeight: 700,
          }}
        >
          {/* Y offset wrapper (정적) */}
          <div
            className="flex items-center justify-center text-center px-6"
            style={{
              transform: `translateY(calc((${index} - ${WHY_COUNT} * 0.5) * 1.4em))`,
            }}
          >
            {/* exit wrapper — 전체 스택이 통과하듯 확대 + 블러 + 페이드 */}
            <motion.div style={{ scale: stackScale, opacity: stackOpacity, filter: stackFilter }}>
              {item.isTitle ? (
                <span
                  className="font-display"
                  style={{
                    fontSize: "clamp(32px, 5vw, 72px)",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  <span className="font-light opacity-60 text-white">Why </span>
                  <span style={{ color: "#58a7ff" }}>ASEA</span>
                  <span className="font-light opacity-60 text-white">?</span>
                </span>
              ) : (
                <span className="tracking-[-0.02em] text-white" style={{ lineHeight: 1.15 }}>
                  {item.label}
                </span>
              )}
            </motion.div>
          </div>
        </div>
      ))}
      {/* exit 후 다음 섹션까지 부드러운 버퍼 */}
      <div style={{ height: "60svh" }} />
    </div>
  );
}

/* ═══════════════════════════════════════
   HeroExpand
   ═══════════════════════════════════════ */
export default function HeroExpand() {
  const heroRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [navThreshold, setNavThreshold] = useState(99999);

  useEffect(() => {
    setReady(true);
    setNavThreshold(window.innerHeight * 9);
  }, []);

  // Lenis smooth scroll — test1 전용
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      gestureOrientation: "vertical",
      wheelMultiplier: 1,
      touchMultiplier: 1,
    });

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    let raf = false;
    function tick() {
      const h = heroRef.current;
      const sticky = stickyRef.current;
      const mk = maskRef.current;
      const video = videoRef.current;
      if (!h || !sticky || !mk || !video) { raf = false; return; }

      const sy = window.scrollY;
      const vh = window.innerHeight;

      const phase1P = clamp(0, 1, sy / vh);
      const expandP = EASE(phase1P);
      const pad = lerp(SP * 2, 0, expandP);
      const radius = lerp(RD, 0, expandP);
      // 컨테이너 padding은 고정(0), mask의 clip-path inset만 애니메이션
      // 텍스트는 mask 밖에 있어서 영향 없음
      mk.style.clipPath = `inset(${pad}px round ${radius}px)`;

      h.style.setProperty("--ui-op", String(1 - clamp(0, 1, sy / (vh * 0.8))));

      const blurP = clamp(0, 1, (sy - vh) / (vh * 0.5));
      const blur = lerp(0, 22, blurP);
      const brightness = lerp(1, 0.4, blurP);
      video.style.filter = `blur(${blur}px) brightness(${brightness})`;
      video.style.transform = `scale(${1 + blur * 0.01})`;

      raf = false;
    }
    function onScroll() { if (!raf) { requestAnimationFrame(tick); raf = true; } }
    window.addEventListener("scroll", onScroll, { passive: true });
    tick();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="bg-white text-black font-sans">
      <Navbar scrollThreshold={navThreshold} />

      <div
        ref={heroRef}
        className="relative"
        style={{ ["--ui-op" as string]: "1" }}
      >
        <div
          ref={stickyRef}
          className="sticky top-0 overflow-hidden bg-white z-0"
          style={{ height: "100svh" }}
        >
          {/* 영상 mask — clipPath inset 애니메이션 */}
          <div
            ref={maskRef}
            className="absolute inset-0 bg-black"
            style={{ clipPath: `inset(${SP * 2}px round ${RD}px)` }}
          >
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay loop muted playsInline preload="metadata"
              style={{ transformOrigin: "center" }}
            >
              <source src="/images/wing.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* 텍스트 오버레이 — mask 밖에서 고정 위치 (영상 확장에 영향받지 않음) */}
          <div
            className="absolute inset-0 z-10 flex flex-col justify-end pointer-events-none"
            style={{ padding: `0 ${SP * 5}px` }}
          >
            <div className="text-white" style={{ opacity: "var(--ui-op)", paddingBottom: SP * 10 }}>
              <div className="overflow-hidden">
                <motion.h1
                  className="font-display font-bold tracking-[-0.05em] leading-none"
                  style={{ fontSize: "clamp(4rem, 13vw, 12rem)" }}
                  initial={{ y: "110%" }}
                  animate={ready ? { y: 0 } : {}}
                  transition={{ duration: 1.2, delay: 0.3, ease: [0, 1, 0.4, 1] }}
                >
                  ASEA
                </motion.h1>
              </div>
              <div className="overflow-hidden">
                <motion.p
                  className="font-display font-bold tracking-[-0.04em] leading-none"
                  style={{
                    fontSize: "clamp(1.5rem, 10vw, 10rem)",
                    lineHeight: 1.3,
                    color: "rgba(255,255,255,0.4)",
                  }}
                  initial={{ y: "110%" }}
                  animate={ready ? { y: 0 } : {}}
                  transition={{ duration: 1.2, delay: 0.42, ease: [0, 1, 0.4, 1] }}
                >
                  Flight Training Center
                </motion.p>
              </div>
            </div>
            <div style={{ height: SP * 5 }} />
          </div>
        </div>

        <div
          className="relative z-10 text-white"
          style={{ marginTop: "-100svh" }}
        >
          <div style={{ height: "100svh" }} />
          <AboutZoom />
          <WhyStack />
        </div>
      </div>

      <section
        className="bg-[#f0f2f5] relative z-20"
        style={{ padding: "clamp(5rem,8vw,9rem) clamp(1rem,5vw,7.75rem)" }}
      >
        <div className="max-w-[80rem] mx-auto">
          <p className="text-sm opacity-40 uppercase tracking-widest mb-5">Next Section</p>
          <h2
            className="tracking-[-0.05em]"
            style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", lineHeight: 1, fontWeight: 600 }}
          >
            다음 섹션 영역
          </h2>
          <p
            className="mt-6 opacity-40 leading-relaxed max-w-[55ch]"
            style={{ fontSize: "clamp(1rem, 1.5vw, 1.375rem)" }}
          >
            줌 인과 sticky 스태킹이 끝나면 각각 우측으로 빠지고, 자연스럽게 이 섹션으로 이어집니다.
          </p>
          <div style={{ height: "100vh" }} />
        </div>
      </section>
    </div>
  );
}
