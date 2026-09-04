"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useLenis } from "@/components/providers/SmoothScrollProvider";
import { useNavClick } from "@/components/layout/useNavClick";
import { NAV_ITEMS } from "@/lib/constants";

/* ═══════════════════════════════════════
   Hero — mp4 → pixel art (밝기 → 톤 매핑)
   비디오 프레임을 오프스크린에서 다운샘플 → 셀별 luminance → 팔레트 인덱스
   ═══════════════════════════════════════ */

/* Grayscale mono 팔레트 — 밝기 밴드별 gray tone */
const PALETTE_HEX = [
  "#fafaf8", // 0 background (skip)
  "#0a0a0a", // 1 black — 최심
  "#4a4e55", // 2 mid-dark gray
  "#7d8087", // 3 mid-light gray
  "#3a3e45", // 4 deep gray (매핑상 skip 유지)
  "#b8bbc0", // 5 lightest visible gray
] as const;

const VIDEO_SRC = "/images/hero_aviation.mp4";

/* 밝기 (0..1) → 팔레트 인덱스.
   navy (#0e2f7a) 밴드는 하늘/배경 dominant → skip 처리 */
function lumToIdx(lum: number): number {
  if (lum > 0.80) return 5; // yellow
  if (lum > 0.60) return 3; // red
  if (lum > 0.40) return 2; // blue
  if (lum > 0.20) return 0; // navy 밴드 skip (배경)
  if (lum > 0.05) return 1; // black (airplane 실루엣)
  return 0;
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lenis = useLenis();
  const handleNavClick = useNavClick();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash || !lenis) return;
    const t = setTimeout(() => {
      const target = document.querySelector(hash) as HTMLElement | null;
      if (!target) return;
      const targetY = target.getBoundingClientRect().top + window.scrollY;
      lenis.scrollTo(targetY, {
        duration: 1.6,
        easing: (t: number) =>
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
      });
    }, 700);
    return () => clearTimeout(t);
  }, [lenis]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let raf = 0;
    let cols = 0;
    let rows = 0;
    let cellCanvas = 0;
    let innerCanvas = 0;
    let padCanvas = 0;
    let cwCanvas = 0;
    let chCanvas = 0;
    let offCanvas: HTMLCanvasElement | null = null;
    let offCtx: CanvasRenderingContext2D | null = null;
    let disposed = false;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function setup() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      /* S 프리셋 — 파인 해상도 (프리미엄) — 목표 cols 고정, cellCss 는 창 폭에 맞춰 조정
         셀 크기는 [3, 10] CSS px 로 clamp */
      const TARGET_COLS = window.innerWidth < 768 ? 160 : 240;
      const cellCss = Math.max(
        3,
        Math.min(10, Math.round(rect.width / TARGET_COLS))
      );
      const innerCss = Math.max(2, cellCss - 1); // 1px gap (셀 사이 여백)
      const padCss = (cellCss - innerCss) / 2;

      cellCanvas = cellCss * dpr;
      innerCanvas = innerCss * dpr;
      padCanvas = padCss * dpr;

      cols = Math.max(24, Math.floor(rect.width / cellCss));
      rows = Math.max(12, Math.floor(rect.height / cellCss));

      cwCanvas = cols * cellCanvas;
      chCanvas = rows * cellCanvas;
      canvas!.width = cwCanvas;
      canvas!.height = chCanvas;
      ctx!.imageSmoothingEnabled = false;

      /* 다운샘플용 오프스크린 — 그리드 해상도 */
      offCanvas = document.createElement("canvas");
      offCanvas.width = cols;
      offCanvas.height = rows;
      offCtx = offCanvas.getContext("2d", { willReadFrequently: true });
      if (offCtx) offCtx.imageSmoothingEnabled = true; // 브라우저 area filter 사용
    }

    /* Reveal fade-in — 최초 렌더 시 각 셀이 랜덤 시점에 등장 */
    let revealStartMs = 0;
    const REVEAL_SPREAD_MS = 1300; // 셀들이 등장하는 시간 분포
    const CELL_FADE_MS = 200; // 각 셀 fade-in 지속

    function paint(nowTs: number) {
      if (!offCanvas || !offCtx) return;
      if (video!.readyState < 2) return;
      const vw = video!.videoWidth;
      const vh = video!.videoHeight;
      if (vw === 0 || vh === 0) return;

      /* Cover 스케일: 그리드 aspect 맞춰 원본 crop */
      const vAspect = vw / vh;
      const gAspect = cols / rows;
      let sx = 0, sy = 0, sw = vw, sh = vh;
      if (vAspect > gAspect) {
        sw = vh * gAspect;
        sx = (vw - sw) / 2;
      } else {
        sh = vw / gAspect;
        sy = (vh - sh) / 2;
      }
      offCtx.drawImage(video!, sx, sy, sw, sh, 0, 0, cols, rows);
      const src = offCtx.getImageData(0, 0, cols, rows).data;

      ctx!.fillStyle = PALETTE_HEX[0];
      ctx!.fillRect(0, 0, cwCanvas, chCanvas);

      if (!revealStartMs) revealStartMs = nowTs;
      const revealElapsed = nowTs - revealStartMs;
      const revealDone = revealElapsed >= REVEAL_SPREAD_MS + CELL_FADE_MS;

      let currentIdx = -1;
      let currentAlpha = 1;
      ctx!.globalAlpha = 1;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const r = src[i];
          const g = src[i + 1];
          const b = src[i + 2];
          /* Rec. 601 luminance */
          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const idx = lumToIdx(lum);
          if (idx === 0) continue;

          /* Reveal fade-in — 셀별 랜덤 시점 (stable hash) */
          let alpha = 1;
          if (!revealDone) {
            let h = (x * 374761393 + y * 668265263) | 0;
            h = ((h ^ (h >>> 13)) * 1274126177) | 0;
            const cellStart = ((h >>> 0) / 0xffffffff) * REVEAL_SPREAD_MS;
            const dt = revealElapsed - cellStart;
            if (dt <= 0) continue;
            alpha = dt >= CELL_FADE_MS ? 1 : dt / CELL_FADE_MS;
          }
          if (alpha !== currentAlpha) {
            ctx!.globalAlpha = alpha;
            currentAlpha = alpha;
          }

          if (idx !== currentIdx) {
            ctx!.fillStyle = PALETTE_HEX[idx];
            currentIdx = idx;
          }
          ctx!.fillRect(
            x * cellCanvas + padCanvas,
            y * cellCanvas + padCanvas,
            innerCanvas,
            innerCanvas
          );
        }
      }
      if (currentAlpha !== 1) ctx!.globalAlpha = 1;
    }

    function tick(ts: number) {
      if (disposed) return;
      paint(ts);
      raf = requestAnimationFrame(tick);
    }

    function onResize() {
      setup();
    }

    setup();

    /* 비디오 재생 */
    const v = video!;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    const playPromise = v.play();
    if (playPromise) playPromise.catch(() => {});

    if (reduce) {
      /* 저모션: 정지 프레임 한 장만 그림 */
      v.pause();
      const onSeeked = () => {
        paint(performance.now());
        v.removeEventListener("seeked", onSeeked);
      };
      v.addEventListener("seeked", onSeeked);
      v.currentTime = 0.5;
    } else {
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      className="relative w-full flex flex-col bg-[#fafaf8] overflow-hidden"
      style={{ minHeight: "100dvh" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-black/[.15]">
        {/* 모바일에서는 상단 nav pill (top-6 + 66px 높이) 과 겹치지 않도록 pt-24 로 여유 확보 */}
        <div className="pt-24 px-5 pb-5 md:p-8 lg:p-10 md:border-r md:border-black/[.15]">
          <h1
            className="font-display tracking-[-0.045em] text-[#0a0a0a]"
            style={{
              fontSize: "clamp(2.25rem, 5.5vw, 5rem)",
              fontWeight: 800,
              lineHeight: 0.95,
            }}
          >
            ABC<br />
            Flight Training Center
          </h1>
        </div>
        <div className="p-5 md:p-8 lg:p-10 flex flex-col justify-end md:justify-between gap-6">
          {/* Hero 인라인 nav — 데스크탑 전용, 그리드 우측 셀 상단.
              글로벌 Navbar 와 완전 별개 (글로벌은 Hero 구간엔 hidden).
              justify-between 으로 셀 좌우 균형, font-bold, hover 시 underline slide (좌→우). */}
          <nav className="hidden md:flex items-center justify-between gap-4 text-sm font-normal text-[#0a0a0a]">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="relative whitespace-nowrap py-1 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[#0a0a0a] after:transition-[width] after:duration-500 after:ease-[cubic-bezier(0.16,1,0.3,1)] hover:after:w-full"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/apply"
              onClick={(e) => handleNavClick(e, "/apply")}
              className="flex items-center gap-2 px-4 py-1.5 text-sm font-bold rounded-full bg-[#0a0a0a] text-white whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5"
            >
              과정 문의
            </Link>
          </nav>

          <p
            className="font-mono uppercase tracking-[.22em] text-[#0a0a0a]/75 leading-relaxed max-w-[38ch] self-end text-right md:text-left"
            style={{ fontSize: "clamp(10px, 0.8vw, 12px)" }}
          >
            A flight training center for future airline pilots.
            <br className="hidden md:block" />
            {" "}Ground School · FTD · Airline Prep.
          </p>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block w-full h-full"
          aria-hidden="true"
        />
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          loop
          playsInline
          preload="auto"
          className="absolute w-px h-px opacity-0 pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
