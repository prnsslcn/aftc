"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, useInView, useMotionValueEvent, AnimatePresence, type MotionValue } from "framer-motion";

const REVEAL_EASE = [0.16, 1, 0.3, 1] as const;
import { useLenis } from "@/components/providers/SmoothScrollProvider";

const GENIE_EASE = [0.32, 0.72, 0, 1] as const;

type Rect = { left: number; top: number; width: number; height: number };
type OpenState = { index: number; fromRect: Rect; toRect: Rect } | null;

const IMAGES = [
  "/images/1.jpg",
  "/images/2.jpg",
  "/images/3.jpg",
  "/images/4.jpg",
  "/images/5.jpg",
  "/images/6.jpg",
  "/images/7.jpg",
  "/images/8.jpg",
  "/images/9.jpeg",
  "/images/10.jpg",
  "/images/11.jpeg",
];

// 각 카드가 자체 spring 으로 x 를 추적 — index 가 커질수록 stiffness 가 낮아져 lag 발생
// "신호 출발" 효과: card 0 이 가장 빠르게 반응, card 10 이 가장 느리게 따라옴
function CarouselCard({
  src,
  i,
  x,
  direction,
  onClick,
}: {
  src: string;
  i: number;
  x: MotionValue<number>;
  direction: "down" | "up";
  onClick: (e: React.MouseEvent<HTMLButtonElement>, i: number) => void;
}) {
  // motion 방향에 따라 leader 가 바뀜 — leader 가 항상 motion 방향의 앞쪽 카드
  // 아래로 (좌측 이동): card 0 (leftmost) leader → high stiff
  // 위로 (우측 이동): card 10 (rightmost) leader → high stiff
  const stiffness = direction === "down" ? 200 - i * 10 : 100 + i * 10;
  const damping = 40; // 항상 overdamped (ratio 1.41 ~ 2.0)
  const cardX = useSpring(x, { stiffness, damping, mass: 1 });
  return (
    <motion.button
      type="button"
      className="carousel-card carousel-card--interactive"
      data-card-index={i}
      aria-label={`FTD 실습실 ${i + 1} 자세히 보기`}
      onClick={(e) => onClick(e, i)}
      style={
        {
          x: cardX,
          ["--carousel-enter-delay" as string]: `${i * 50}ms`,
        } as unknown as React.CSSProperties
      }
    >
      <div className="carousel-card-shell">
        <Image
          src={src}
          alt={`FTD 실습실 ${i + 1}`}
          fill
          sizes="(max-width: 768px) 280px, 480px"
          quality={82}
          className="object-cover"
          draggable={false}
        />
      </div>
    </motion.button>
  );
}

export default function FtdSpinGallery() {
  const outerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const headlineInView = useInView(headlineRef, { once: true, margin: "0px 0px -15% 0px" });
  const [trackOverflow, setTrackOverflow] = useState(0);
  const [outerHeight, setOuterHeight] = useState("300vh");
  const [openState, setOpenState] = useState<OpenState>(null);
  const lenis = useLenis();

  // 카드 클릭 → 알라딘(Genie) 팝업. 클릭한 이미지의 rect 측정 + viewport 중앙 fullscreen rect 계산
  function handleCardClick(e: React.MouseEvent<HTMLButtonElement>, i: number) {
    const img = e.currentTarget.querySelector("img");
    if (!img) return;
    const fromRect = img.getBoundingClientRect();

    const natW = img.naturalWidth || fromRect.width;
    const natH = img.naturalHeight || fromRect.height;
    const natAR = natW / natH;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const maxW = vw * 0.92;
    const maxH = vh * 0.88;
    let targetW = maxW;
    let targetH = maxW / natAR;
    if (targetH > maxH) {
      targetH = maxH;
      targetW = maxH * natAR;
    }
    const toRect: Rect = {
      left: (vw - targetW) / 2,
      top: (vh - targetH) / 2,
      width: targetW,
      height: targetH,
    };

    setOpenState({
      index: i,
      fromRect: {
        left: fromRect.left,
        top: fromRect.top,
        width: fromRect.width,
        height: fromRect.height,
      },
      toRect,
    });
  }

  // 팝업 열려있을 때 Lenis 잠금 + ESC 닫기
  useEffect(() => {
    if (!openState) {
      lenis?.start();
      return;
    }
    lenis?.stop();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenState(null);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [openState, lenis]);

  // Track overflow + outer height 측정
  // trackOverflow = 마지막 카드의 right edge 가 (viewport right - endGap) 에 닿게 하는 이동거리
  // endGap = --page-gutter 와 동일 (사이트의 다른 섹션과 일관된 여백)
  // outer height = vh + trackOverflow → vertical 1px = horizontal 1px (1:1 speed)
  useEffect(() => {
    function measure() {
      const track = trackRef.current;
      if (!track) return;
      const cards = track.querySelectorAll<HTMLElement>(".carousel-card");
      if (!cards.length) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const pageGutter =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue("--page-gutter"),
        ) || 80;
      // row 마다 padding-left 가 다르므로 모든 카드 중 max right edge 를 찾음
      let maxRight = 0;
      cards.forEach((c) => {
        const right = c.offsetLeft + c.offsetWidth;
        if (right > maxRight) maxRight = right;
      });
      const overflow = Math.max(0, maxRight - vw + pageGutter);
      setTrackOverflow(overflow);
      setOuterHeight(`${vh + overflow}px`);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // outer 의 vertical scroll progress → track 의 translateX
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -trackOverflow]);

  // scroll 방향 감지 — x 의 velocity 부호로 판정
  // 방향이 바뀌면 spring stiffness gradient 가 뒤집혀서 양방향 모두 "신호 출발" 효과
  const [direction, setDirection] = useState<"down" | "up">("down");
  useMotionValueEvent(x, "change", () => {
    const vel = x.getVelocity();
    if (vel < 0) setDirection((p) => (p === "down" ? p : "down"));
    else if (vel > 0) setDirection((p) => (p === "up" ? p : "up"));
  });

  // Entrance — IntersectionObserver 로 carousel-container-entered 클래스 추가
  // 마지막 카드의 transform transitionend 후 hoverable 클래스 부여
  // 주의: outer 가 매우 크기 때문에 100vh sticky container 를 observe (안정적인 threshold)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let entered = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || entered) return;
        entered = true;
        observer.disconnect();
        container.classList.add("carousel-container-entered");

        const cards = container.querySelectorAll<HTMLElement>(".carousel-card");
        const lastShell = cards[cards.length - 1]?.querySelector<HTMLElement>(".carousel-card-shell");
        if (!lastShell) return;

        const onEnd = (e: TransitionEvent) => {
          if (e.propertyName !== "transform") return;
          lastShell.removeEventListener("transitionend", onEnd);
          container.querySelectorAll(".carousel-card-shell").forEach((s) => {
            s.classList.add("carousel-card-hoverable");
          });
        };
        lastShell.addEventListener("transitionend", onEnd);
      },
      { threshold: 0.35, rootMargin: "0px 0px -20% 0px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // 2-row brick layout: even index → top row, odd index → bottom row (offset by half-card)
  const row1 = IMAGES.map((src, i) => ({ src, i })).filter(({ i }) => i % 2 === 0);
  const row2 = IMAGES.map((src, i) => ({ src, i })).filter(({ i }) => i % 2 === 1);

  return (
    <section className="carousel-section">
      {/* Headline — 좌측에서 슬라이드 + scale + fade */}
      <div ref={headlineRef} className="carousel-headline-stack">
        <motion.h2
          className="headline text-1 text-1--carousel"
          initial={{ opacity: 0, x: -800, scale: 1.8 }}
          animate={headlineInView ? { opacity: 1, x: 0, scale: 1 } : {}}
          transition={{ duration: 1.5, ease: REVEAL_EASE }}
        >
          FTD
        </motion.h2>
        <motion.div
          className="headline carousel-line-2 text-1 text-1--carousel"
          aria-hidden="true"
          initial={{ opacity: 0, x: -800, scale: 1.8 }}
          animate={headlineInView ? { opacity: 1, x: 0, scale: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.12, ease: REVEAL_EASE }}
        >
          Training
        </motion.div>
        <motion.p
          className="carousel-tagline text-5"
          initial={{ opacity: 0, x: -400, scale: 1.4 }}
          animate={headlineInView ? { opacity: 1, x: 0, scale: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.28, ease: REVEAL_EASE }}
        >
          C172 FTD (Flight Training Device) 기반 실습 환경
          <br />
          Procedure · Maneuver · Navigation · Instrument Interpretation 까지 체계적으로 훈련합니다.
        </motion.p>
      </div>

      {/* Sticky horizontal scroll — outer (vertical scroll) → sticky container → motion track */}
      <div ref={outerRef} style={{ height: outerHeight, position: "relative" }}>
        <div
          ref={containerRef}
          className="carousel-container"
          data-layout="carousel"
        >
          <div ref={trackRef} className="carousel-track">
            <div className="carousel-track-row carousel-track-row--top">
              {row1.map((c) => (
                <CarouselCard
                  key={c.src}
                  src={c.src}
                  i={c.i}
                  x={x}
                  direction={direction}
                  onClick={handleCardClick}
                />
              ))}
            </div>
            <div className="carousel-track-row carousel-track-row--bottom">
              {row2.map((c) => (
                <CarouselCard
                  key={c.src}
                  src={c.src}
                  i={c.i}
                  x={x}
                  direction={direction}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Genie 팝업 — 클릭한 카드 위치에서 fullscreen 으로 확장 */}
      <AnimatePresence>
        {openState && (
          <>
            <motion.div
              key="genie-bg"
              className="fixed inset-0 z-[400] bg-black/85 backdrop-blur-md cursor-zoom-out"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: GENIE_EASE }}
              onClick={() => setOpenState(null)}
            />
            <motion.div
              key={`genie-frame-${openState.index}`}
              className="fixed z-[401] overflow-hidden shadow-2xl pointer-events-auto cursor-default"
              initial={{
                left: openState.fromRect.left,
                top: openState.fromRect.top,
                width: openState.fromRect.width,
                height: openState.fromRect.height,
                borderRadius: 24,
              }}
              animate={{
                left: openState.toRect.left,
                top: openState.toRect.top,
                width: openState.toRect.width,
                height: openState.toRect.height,
                borderRadius: 16,
              }}
              exit={{
                left: openState.fromRect.left,
                top: openState.fromRect.top,
                width: openState.fromRect.width,
                height: openState.fromRect.height,
                borderRadius: 24,
              }}
              transition={{ duration: 0.55, ease: GENIE_EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={IMAGES[openState.index]}
                alt={`FTD 실습실 ${openState.index + 1}`}
                fill
                sizes="100vw"
                quality={90}
                className="object-cover"
                draggable={false}
              />
            </motion.div>
            <motion.button
              key="genie-close"
              type="button"
              className="fixed top-6 right-6 z-[402] w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
              onClick={() => setOpenState(null)}
              aria-label="닫기"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </motion.button>
            <motion.p
              key="genie-count"
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[402] font-mono text-[11px] tracking-[.25em] text-white/50 tabular-nums"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              {String(openState.index + 1).padStart(2, "0")} / {String(IMAGES.length).padStart(2, "0")}
            </motion.p>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
