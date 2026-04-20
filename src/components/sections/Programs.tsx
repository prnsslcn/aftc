"use client";

import { useRef, useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  GROUND_SCHOOL,
  COURSE_P1,
  COURSE_P2,
  COURSE_ERAU,
  COURSE_COMMON_NOTE,
} from "@/lib/constants";
import { useLenis } from "@/components/providers/SmoothScrollProvider";

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

/* ═══ FTD Gallery ═══ */
const FTD_IMAGES = [
  "/images/1.jpg", "/images/2.jpg", "/images/3.jpg", "/images/4.jpg",
  "/images/5.jpg", "/images/6.jpg", "/images/7.jpg", "/images/8.jpg",
  "/images/9.jpeg", "/images/10.jpg", "/images/11.jpeg",
];

function FtdGallery() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const lenis = useLenis();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) lenis?.stop();
    else { lenis?.start(); setActive(null); }
    return () => { document.body.style.overflow = ""; lenis?.start(); };
  }, [open, lenis]);

  return (
    <>
      {/* 대표 이미지 1장 */}
      <div className="mt-8 cursor-pointer group" onClick={() => setOpen(true)}>
        <div className="relative rounded-xl overflow-hidden aspect-[16/10]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/1.jpg" alt="FTD 실습실" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }} />
          <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors flex items-center justify-center">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-black text-sm font-medium px-5 py-2.5 rounded-full">
              Click
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs opacity-25 text-center">C172 FTD (Flight Training Device) 실습실</p>
      </div>

      {/* Black-BG 갤러리 */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[300] bg-black/95 overflow-y-auto md:overflow-hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <button onClick={() => setOpen(false)}
              className="fixed top-6 right-6 z-[310] w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="닫기">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" /></svg>
            </button>

            <div className="min-h-full md:h-full flex items-center justify-center p-4 md:p-12 pt-16">
              <motion.div className="w-full max-w-[80rem] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2" layout>
                {FTD_IMAGES.map((src, i) => {
                  const isActive = active === i;
                  return (
                    <motion.div
                      key={i}
                      layout="position"
                      className={`relative rounded-xl overflow-hidden cursor-pointer ${isActive ? "col-span-2 row-span-2 z-10" : ""}`}
                      onClick={() => setActive(isActive ? null : i)}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        layout: { duration: 0.8, type: "spring", stiffness: 200, damping: 30 },
                        opacity: { duration: 0.4, delay: i * 0.03 },
                        y: { duration: 0.5, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] },
                      }}
                    >
                      <motion.img
                        layout="preserve-aspect"
                        src={src}
                        alt={`실습실 ${i + 1}`}
                        className="w-full h-full object-cover"
                        style={{ minHeight: isActive ? 280 : 140 }}
                        loading="lazy"
                        transition={{ duration: 0.8, type: "spring", stiffness: 200, damping: 30 }}
                      />
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4 }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ═══ Course info display ═══ */
function CourseInfo({ course, accent }: { course: typeof COURSE_P1 | typeof COURSE_P2 | typeof COURSE_ERAU; accent: string }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="inline-block rounded-full px-3 py-1 text-[10px] uppercase tracking-[.15em] font-semibold"
          style={{ background: `${accent}15`, color: accent }}>
          {course.badge}
        </span>
      </div>
      <h4 className="tracking-[-0.03em] mb-3" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 600 }}>
        {course.title}
      </h4>
      <p className="opacity-40 text-sm mb-6 max-w-[50ch]">{course.description}</p>
      <div className="space-y-0">
        {course.rows.map((row) => (
          <div key={row.label} className="flex py-3 border-b border-black/[.04]">
            <span className="opacity-35 w-24 flex-shrink-0 text-sm">{row.label}</span>
            <span className={"highlight" in row && row.highlight ? "font-medium" : "opacity-60"} style={{ color: "highlight" in row && row.highlight ? "#16a34a" : undefined }}>
              {row.value}
            </span>
          </div>
        ))}
        <div className="flex py-3">
          <span className="opacity-35 w-24 flex-shrink-0 text-sm">비용</span>
          <span className="font-semibold">{course.cost} <span className="opacity-35 font-normal text-sm">{course.costNote}</span></span>
        </div>
      </div>

      {"benefits" in course && course.benefits && course.benefits.length > 0 && (
        <div className="mt-5 rounded-xl p-4" style={{ background: `${accent}0d`, border: `1px solid ${accent}1f` }}>
          <p className="text-[10px] uppercase tracking-[.18em] font-semibold mb-2" style={{ color: accent }}>Benefits</p>
          <ul className="space-y-1.5">
            {course.benefits.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm opacity-70">
                <Icon icon="solar:check-circle-bold" className="text-base flex-shrink-0 mt-0.5" style={{ color: accent }} />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {"footnote" in course && course.footnote && (
        <p className="mt-3 text-xs opacity-25">{course.footnote}</p>
      )}
    </div>
  );
}

export default function Programs() {
  return (
    <section id="programs" className="bg-white" style={{ padding: "clamp(5rem,8vw,9rem) clamp(0.5rem,5vw,7.75rem)" }}>
      <div className="max-w-[80rem] mx-auto">

        {/* Header */}
        <Reveal>
          <p className="text-sm opacity-40 uppercase tracking-widest mb-5">Pre-Flight Education</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="tracking-[-0.05em]" style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", lineHeight: 1, fontWeight: 600 }}>
            비행 유학 사전교육
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-6 opacity-50 leading-relaxed max-w-[60ch]" style={{ fontSize: "clamp(1rem, 1.5vw, 1.375rem)" }}>
            비행 유학 사전 교육과정은 해외 비행학교 진학을 준비하는 예비 조종사를 유학 전문 사전교육 프로그램입니다.
            해외 비행훈련 과정은 단기간 내 높은 수준의 이해와 절차 숙지가 요구되며
            사전 준비없이 시작할 경우 학습 부담 증가의 위험이 발생할 수 있습니다.
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-4 opacity-50 leading-relaxed max-w-[60ch]" style={{ fontSize: "clamp(1rem, 1.5vw, 1.375rem)" }}>
            <span className="opacity-100 font-medium">아세아 비행교육원</span>은 이러한 문제를 해결하기 위해
            해외 비행학교 교육과정을 기반으로 한 체계적인 사전교육을 제공하며
            이론과 실습(C172 FTD)을 결합한 교육을 통해 학생들이 준비된 상태로 비행훈련을 시작할 수 있도록 지원합니다.
          </p>
        </Reveal>


        {/* 교육 과정 — Ground School + FTD */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 items-start">
          {/* Ground School */}
          <Reveal>
            <div className="bg-white py-10 md:pr-12 md:border-r md:border-black/[.06]">
              <p className="text-[11px] uppercase tracking-[.2em] text-emerald-600 font-semibold mb-3">Ground School</p>
              <h3 className="tracking-[-0.03em] mb-6" style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.75rem)", fontWeight: 600 }}>이론 교육 13과목</h3>
              <div className="space-y-0">
                {GROUND_SCHOOL.map((subject, i) => (
                  <div key={subject} className="flex items-baseline gap-4 py-2 border-b border-black/[.03]">
                    <span className="font-mono text-[11px] opacity-20 w-5 text-right flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <span className="opacity-55" style={{ fontSize: "clamp(0.9rem, 1.2vw, 1.05rem)" }}>{subject}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* FTD Training */}
          <Reveal delay={0.08}>
            <div className="bg-white py-10 md:pl-12">
              <p className="text-[11px] uppercase tracking-[.2em] text-blue-600 font-semibold mb-3">FTD Training</p>
              <h3 className="tracking-[-0.03em] mb-6" style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.75rem)", fontWeight: 600 }}>FTD 실습</h3>

              {/* FTD 실습실 갤러리 */}
              <FtdGallery />
            </div>
          </Reveal>
        </div>

        {/* Phase 1 / Phase 2 / ERAU 과정 */}
        <div className="mt-20">
          <Reveal>
            <p className="text-sm opacity-40 uppercase tracking-widest mb-10">Course Options</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 items-start">
            <Reveal>
              <div className="bg-white py-10 md:pr-10 md:border-r md:border-black/[.06]">
                <CourseInfo course={COURSE_P1} accent="#16a34a" />
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="bg-white py-10 md:px-10 md:border-r md:border-black/[.06]">
                <CourseInfo course={COURSE_P2} accent="#c0425c" />
              </div>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="bg-white py-10 md:pl-10">
                <CourseInfo course={COURSE_ERAU} accent="#1767b1" />
              </div>
            </Reveal>
          </div>

          {/* 공통 안내 — 전 과정 적용 */}
          <Reveal delay={0.2}>
            <div className="mt-10 flex items-start gap-3 rounded-2xl border border-black/[.06] bg-[#f5f6f8] px-6 py-5">
              <Icon icon="solar:info-circle-bold" className="text-xl text-black/40 flex-shrink-0 mt-0.5" />
              <p className="text-sm md:text-base opacity-70 leading-relaxed">
                {COURSE_COMMON_NOTE}
              </p>
            </div>
          </Reveal>
        </div>

        {/* CTA */}
        <Reveal className="mt-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-10 border-t border-black/[.06]">
            <div>
              <h3 className="text-xl font-semibold tracking-tight">과정 문의 및 지원</h3>
              <p className="mt-2 text-sm opacity-40">자세한 과정 안내와 상담을 원하시면 아래 버튼을 통해 문의해주세요.</p>
            </div>
            <a href="#apply" className="inline-flex items-center gap-3 h-[42px] px-6 bg-black text-white text-sm rounded-full flex-shrink-0">
              지원 폼 바로가기
              <Icon icon="solar:arrow-right-up-linear" className="text-[10px] opacity-50" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
