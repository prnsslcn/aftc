"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import Navbar from "@/components/layout/Navbar";

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
  "예비 조종사 양성부터 항공사 입사까지 이어지는 통합 교육입니다.",
  "A320, B737, C172 FTD를 기반으로 이론과 실습을 결합한 현장 중심 교육을 제공하며, 엠브리 리들 항공대학교와의 협력으로 검증된 커리큘럼을 운영합니다.",
  "조종사 커리어의 출발점이 되는 Why ASEA 7가지 강점을 아세아만의 방식으로 뒷받침합니다.",
];
const STAGE_COUNT = STAGES.length;

/* ═══════════════════════════════════════
   CharReveal — 글자 단위 opacity 전환
   (integratedbiosciences.com 원본 로직 재현)
   원본: chars opacity 0.5 초기 → 순차 1.0 (charFadeValue: 0.5)
   ═══════════════════════════════════════ */
const CHAR_FADE_VALUE = 0.5; // 원본 charFadeValue

function CharReveal({
  text,
  progress, // 0~1, 이 stage 내 진행도
}: {
  text: string;
  progress: number;
}) {
  const chars = text.split("");
  // 원본 JS 재현:
  // const v = Math.min(progress * 1.5, 1);
  // const m = Math.floor(v * chars.length);
  // i < m: opacity 1, i === m: 부분 보간, i > m: opacity charFadeValue(0.5)
  const v = Math.min(progress * 1.5, 1);
  const m = Math.floor(v * chars.length);
  const partial = v * chars.length - m;

  return (
    <>
      {chars.map((ch, i) => {
        let opacity: number;
        if (i < m) opacity = 1;
        else if (i === m) opacity = CHAR_FADE_VALUE + partial * (1 - CHAR_FADE_VALUE);
        else opacity = CHAR_FADE_VALUE;
        return (
          <span key={i} style={{ opacity, display: "inline-block" }}>
            {ch === " " ? "\u00A0" : ch}
          </span>
        );
      })}
    </>
  );
}

/* ═══════════════════════════════════════
   ThreeStageSection — 3단계 스크롤 텍스트 렌더
   ═══════════════════════════════════════ */
function ThreeStageSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const [p, setP] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setP(v));

  // 3개 stage 각각의 progress (0~1)
  // 각 stage는 전체의 1/3씩 차지
  const stageIndex = Math.min(STAGE_COUNT - 1, Math.floor(p * STAGE_COUNT));
  const stageLocalP = clamp(0, 1, p * STAGE_COUNT - stageIndex);

  // 전체 진행도 bar (scaleX)
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={ref}
      className="relative z-10 text-white"
      style={{ height: `${(STAGE_COUNT + 1) * 100}svh` }}
    >
      {/* sticky 뷰포트 — 원본 hero_scroller 구조 (100lvh, padding-top 70px) */}
      <div
        className="sticky top-0 flex flex-col"
        style={{ height: "100lvh", paddingTop: "70px" }}
      >
        {/* scroller_head: label (padding-top:48px, padding-bottom:44px) */}
        <div className="px-6 md:px-10 flex-shrink-0" style={{ paddingTop: 48, paddingBottom: 44 }}>
          <span
            className="inline-block rounded-full px-3 py-1.5 text-[11px] md:text-xs uppercase tracking-[.25em]"
            style={{
              background: "rgba(255,255,255,0.1)",
              color: "#fff",
            }}
          >
            What we do
          </span>
        </div>

        {/* scroller_body: progress bar + content */}
        <div className="px-6 md:px-10 flex-1 flex flex-col">
          {/* Progress bar — 원본: height 1px, track rgba(255,255,255,0.2), bar white */}
          <div
            className="relative w-full overflow-hidden"
            style={{ height: "1px", background: "rgba(255,255,255,0.2)" }}
          >
            <motion.div
              className="absolute inset-0 bg-white origin-left"
              style={{ scaleX: barScale }}
            />
          </div>

          {/* scroller_content — 데스크탑 grid 1fr:2fr, 모바일 세로 */}
          <div
            className="pt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-y-8 lg:gap-x-[var(--gap,2rem)] items-start"
          >
            {/* content_index — 배지 스타일 */}
            <div>
              <div
                className="inline-flex items-stretch justify-start font-mono leading-none"
                style={{
                  border: "1px solid rgba(255,255,255,0.4)",
                  borderRadius: "20px",
                  padding: "12px 17px",
                  fontSize: "clamp(0.75rem, 0.9vw, 0.875rem)",
                }}
              >
                <span className="inline-flex items-center justify-center min-w-[20px]">
                  {String(stageIndex + 1).padStart(2, "0")}
                </span>
                <span
                  className="inline-flex items-center justify-center min-w-[20px]"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  /
                </span>
                <span
                  className="inline-flex items-center justify-center min-w-[20px]"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  {String(STAGE_COUNT).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* content_main — 3개 stage 텍스트 (absolute 오버레이 방식) */}
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
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: i === 0 ? "relative" : "absolute",
                      visibility: isActive ? "visible" : "hidden",
                    }}
                  >
                    <p
                      className="tracking-[-0.02em]"
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
   HeroExpand (pill → video 로드 + 3-stage)
   ═══════════════════════════════════════ */
export default function HeroExpand() {
  const heroRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const loadCompleteRef = useRef(false); // load 애니메이션 완료 플래그
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [navThreshold, setNavThreshold] = useState(99999);

  // 페이지 로드 pill → video 타이머
  // 원본: clipPathDelay 0.3s + clipPathDuration 2s = 2.3s 후 완료
  // contentAnimationDelay 1.6s 시점부터 텍스트 등장
  useEffect(() => {
    const t1 = setTimeout(() => setLoaded(true), 100);
    const t2 = setTimeout(() => setReady(true), 1600);
    setNavThreshold(window.innerHeight * 4);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Lenis smooth scroll
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
    return () => { cancelAnimationFrame(rafId); lenis.destroy(); };
  }, []);

  // 스크롤 기반 애니메이션: 영상 프레임 확장 + 내부 mask radius 동기화 + 블러
  // 원본 initBackgroundAnimation 재현: inset 12→0px, radius 20→0px (스크롤 0→100svh)
  useEffect(() => {
    let raf = false;
    function tick() {
      const video = videoRef.current;
      const frame = frameRef.current;
      const mask = maskRef.current;
      if (!video || !frame) { raf = false; return; }

      const sy = window.scrollY;
      const vh = window.innerHeight;

      // Phase 1: 0~100svh — 프레임 확장
      const frameP = clamp(0, 1, sy / (vh * 0.2));
      const isDesktop = window.matchMedia("(min-width: 1025px)").matches;
      const padStart = isDesktop ? 12 : 8;
      const pad = lerp(padStart, 0, frameP);
      const radius = lerp(20, 0, frameP);
      frame.style.inset = `${pad}px`;
      frame.style.width = `calc(100% - ${pad * 2}px)`;
      frame.style.height = `calc(100% - ${pad * 2}px)`;
      frame.style.borderRadius = `${radius}px`;

      // 내부 mask도 동일한 radius로 동기화 (로드 애니메이션 완료 후에만)
      // — 프레임이 fullscreen(radius 0)이 되는데 mask가 20px radius면 모서리 빈 공간 생김
      if (mask && loadCompleteRef.current) {
        mask.style.clipPath = `inset(0% round ${radius}px)`;
      }

      // Phase 2: 블러 (hero_main 벗어난 후)
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

      <div ref={heroRef} className="relative">
        {/* 영상 레이어 — sticky로 뒤에 고정 */}
        <div
          ref={stickyRef}
          className="sticky top-0 overflow-hidden bg-white z-0"
          style={{ height: "100svh" }}
        >
          {/* background_frame: 12px inset + 20px border-radius (원본 CSS 재현)
             스크롤 시 inset:0 + radius:0 으로 확장.
             부모 sticky가 100svh이므로 frame도 100% (= 100svh) 기준으로 통일 */}
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
            </motion.div>
          </div>
        </div>

        {/* Hero main — 원본 .hero_main 재현: 일반 flow, 100lvh, 스크롤 시 자연스럽게 위로 사라짐 */}
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
                transition={{ duration: 1.2, delay: 0, ease: [0, 1, 0.4, 1] }}
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
                transition={{ duration: 1.2, delay: 0.15, ease: [0, 1, 0.4, 1] }}
              >
                Flight Training Center
              </motion.p>
            </div>
            <div style={{ height: SP * 5 }} />
          </div>

          {/* Scroll indicator — hero_main 하단 (함께 스크롤 아웃) */}
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

        {/* 3-stage 스크롤 텍스트 렌더 */}
        <ThreeStageSection />
      </div>

      {/* 다음 섹션 */}
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
            pill → 영상 로드 애니메이션과 3-stage 스크롤 텍스트 렌더링이 끝나면 이 섹션으로 이어집니다.
          </p>
          <div style={{ height: "100vh" }} />
        </div>
      </section>
    </div>
  );
}
