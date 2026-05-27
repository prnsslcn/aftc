"use client";

import { useRef } from "react";
import { Icon } from "@iconify/react";
import { motion, useInView } from "framer-motion";
import {
  GROUND_SCHOOL,
  COURSE_P1,
  COURSE_P2,
  COURSE_ERAU,
  COURSE_COMMON_NOTE,
} from "@/lib/constants";
import FtdSpinGallery from "./programs/FtdSpinGallery";

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.65, 0, 0.35, 1] }} className={className}>
      {children}
    </motion.div>
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

// section 은 horizontal padding 없이 — 카로셀이 viewport 전체 폭 쓸 수 있게.
// 일반 콘텐츠 블록만 별도로 가로 padding + max-w 적용.
const PAD_X_STYLE = { padding: "0 clamp(0.5rem,5vw,7.75rem)" } as const;

export default function Programs() {
  return (
    <section id="programs" className="bg-[#fafaf8]" style={{ padding: "clamp(5rem,8vw,9rem) 0" }}>
      {/* Header + 교육 과정 — padded */}
      <div style={PAD_X_STYLE}>
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
              <div className="bg-[#fafaf8] py-10 md:pr-12 md:border-r md:border-black/[.06]">
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
              <div className="bg-[#fafaf8] py-10 md:pl-12">
                <p className="text-[11px] uppercase tracking-[.2em] text-blue-600 font-semibold mb-3">FTD Training</p>
                <h3 className="tracking-[-0.03em] mb-6" style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.75rem)", fontWeight: 600 }}>FTD 실습</h3>
                <p className="opacity-55 leading-relaxed max-w-[40ch]" style={{ fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)" }}>
                  C172 FTD (Flight Training Device) 기반 실습 환경.
                  Checklist · Procedure · Maneuver · Navigation · Instrument Interpretation 까지 체계적으로 훈련합니다.
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs opacity-40 font-mono uppercase tracking-[.2em]">
                  <Icon icon="solar:alt-arrow-down-linear" className="text-base" />
                  Scroll for Gallery
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* FTD 실습실 회전 갤러리 — viewport 전체 폭, padding 없음 (Shopify 원본 스타일) */}
      <FtdSpinGallery />

      {/* Course Options + CTA — padded */}
      <div style={PAD_X_STYLE}>
        <div className="max-w-[80rem] mx-auto">

          {/* Phase 1 / Phase 2 / ERAU 과정 */}
          <div className="mt-20">
            <Reveal>
              <p className="text-sm opacity-40 uppercase tracking-widest mb-10">Course Options</p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 items-start">
              <Reveal>
                <div className="bg-[#fafaf8] py-10 md:pr-10 md:border-r md:border-black/[.06]">
                  <CourseInfo course={COURSE_P1} accent="#16a34a" />
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="bg-[#fafaf8] py-10 md:px-10 md:border-r md:border-black/[.06]">
                  <CourseInfo course={COURSE_P2} accent="#c0425c" />
                </div>
              </Reveal>
              <Reveal delay={0.16}>
                <div className="bg-[#fafaf8] py-10 md:pl-10">
                  <CourseInfo course={COURSE_ERAU} accent="#1767b1" />
                </div>
              </Reveal>
            </div>

            {/* 공통 안내 — 전 과정 적용 */}
            <Reveal delay={0.2}>
              <div className="mt-10 flex items-start gap-3 rounded-2xl border border-black/[.06] bg-[#fafaf8] px-6 py-5">
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
      </div>
    </section>
  );
}
