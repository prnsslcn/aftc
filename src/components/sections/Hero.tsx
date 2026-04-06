"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

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
function map(a: number, b: number, c: number, d: number, v: number) { return ((v - a) / (b - a)) * (d - c) + c; }
function stag(p: number, n: number, s: number) {
  const t = 1 + s * (n - 1);
  return Array.from({ length: n }, (_, i) => clamp(0, 1, map(s * i, s * i + 1, 0, 1, p * t)));
}

const SP = 4, GG = 8, RD = 12;
const IMGS = ["/images/hero-aircraft.jpg", "/images/3.jpg", "/images/254431.jpg", "/images/hero-aircraft.jpg"];

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const dummyRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [ready, setReady] = useState(false);
  const m = useRef({ cx: 0, cy: 0, sr: 0 });

  const measure = useCallback(() => {
    const mask = maskRef.current, d = dummyRef.current;
    if (!mask || !d) return;
    const mw = mask.clientWidth, mh = mask.clientHeight, dw = d.clientWidth, dh = d.clientHeight;
    m.current = { cx: (mw - dw) / 2, cy: (mh - dh) / 2, sr: mw / mh > dw / dh ? 1 - dh / mh : 1 - dw / mw };
  }, []);

  useEffect(() => { measure(); setReady(true); window.addEventListener("resize", measure); return () => window.removeEventListener("resize", measure); }, [measure]);

  useEffect(() => {
    let raf = false;
    function tick() {
      const h = heroRef.current, mk = maskRef.current, inn = innerRef.current;
      if (!h || !mk || !inn) { raf = false; return; }
      const sy = window.scrollY, { cx, cy, sr } = m.current;
      const raw = clamp(0, 1, map(0, h.clientHeight - window.innerHeight, 0, 1, sy));
      const items = stag(raw, 5, 0.1), mp = EASE(items[0]);
      mk.style.clipPath = `inset(${mp * cy}px ${mp * cx}px ${mp * cy}px ${mp * cx}px round ${RD}px)`;
      inn.style.transform = `scale(${1 - mp * 0.75 * sr})`;
      imgRefs.current.forEach((img, i) => { if (img) img.style.setProperty("--ip", String(EASE(items[i + 1]))); });
      h.style.setProperty("--ui-op", String(1 - clamp(0, 1, map(0, 0.2, 0, 1, raw))));
      raf = false;
    }
    function onScroll() { if (!raf) { requestAnimationFrame(tick); raf = true; } }
    window.addEventListener("scroll", onScroll, { passive: true }); tick();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={heroRef} className="relative" style={{ height: "300svh", ["--ui-op" as string]: "1" }}>
      <div className="sticky top-0 overflow-hidden bg-white" style={{ height: "100svh", padding: SP * 2 }}>
        <div ref={maskRef} className="relative w-full h-full" style={{ clipPath: "inset(0)" }}>
          <div ref={innerRef} className="flex flex-col justify-end w-full h-full absolute inset-0 origin-center">
            <div className="absolute inset-0 bg-black" style={{ zIndex: -1 }}>
              <video className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline preload="auto">
                <source src="/images/wing.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-black/30" />
            </div>
            <div className="relative z-10 text-white" style={{ padding: `0 ${SP * 5}px` }}>
              <div style={{ opacity: "var(--ui-op)", paddingBottom: SP * 10 }}>
                <div className="overflow-hidden">
                  <motion.h1 className="font-display font-bold tracking-[-0.05em] leading-none" style={{ fontSize: "clamp(4rem, 13vw, 12rem)" }}
                    initial={{ y: "110%" }} animate={ready ? { y: 0 } : {}} transition={{ duration: 1.2, delay: 0.3, ease: [0, 1, 0.4, 1] }}>ASEA</motion.h1>
                </div>
                <div className="overflow-hidden">
                  <motion.p className="font-display font-bold tracking-[-0.04em] leading-none" style={{ fontSize: "clamp(1.5rem, 10vw, 10rem)", lineHeight: 1.3, color: "rgba(255,255,255,0.4)" }}
                    initial={{ y: "110%" }} animate={ready ? { y: 0 } : {}} transition={{ duration: 1.2, delay: 0.42, ease: [0, 1, 0.4, 1] }}>Flight Training Center</motion.p>
                </div>
              </div>
              <div style={{ height: SP * 5 }} />
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white" style={{ opacity: "var(--ui-op)" }}>
            <motion.svg width="10" height="14" viewBox="0 0 10 14" fill="none" className="opacity-50"
              animate={{ y: [0, 3, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
              <path d="M5 1v12M1 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
            </motion.svg>
            <span className="text-[10px] opacity-40 tracking-widest uppercase">Scroll to explore</span>
          </div>

          <div ref={dummyRef} className="absolute pointer-events-none" style={{ aspectRatio: "7/8", width: "33.333%", left: "33.333%", top: "50%", transform: "translateY(-50%)", visibility: "hidden" }} />
        </div>
        <div className="absolute inset-0 z-20 flex items-center pointer-events-none" style={{ padding: `0 ${GG}px` }}>
          <div className="w-full grid" style={{ aspectRatio: "1190/650", maxHeight: "85%", gridTemplateColumns: "1fr 1fr 1fr", columnGap: GG, paddingBlock: GG }}>
            <div className="flex flex-col justify-start" style={{ rowGap: GG }}>
              <div ref={el => { imgRefs.current[0] = el; }} className="rounded-xl overflow-hidden pointer-events-auto" style={{ aspectRatio: "5/3", ["--ip" as string]: "0", transform: "translate3d(calc((1 - var(--ip)) * -1 * (100% + 8px)), calc((1 - var(--ip)) * 100%), 0)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}<img src={IMGS[0]} alt="" className="w-full h-full object-cover" /></div>
              <div ref={el => { imgRefs.current[1] = el; }} className="pointer-events-auto" style={{ paddingLeft: "calc(100vw * 0.08333 - 8px * 2 * 0.08333)", ["--ip" as string]: "0", transform: "translate3d(calc((1 - var(--ip)) * -1 * (100% + 8px)), calc((1 - var(--ip)) * 100%), 0)" }}>
                <div className="rounded-xl overflow-hidden" style={{ aspectRatio: "4/3" }}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={IMGS[1]} alt="" className="w-full h-full object-cover" /></div></div>
            </div>
            <div className="flex items-center justify-center"><div style={{ aspectRatio: "7/8", width: "100%", visibility: "hidden" }} /></div>
            <div className="flex flex-col justify-end" style={{ rowGap: GG }}>
              <div ref={el => { imgRefs.current[2] = el; }} className="pointer-events-auto" style={{ paddingRight: "calc(100vw * 0.08333 - 8px * 2 * 0.08333)", ["--ip" as string]: "0", transform: "translate3d(calc((1 - var(--ip)) * 1 * (100% + 8px)), calc((1 - var(--ip)) * 100%), 0)" }}>
                <div className="rounded-xl overflow-hidden" style={{ aspectRatio: "4/3" }}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={IMGS[2]} alt="" className="w-full h-full object-cover" /></div></div>
              <div ref={el => { imgRefs.current[3] = el; }} className="rounded-xl overflow-hidden pointer-events-auto" style={{ aspectRatio: "5/3", ["--ip" as string]: "0", transform: "translate3d(calc((1 - var(--ip)) * 1 * (100% + 8px)), calc((1 - var(--ip)) * 100%), 0)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}<img src={IMGS[3]} alt="" className="w-full h-full object-cover" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
