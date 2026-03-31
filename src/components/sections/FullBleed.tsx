"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";

export default function FullBleed() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[70vh] flex items-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <motion.img
          src="https://picsum.photos/seed/asea-sky-wide/1920/1000"
          alt="비행 전경"
          className="w-full h-full object-cover scale-[1.12]"
          style={{ y: imgY }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[#0a0a0a]/55" />
      </div>
      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-24 md:py-32 w-full">
        <FadeIn>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[.92] tracking-tighter">
            Prepare to fly,
            <br />
            before you fly.
          </h2>
        </FadeIn>
        <FadeIn delay={0.08}>
          <p className="mt-6 text-white/40 text-lg max-w-[50ch] leading-relaxed">
            해외 비행훈련은 단기간 내 높은 수준의 이해와 절차 숙지가 요구됩니다.
            사전 준비 없이 시작할 경우 학습 부담이 크게 증가할 수 있습니다.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
