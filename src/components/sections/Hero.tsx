"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useLenis } from "@/components/providers/SmoothScrollProvider";

/* ═══════════════════════════════════════
   유틸
   ═══════════════════════════════════════ */
function clamp(min: number, max: number, v: number) { return Math.max(min, Math.min(v, max)); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

const SP = 4;

/* ═══════════════════════════════════════
   3-stage 콘텐츠
   ═══════════════════════════════════════ */
const STAGES = [
  "예비 조종사 양성부터 항공사 입사까지\n\n이어지는 통합 교육입니다.",
  "A320, B737, C172 FTD를 기반으로\n\n이론과 실습을 결합한 현장 중심 교육을 제공하며,\n\n\nEmbry-Riddle 항공대학교와의 협력으로\n\n검증된 커리큘럼을 운영합니다.",
  "조종사 커리어의 출발점이 되는\n\nWhy ASEA 7가지 강점을\n\n아세아만의 방식으로 뒷받침합니다.",
];
const STAGE_COUNT = STAGES.length;

/* ═══════════════════════════════════════
   CharReveal — 글자 단위 opacity 전환
   원본: chars opacity 0.5 초기 → 순차 1.0 (charFadeValue: 0.5)
   ═══════════════════════════════════════ */
const CHAR_FADE_VALUE = 0.5;

function CharReveal({
  text,
  progress,
}: {
  text: string;
  progress: number;
}) {
  const chars = text.split("");
  const v = Math.min(progress * 1.5, 1);
  const m = Math.floor(v * chars.length);
  const partial = v * chars.length - m;

  return (
    <>
      {chars.map((ch, i) => {
        if (ch === "\n") return <br key={i} />;
        let opacity: number;
        if (i < m) opacity = 1;
        else if (i === m) opacity = CHAR_FADE_VALUE + partial * (1 - CHAR_FADE_VALUE);
        else opacity = CHAR_FADE_VALUE;
        return (
          <span key={i} style={{ opacity, display: "inline-block", whiteSpace: "pre" }}>
            {ch === " " ? " " : ch}
          </span>
        );
      })}
    </>
  );
}

/* ═══════════════════════════════════════
   ThreeStageSection — 3단계 스크롤 텍스트
   ═══════════════════════════════════════ */
function ThreeStageSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const [p, setP] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setP(v));

  const stageIndex = Math.min(STAGE_COUNT - 1, Math.floor(p * STAGE_COUNT));
  const stageLocalP = clamp(0, 1, p * STAGE_COUNT - stageIndex);

  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const planeLeft = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={ref}
      id="intro"
      className="relative z-10 text-white"
      style={{ height: `${(STAGE_COUNT + 1) * 100}svh` }}
    >
      <div
        className="sticky top-0 flex flex-col"
        style={{ height: "100lvh", paddingTop: "70px" }}
      >
        <div className="px-6 md:px-10 flex-shrink-0" style={{ paddingTop: 48, paddingBottom: 44 }}>
          <span
            className="inline-block rounded-full px-3 py-1.5 text-[11px] md:text-xs uppercase tracking-[.25em]"
            // style={{
            //   background: "rgba(255,255,255,0.1)",
            //   color: "#fff",
            // }}
          >
            What we do
          </span>
        </div>

        <div className="px-6 md:px-10 flex-1 flex flex-col">
          <div
            className="relative w-full"
            style={{ height: "1px", background: "rgba(255,255,255,0.2)" }}
          >
            <motion.div
              className="absolute inset-0 bg-white origin-left"
              style={{ scaleX: barScale }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              src="/images/plane1.png"
              alt=""
              aria-hidden
              className="absolute select-none pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: p > 0.005 && p < 0.995 ? 1 : 0 }}
              transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
              style={{
                top: "50%",
                left: planeLeft,
                x: "-50%",
                y: "-57%",
                height: "clamp(72px, 10vw, 120px)",
                width: "auto",
              }}
            />
          </div>

          <div className="pt-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-y-8 lg:gap-x-8 items-start">
            <div className="hidden lg:block" />
            <div className="relative w-full">
              {STAGES.map((text, i) => {
                const isActive = i === stageIndex;
                const itemP = isActive ? stageLocalP : 0;
                const y = isActive ? 0 : i < stageIndex ? -30 : 30;
                return (
                  <motion.div
                    key={i}
                    className="top-0 left-0 w-full flex flex-col"
                    animate={{ opacity: isActive ? 1 : 0, y }}
                    transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
                    style={{
                      position: i === 0 ? "relative" : "absolute",
                      visibility: isActive ? "visible" : "hidden",
                    }}
                  >
                    <p
                      className="tracking-[-0.02em] text-right"
                      style={{
                        fontSize: "clamp(1.875rem, calc(1.875rem + 2.8vw), 3.625rem)",
                        lineHeight: "1.1em",
                        fontWeight: 500,
                      }}
                    >
                      <CharReveal text={text} progress={itemP} />
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex-shrink-0" style={{ paddingBottom: 44 }} />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Hero — pill → video 로드 + 3-stage 스크롤
   ═══════════════════════════════════════ */
export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const loadCompleteRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const lenis = useLenis();

  // 페이지 로드 pill → video 타이머
  useEffect(() => {
    const t1 = setTimeout(() => setLoaded(true), 100);
    const t2 = setTimeout(() => setReady(true), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // hash 진입 (예: /pipeline → /#intro) 시 로드 애니 완료 후 해당 섹션으로 smooth-scroll
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash) return;
    if (!lenis) return;

    // load(100ms) + ready(1600ms) + 텍스트 reveal(1200ms) 종료 직후
    const t = setTimeout(() => {
      const target = document.querySelector(hash) as HTMLElement | null;
      if (!target) return;
      const targetY = target.getBoundingClientRect().top + window.scrollY;
      // ease-in-out cubic — 출발/도착 모두 부드럽게
      lenis.scrollTo(targetY, {
        duration: 2,
        easing: (t: number) =>
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
      });
    }, 2900);
    return () => clearTimeout(t);
  }, [lenis]);

  // 스크롤 기반 애니메이션: 영상 프레임 확장 + mask radius 동기화 + 블러
  useEffect(() => {
    let raf = false;
    function tick() {
      const video = videoRef.current;
      const frame = frameRef.current;
      const mask = maskRef.current;
      if (!video || !frame) { raf = false; return; }

      const sy = window.scrollY;
      const vh = window.innerHeight;

      const frameP = clamp(0, 1, sy / (vh * 0.2));
      const isDesktop = window.matchMedia("(min-width: 1025px)").matches;
      const padStart = isDesktop ? 12 : 8;
      const pad = lerp(padStart, 0, frameP);
      const radius = lerp(20, 0, frameP);
      frame.style.inset = `${pad}px`;
      frame.style.width = `calc(100% - ${pad * 2}px)`;
      frame.style.height = `calc(100% - ${pad * 2}px)`;
      frame.style.borderRadius = `${radius}px`;

      if (mask && loadCompleteRef.current) {
        mask.style.clipPath = `inset(0% round ${radius}px)`;
      }

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
    <div ref={heroRef} className="relative">
      {/* 영상 레이어 — sticky */}
      <div
        ref={stickyRef}
        className="sticky top-0 overflow-hidden bg-[#fafaf8] z-0"
        style={{ height: "100svh" }}
      >
        <div
          ref={frameRef}
          className="absolute overflow-hidden"
          style={{
            inset: "12px",
            width: "calc(100% - 24px)",
            height: "calc(100% - 24px)",
            borderRadius: "20px",
          }}
        >
          <motion.div
            ref={maskRef}
            className="absolute bg-black"
            style={{
              top: "50%",
              left: "50%",
              width: "100%",
              height: "100%",
              transform: "translate(-50%, -50%)",
            }}
            initial={{ clipPath: "inset(50% 50% 50% 50% round 200px)" }}
            animate={loaded ? { clipPath: "inset(0% round 20px)" } : {}}
            transition={{ duration: 2, delay: 0.3, ease: [0.87, 0, 0.13, 1] }}
            onAnimationComplete={() => { loadCompleteRef.current = true; }}
          >
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay loop muted playsInline preload="metadata"
              style={{ transformOrigin: "center", opacity: 0.875 }}
            >
              <source src="/images/wing.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/30" />
            {/* Bottom fade — 다음 섹션(#0a0a0a)과 자연스럽게 연결 */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 pointer-events-none"
              style={{
                height: "40vh",
                background:
                  "linear-gradient(to bottom, transparent 0%, rgba(10,10,10,0.7) 60%, #0a0a0a 100%)",
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Hero main — 일반 flow, 100svh, 스크롤 시 위로 사라짐 */}
      <div
        className="relative z-10 text-white pointer-events-none"
        style={{ marginTop: "-100svh", height: "100svh" }}
      >
        <div
          className="flex flex-col justify-end h-full"
          style={{ paddingLeft: SP * 20, paddingRight: SP * 5, paddingBottom: SP * 10 }}
        >
          <div className="overflow-hidden">
            <motion.h1
              className="font-display font-bold tracking-[-0.05em] leading-none"
              style={{ fontSize: "clamp(4rem, 13vw, 12rem)" }}
              initial={{ y: "110%" }}
              animate={ready ? { y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0, ease: [0.65, 0, 0.35, 1] }}
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
              transition={{ duration: 1.2, delay: 0.15, ease: [0.65, 0, 0.35, 1] }}
            >
              Flight Training Center
            </motion.p>
          </div>
          <div style={{ height: SP * 5 }} />
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: 0.5 }}
        >
          <motion.svg
            width="10" height="14" viewBox="0 0 10 14" fill="none"
            animate={{ y: [0, 3, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M5 1v12M1 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
          </motion.svg>
          <span className="text-[10px] opacity-80 tracking-widest uppercase">Scroll to explore</span>
        </div>
      </div>

      {/* 3-stage 스크롤 텍스트 */}
      <ThreeStageSection />
    </div>
  );
}
