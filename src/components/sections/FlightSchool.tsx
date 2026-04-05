'use client';

import { useRef } from 'react';
import { Icon } from "@iconify/react";
import { motion, useInView } from "framer-motion";
import { FLIGHT_SCHOOLS } from "@/lib/constants";

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

export default function FlightSchool() {
  return (
    <section id="flight-school" className="py-[clamp(5rem,8vw,9rem)] px-[clamp(0.5rem,5vw,7.75rem)] bg-[#f0f2f5]">
      <div className="max-w-[80rem] mx-auto">
        <RevealBlock>
          <p className="text-sm opacity-40 uppercase tracking-widest mb-5">
            Flight Schools
          </p>
        </RevealBlock>
        <RevealBlock delay={0.08}>
          <h2
            className="font-display tracking-[-0.05em]"
            style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', lineHeight: 1, fontWeight: 400 }}
          >
            해외 비행학교.
          </h2>
        </RevealBlock>
        <RevealBlock delay={0.16}>
          <p className="mt-6 opacity-40 leading-relaxed max-w-[60ch]" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.375rem)' }}>
            검증된 해외 비행학교와 연계를 통해 실제 조종사 면허 취득 및 비행훈련을 진행합니다.
            개인의 성향과 목표에 맞는 비행학교 선택 및 진로 설계를 지원합니다.
          </p>
        </RevealBlock>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Map image */}
          <RevealBlock>
            <div className="rounded-[10px] overflow-hidden h-full min-h-[280px] md:min-h-[360px] relative bg-white flex items-center justify-center p-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/academy-1.png"
                alt="비행학교 위치 - Hillsboro, AeroGuard, Phoenix East Aviation"
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </div>
          </RevealBlock>

          {/* Schools list */}
          <div className="flex flex-col gap-4">
            {FLIGHT_SCHOOLS.map((school, i) => (
              <RevealBlock key={school.name} delay={0.08 * (i + 1)}>
                <div className="rounded-[10px] bg-white p-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon icon="solar:airplane-bold" className="text-blue-600 text-lg" />
                  </div>
                  <h4 className="font-medium tracking-tight">{school.name}</h4>
                </div>
              </RevealBlock>
            ))}

            <RevealBlock delay={0.32}>
              <div className="rounded-[10px] bg-white p-6">
                <p className="text-sm opacity-40 leading-relaxed">
                  아세아 비행교육원은 각 비행학교의 특성을 파악하고,
                  학생 개인의 목표와 성향에 맞는 최적의 학교를 추천합니다.
                </p>
              </div>
            </RevealBlock>
          </div>
        </div>
      </div>
    </section>
  );
}
