'use client';

import { useRef } from 'react';
import { Icon } from "@iconify/react";
import { motion, useInView } from "framer-motion";
import { AIRLINE_PREP_POINTS } from "@/lib/constants";

function RevealBlock({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AirlinePrep() {
  return (
    <section id="airline-prep" className="py-[clamp(5rem,8vw,9rem)] px-[clamp(0.5rem,5vw,7.75rem)] bg-white">
      <div className="max-w-[80rem] mx-auto">
        <RevealBlock>
          <p className="text-sm opacity-40 uppercase tracking-widest mb-5">
            Airline Career Preparation
          </p>
        </RevealBlock>
        <RevealBlock delay={0.08}>
          <h2
            className="tracking-[-0.05em]"
            style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', lineHeight: 1, fontWeight: 600 }}
          >
            항공사 입사과정 교육
          </h2>
        </RevealBlock>
        <RevealBlock delay={0.16}>
          <p className="mt-6 opacity-40 leading-relaxed max-w-[60ch]" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.375rem)' }}>
            비행훈련 이후 항공사 입사를 위한 실전 중심 교육 단계입니다.
            A320 / B737 FTD 기반 Jet Transition부터 필기, 실기, 면접준비까지
            항공사 요구 역량을 반영한 실전 교육을 제공합니다.
          </p>
        </RevealBlock>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Points */}
          <RevealBlock>
            <div className="rounded-[10px] bg-[#f0f2f5] p-7 md:p-9 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Icon icon="solar:case-round-bold" className="text-amber-600 text-lg" />
                </div>
                <h3 className="text-xl font-medium tracking-tight">교육 특장점</h3>
              </div>
              <ol className="space-y-4">
                {AIRLINE_PREP_POINTS.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm opacity-50 leading-relaxed">
                    <span className="opacity-40 font-mono text-xs mt-0.5 w-5 text-right flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {point}
                  </li>
                ))}
              </ol>
            </div>
          </RevealBlock>

          {/* Image */}
          <RevealBlock delay={0.08}>
            <div className="rounded-[10px] overflow-hidden h-full min-h-[280px] md:min-h-[360px] relative bg-[#f0f2f5]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/254431.jpg"
                alt="항공기"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-sm text-white/80 font-medium">
                  단순한 교육제공이 아닌 조종사로서의 커리어 완성
                </p>
              </div>
            </div>
          </RevealBlock>
        </div>
      </div>
    </section>
  );
}
