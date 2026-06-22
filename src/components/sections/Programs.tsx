"use client";

import { useRef } from "react";
import { Icon } from "@iconify/react";
import { motion, useInView } from "framer-motion";
import {
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

/* Ground School 13과목 — AppUpp StickyStacking 패턴 재사용.
   각 항목이 sticky 로 viewport 중앙에 차례로 등장, marginTop 음수로 80% 겹쳐서 자연스럽게 누적 */
const SUBJECTS: { subject: string; icon: string }[] = [
  { subject: "FAR Introduction", icon: "solar:book-bookmark-bold" },
  { subject: "Aerodynamics", icon: "solar:wind-bold" },
  { subject: "Aircraft System", icon: "solar:settings-bold" },
  { subject: "Aircraft Instrument", icon: "solar:speedometer-bold" },
  { subject: "Airport & Airport Operation", icon: "solar:buildings-2-bold" },
  { subject: "Airspace", icon: "solar:planet-3-bold" },
  { subject: "Navigation", icon: "solar:compass-bold" },
  { subject: "Performance", icon: "solar:chart-2-bold" },
  { subject: "Weight & Balance", icon: "solar:scale-bold" },
  { subject: "Aviation Weather", icon: "solar:cloud-bold" },
  { subject: "Aviation Weather Service", icon: "solar:satellite-bold" },
  { subject: "Aeromedical & Night Operation", icon: "solar:moon-bold" },
  { subject: "Safety of Flight", icon: "solar:shield-check-bold" },
];

function SubjectStacking() {
  const count = SUBJECTS.length;
  /* 폰트 44px / 1.25em 간격 / 공식에서 -1em shift 로 stack 을 아래로 밀어 nav 와 viewport 바닥 양쪽에서 클리어런스 확보.
     count 13 기준 첫 항목 -6.875em / 마지막 +8.125em → 900px viewport 에서 첫 y≈148, 마지막 y≈808 */
  return (
    <div className="relative flex flex-col items-center">
      {SUBJECTS.map((s, index) => (
        <div
          key={s.subject}
          className="sticky w-full"
          style={{
            top: 0,
            height: "100vh",
            paddingTop: "50vh",
            marginTop: index === 0 ? 0 : "calc(-80vh + 1.25em)",
            fontSize: "clamp(24px, 5vw, 44px)",
            fontWeight: 800,
          }}
        >
          <div
            className="flex items-center justify-center gap-3 md:gap-4 px-4"
            style={{
              transform: `translateY(calc((${index} - ${count * 0.5 - 1}) * 1.25em))`,
            }}
          >
            <Icon
              icon={s.icon}
              className="flex-shrink-0"
              style={{ fontSize: "clamp(20px, 4.5vw, 40px)" }}
            />
            <span className="tracking-[-0.02em] whitespace-nowrap">{s.subject}</span>
          </div>
        </div>
      ))}
      {/* 마지막 항목 머무는 buffer */}
      <div style={{ height: "30vh" }} />
    </div>
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


          {/* Ground School — FTD Training 과 동일한 carousel-headline-stack 구조 */}
          <section className="carousel-section mt-24 md:mt-32">
            <div className="carousel-headline-stack">
              <h3 className="headline text-1 text-1--carousel">Ground</h3>
              <div className="headline carousel-line-2 text-1 text-1--carousel" aria-hidden="true">
                School
              </div>
              <p className="carousel-tagline text-5">
                해외 비행학교 진학 전 반드시 알아야 할{" "}
                <strong className="font-semibold">이론 교육 13과목</strong> 체계적 학습
                <br />
                FAA 표준 커리큘럼을 기반으로 비행 훈련 즉시 실전에 임할 수 있도록 준비합니다.
              </p>
            </div>

            <SubjectStacking />
          </section>
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
