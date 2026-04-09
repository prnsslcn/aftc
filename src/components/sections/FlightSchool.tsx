'use client';

import { useRef, useState } from 'react';
import { Icon } from "@iconify/react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { FLIGHT_SCHOOLS, PARTNER_UNIVERSITIES } from "@/lib/constants";

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

type School = (typeof FLIGHT_SCHOOLS)[number];

function SchoolCard({ school }: { school: School }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="h-full rounded-2xl bg-transparent overflow-hidden flex flex-col">
      {/* 로고 메인 — 클릭 시 외부 링크 */}
      <a
        href={school.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${school.name} 공식 웹사이트`}
        className="group flex items-center justify-center px-8 py-12 md:px-10 md:py-16 aspect-[4/3]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={school.logo}
          alt={`${school.name} 로고`}
          className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-[1.04]"
          style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
          loading="lazy"
        />
      </a>

      {/* 학교명 + 설명 */}
      <div className="px-6 md:px-7 pb-6">
        <h4
          className="tracking-[-0.02em]"
          style={{ fontSize: "clamp(1.05rem, 1.4vw, 1.25rem)", fontWeight: 600, lineHeight: 1.3 }}
        >
          {school.name}
        </h4>
        <p
          className="mt-3 opacity-55 leading-relaxed"
          style={{ fontSize: "clamp(0.85rem, 1vw, 0.95rem)" }}
        >
          {school.description}
        </p>
      </div>

      {/* 위치 토글 */}
      <div className="mt-auto border-t border-black/[.06]">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="w-full flex items-center justify-between gap-3 px-6 md:px-7 py-4 text-left hover:bg-[#f5f6f8] transition-colors"
        >
          <span className="flex items-center gap-2 text-sm opacity-60">
            <Icon icon="solar:map-point-linear" className="text-base" />
            {school.location}
          </span>
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
            <Icon icon="solar:alt-arrow-down-linear" className="text-base opacity-50" />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="map"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="px-6 md:px-7 pb-6 pt-2">
                <div className="rounded-xl overflow-hidden bg-transparent">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={school.map}
                    alt={`${school.name} 위치`}
                    width={800}
                    height={600}
                    className="w-full h-auto block"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
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
            className="tracking-[-0.05em]"
            style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', lineHeight: 1, fontWeight: 600 }}
          >
            해외 비행학교
          </h2>
        </RevealBlock>
        <RevealBlock delay={0.16}>
          <p className="mt-6 opacity-40 leading-relaxed max-w-[60ch]" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.375rem)' }}>
            검증된 해외 비행학교와 연계를 통해 실제 조종사 면허 취득 및 비행훈련을 진행합니다.
            개인의 성향과 목표에 맞는 비행학교 선택 및 진로 설계를 지원합니다.
          </p>
        </RevealBlock>

        {/* 학교 카드 — 3분할 */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {FLIGHT_SCHOOLS.map((school, i) => (
            <RevealBlock key={school.name} delay={0.08 * (i + 1)}>
              <SchoolCard school={school} />
            </RevealBlock>
          ))}
        </div>

        {/* 멘토링 안내 */}
        <RevealBlock delay={0.32}>
          <div className="mt-10 rounded-2xl bg-white p-8 md:p-10 overflow-hidden relative border border-black/[.05]">
            <div className="grid md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-start">
              <p className="text-[11px] uppercase tracking-[.25em] opacity-40 md:pt-1">
                Mentoring Support
              </p>
              <div className="grid sm:grid-cols-2 gap-6 md:gap-10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#1767b1]/10 flex items-center justify-center flex-shrink-0">
                    <Icon icon="solar:users-group-rounded-linear" className="text-xl text-[#1767b1]" />
                  </div>
                  <div>
                    <p className="font-medium tracking-tight" style={{ fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)" }}>
                      각 학교 출신 교관 멘토링
                    </p>
                    <p className="mt-1 text-sm opacity-50">현지 교관 · 귀국 교관</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#1767b1]/10 flex items-center justify-center flex-shrink-0">
                    <Icon icon="solar:user-speak-linear" className="text-xl text-[#1767b1]" />
                  </div>
                  <div>
                    <p className="font-medium tracking-tight" style={{ fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)" }}>
                      현직 부기장 멘토링
                    </p>
                    <p className="mt-1 text-sm opacity-50">실전 커리어 가이드</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealBlock>

        {/* 협력 대학 — 4분할 */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-stretch">
          {PARTNER_UNIVERSITIES.map((uni, i) => (
            <RevealBlock key={uni.short} delay={0.4 + i * 0.06} className="h-full">
              <a
                href={uni.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${uni.name} 공식 웹사이트`}
                className="group h-full rounded-2xl bg-transparent flex flex-col overflow-hidden"
              >
                <div className="flex items-center justify-center px-8 py-12 md:px-10 md:py-16 aspect-[4/3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={uni.logo}
                    alt={`${uni.name} 로고`}
                    className="h-20 md:h-24 w-auto max-w-full object-contain transition-transform duration-700 group-hover:scale-[1.04]"
                    style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
                    loading="lazy"
                  />
                </div>
                <div className="px-6 md:px-7 pb-6 mt-auto text-center">
                  <p
                    className="tracking-[-0.02em]"
                    style={{ fontSize: "clamp(0.9rem, 1.1vw, 1.05rem)", fontWeight: 600, lineHeight: 1.3 }}
                  >
                    {uni.name}
                  </p>
                </div>
              </a>
            </RevealBlock>
          ))}
        </div>
      </div>
    </section>
  );
}
