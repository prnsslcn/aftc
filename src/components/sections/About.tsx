"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

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
const planeEase = bezier(0.15, 0.61, 0, 1);

function Planes({ targetRef }: { targetRef: React.RefObject<HTMLDivElement | null> }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = false;
    function tick() {
      const heading = targetRef.current;
      if (!heading) { raf = false; return; }
      const headingTop = heading.getBoundingClientRect().top;
      const vh = window.innerHeight;
      const start = vh * 2;
      const end = -vh * 0.5;
      const current = headingTop;
      const distance = start - end;
      const traveled = start - current;
      const p = Math.max(0, Math.min(1, traveled / distance));
      setProgress(p);
      raf = false;
    }
    function onScroll() { if (!raf) { requestAnimationFrame(tick); raf = true; } }
    window.addEventListener("scroll", onScroll, { passive: true });
    tick();
    return () => window.removeEventListener("scroll", onScroll);
  }, [targetRef]);

  const eased = planeEase(progress);
  const rightX = `${240 - eased * 250}%`;

  return (
    <motion.img
      src="/images/plane2.png"
      alt=""
      className="hidden md:block absolute pointer-events-none z-0 select-none right-0"
      style={{ width: "100vw", maxWidth: "2000px", marginRight: "-43vw", top: "8%", x: rightX }}
    />
  );
}

const WHY_ASEA = [
  { title: "Embry-Riddle 항공대학 연계과정을 보유한 교육원", desc: "미국 최고의 항공운항학과를 보유한 엠브리리들과의 협력 연계과정을 운영합니다." },
  { title: "FTD 기반 실습 교육으로 실습 이해도 향상", desc: "A320, B737, C172 FTD로 실습 이해도를 높이고, 현장에서 바로 활용 가능한 역량을 키웁니다." },
  { title: "해외 비행학교 연계로 맞춤형 관리 제공", desc: "해외 비행학교와의 네트워크로 맞춤형 관리를 제공합니다." },
  { title: "항공사 입사 준비과정까지 연계된 교육 시스템", desc: "사전교육에서 비행유학, 항공사 입사까지 이어지는 통합 교육." },
  { title: "필기, 실기, 면접 통합 솔루션 제공", desc: "필기, 실기, 면접을 아우르는 종합 준비 과정." },
  { title: "소수 정예 맞춤형 교육", desc: "소수 정예로 운영하여 개인별 밀착 지도를 제공합니다." },
];

function RevealBlock({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

function AnimText({ text, className = "", innerRef }: { text: string; className?: string; innerRef?: React.RefObject<HTMLDivElement | null> }) {
  const localRef = useRef<HTMLDivElement>(null);
  const ref = innerRef ?? localRef;
  const inView = useInView(ref, { once: true, margin: "-15%" });
  let ci = 0;
  return (
    <div ref={ref} className={className} style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", letterSpacing: "-0.05em", lineHeight: 1, fontWeight: 600 }}>
      {text.split(" ").map((word, wi, arr) => (
        <span key={wi}>
          <span className="inline-block whitespace-nowrap">
            {word.split("").map((char) => {
              const idx = ci++;
              return (
                <motion.span key={idx} className="inline-block"
                  initial={{ opacity: 0, y: "0.3em" }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: idx * 0.02, ease: [0.16, 1, 0.3, 1] }}>
                  {char}
                </motion.span>
              );
            })}
          </span>
          {wi < arr.length - 1 && " "}
        </span>
      ))}
    </div>
  );
}

function WhyItem({ index, title, desc, delay }: { index: number; title: string; desc: string; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      className="grid grid-cols-[auto_1fr] gap-6 md:gap-10 py-8 border-b border-[#d5d8dd]"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="text-sm opacity-25 font-mono pt-1" style={{ minWidth: "2rem" }}>
        {String(index).padStart(2, "0")}
      </span>
      <div>
        <p style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.75rem)", letterSpacing: "-0.03em", lineHeight: 1.2, fontWeight: 500 }}>
          {title}
        </p>
        <p className="mt-2 opacity-40 leading-relaxed" style={{ fontSize: "clamp(0.875rem, 1.2vw, 1rem)" }}>
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function About() {
  const headingRef = useRef<HTMLDivElement>(null);
  return (
    <section id="intro" className="bg-white relative overflow-hidden" style={{ padding: "clamp(5rem,8vw,9rem) clamp(0.5rem,5vw,7.75rem)" }}>
      <Planes targetRef={headingRef} />
      <div className="max-w-[80rem] mx-auto relative">
        {/* Intro text — char-by-char animation */}
        <div className="max-w-3xl mb-16 md:mb-24">
          <RevealBlock>
            <p className="text-sm opacity-40 uppercase tracking-widest mb-5">About ASEA</p>
          </RevealBlock>
          <AnimText innerRef={headingRef} text="예비 조종사 양성부터 항공사 입사까지 이어지는 통합 교육" />
          <RevealBlock delay={0.2}>
            <p className="mt-8 opacity-40 leading-relaxed max-w-[55ch]" style={{ fontSize: "clamp(1rem, 1.5vw, 1.375rem)" }}>
              아세아 비행교육원은 A320, B737, C172 FTD를 기반으로 이론과 실습을
              결합한 현장 중심 교육을 제공하며, 미국 최고의 항공운항학과를 보유한{" "}
              <span className="opacity-100 font-medium">엠브리 리들 항공대학교(Embry-Riddle Aeronautical University)</span>
              와의 협력을 통해 검증된 교육을 제공합니다.
            </p>
          </RevealBlock>
        </div>

        {/* Why ASEA — numbered list */}
        <div className="max-w-4xl">
          <RevealBlock>
            <p className="font-display" style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>
              <span className="text-[#555] font-light">Why </span><span className="text-[#1767b1]">ASEA</span><span className="text-[#555] font-light">?</span>
            </p>
          </RevealBlock>
          {WHY_ASEA.map((item, i) => (
            <WhyItem key={item.title} index={i + 1} title={item.title} desc={item.desc} delay={i * 0.05} />
          ))}
        </div>
      </div>
    </section>
  );
}
