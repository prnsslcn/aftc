"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Icon } from "@iconify/react";

const HERO_WORDS = [
  { text: "준비된", color: "white" },
  { text: "조종사를", color: "white" },
  { text: "만들어갑니다.", color: "rgba(255,255,255,0.3)" },
];

const wordVariants = {
  hidden: {
    opacity: 0,
    y: "1.6em",
    rotate: 1.5,
    filter: "blur(6px)",
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      delay: 0.4 + i * 0.1,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Image zoom: 1.6 → 1.0 by 40% of hero scroll
  const imageScale = useTransform(scrollYProgress, [0, 0.4], [1.6, 1.0]);

  // Text fade by 45% of hero scroll
  const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.45], [0, 50]);
  const textFilter = useTransform(
    scrollYProgress,
    [0, 0.45],
    ["blur(0px)", "blur(10px)"]
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100dvh] flex flex-col justify-end overflow-hidden bg-[#0a0a0a]"
    >
      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 origin-center"
          style={{ scale: imageScale }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-aircraft.jpg"
            alt="훈련 항공기"
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-[#0a0a0a]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/50 to-transparent" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pb-14 md:pb-24 w-full"
        style={{
          opacity: textOpacity,
          y: textY,
          filter: textFilter,
        }}
      >
        <motion.p
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[.2em] font-medium bg-white/[.06] text-white/60 border border-white/[.08] mb-7"
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Asea Flight Training Center
        </motion.p>

        <h1 className="font-display text-[clamp(2.6rem,7vw,6.5rem)] font-bold leading-[.92] tracking-tighter">
          {HERO_WORDS.map((word, i) => (
            <span key={i}>
              {i === 2 && <br />}
              <motion.span
                className="inline-block"
                style={{ color: word.color }}
                custom={i}
                variants={wordVariants}
                initial="hidden"
                animate="visible"
              >
                {word.text}
              </motion.span>
              {i < 1 && " "}
            </span>
          ))}
        </h1>

        <motion.p
          className="mt-7 md:mt-9 text-base md:text-lg text-white/40 max-w-[54ch] leading-relaxed"
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          예비 조종사 양성부터 항공사 입사까지 이어지는 통합 조종사 교육 시스템.
          A320, B737, C172 FTD 기반의 현장 중심 교육을 제공합니다.
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center gap-4 mt-9"
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <a
            href="#programs"
            className="inline-flex items-center gap-3 bg-white text-[#0a0a0a] rounded-full px-7 py-3.5 text-[15px] font-semibold hover:scale-[1.03] active:scale-[0.97] transition-transform"
          >
            교육과정 보기
            <span className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center">
              <Icon icon="solar:arrow-right-linear" className="text-[10px]" />
            </span>
          </a>
          <a
            href="#apply"
            className="inline-flex items-center gap-2 text-white/60 text-[15px] font-medium hover:text-white transition-colors"
          >
            과정 문의 및 지원
            <Icon icon="solar:arrow-right-up-linear" className="text-[11px]" />
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        style={{ animation: "float 3s ease-in-out infinite" }}
      >
        <span className="text-white/25 text-[9px] tracking-[.25em] uppercase">
          Scroll
        </span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  );
}
