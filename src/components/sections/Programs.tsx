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

/* ═══ Course Card — A. Stripe/Linear 풍 pricing card.
   constraints: CTA 없음 / 비용 focus 안 함 / ERAU = #1767b1 인버트 카드.
   Hours hero 가 메인 anchor, 비용은 하단 보조정보. ═══ */
type CourseLike = typeof COURSE_P1 | typeof COURSE_P2 | typeof COURSE_ERAU;
const ERAU_ACCENT = "#1767b1";

function CourseCard({ course }: { course: CourseLike }) {
  const recommended = "recommended" in course && course.recommended;
  const benefits = "benefits" in course ? course.benefits : undefined;
  const footnote = "footnote" in course ? course.footnote : undefined;

  /* 색상 토큰 — 추천 카드는 ERAU blue 인버트 */
  const tx = recommended
    ? {
        wrap: "bg-[#1767b1] text-white border border-white/[.08] md:-translate-y-2 shadow-[0_30px_80px_-20px_rgba(23,103,177,.5)]",
        eyebrow: "text-white/65",
        desc: "text-white/70",
        divider: "bg-white/[.18]",
        hoursLabel: "text-white/65",
        hoursNum: "text-white",
        hoursUnit: "text-white/55",
        chipBg: "bg-white/[.12] text-white",
        bulletIcon: "text-white/45",
        bulletLabel: "text-white/55",
        bulletValue: "text-white",
        bulletHighlight: "#fde68a",
        benefitsBox: "bg-white/[.08] border border-white/[.1]",
        benefitsTitle: "text-white/70",
        benefitsItem: "text-white/85",
        costBorder: "border-white/[.15]",
        costLabel: "text-white/50",
        costValue: "text-white/85",
        costNote: "text-white/45",
        footnote: "text-white/45",
        ribbon: "bg-white text-[#1767b1]",
      }
    : {
        wrap: "bg-white text-[#0a0a0a] border border-black/[.06] shadow-[0_2px_24px_-12px_rgba(0,0,0,.08)]",
        eyebrow: "text-black/40",
        desc: "text-black/55",
        divider: "bg-black/[.08]",
        hoursLabel: "text-black/40",
        hoursNum: "text-[#0a0a0a]",
        hoursUnit: "text-black/35",
        chipBg: "bg-black/[.04] text-black/70",
        bulletIcon: "text-black/25",
        bulletLabel: "text-black/40",
        bulletValue: "text-black/85",
        bulletHighlight: "#16a34a",
        benefitsBox: "bg-emerald-50 border border-emerald-200/60",
        benefitsTitle: "text-emerald-700",
        benefitsItem: "text-emerald-900/80",
        costBorder: "border-black/[.08]",
        costLabel: "text-black/40",
        costValue: "text-black/75",
        costNote: "text-black/35",
        footnote: "text-black/25",
        ribbon: "",
      };

  return (
    <article
      className={`relative flex flex-col h-full rounded-3xl p-7 md:p-9 transition-colors ${tx.wrap}`}
    >
      {/* Recommended ribbon */}
      {recommended && "recommendedLabel" in course && course.recommendedLabel && (
        <span
          className={`absolute top-5 right-5 inline-flex items-center gap-1.5 rounded-full text-[10px] uppercase tracking-[.2em] font-bold px-3 py-1.5 ${tx.ribbon}`}
        >
          <Icon icon="solar:star-bold" className="text-xs" />
          {course.recommendedLabel}
        </span>
      )}

      {/* Header */}
      <div>
        <p className={`text-[10px] uppercase tracking-[.22em] font-semibold ${tx.eyebrow}`}>
          {course.badge}
        </p>
        <h3
          className="mt-3 tracking-[-0.03em]"
          style={{
            fontSize: "clamp(1.625rem, 2.6vw, 2.125rem)",
            fontWeight: 600,
            lineHeight: 1.1,
          }}
        >
          {course.shortTitle}
        </h3>
        <p className={`mt-3 text-sm leading-relaxed max-w-[34ch] ${tx.desc}`}>
          {course.description}
        </p>
      </div>

      {/* Divider */}
      <div className={`my-8 h-px ${tx.divider}`} />

      {/* Hours hero — 메인 anchor (price 대신 시간을 hero 로) */}
      <div>
        <p className={`text-[10px] uppercase tracking-[.22em] font-semibold mb-3 ${tx.hoursLabel}`}>
          교육 시간
        </p>
        <div className="flex items-baseline gap-1.5">
          <p
            className={`tabular-nums tracking-[-0.04em] ${tx.hoursNum}`}
            style={{
              fontSize: "clamp(3rem, 5vw, 4.25rem)",
              fontWeight: 700,
              lineHeight: 0.9,
            }}
          >
            {course.hoursTotal}
          </p>
          <span className={`text-xl md:text-2xl font-normal ${tx.hoursUnit}`}>hr</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {course.hoursBreakdown.map((b) => (
            <span
              key={b.label}
              className={`text-[11px] tracking-[.02em] px-2.5 py-1 rounded-md tabular-nums ${tx.chipBg}`}
            >
              <span className="opacity-65 mr-1">{b.label}</span>
              <span className="font-semibold">{b.value}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Key bullets */}
      <ul className="mt-8 space-y-3.5">
        {course.rows.map((row) => {
          const highlight = "highlight" in row && row.highlight;
          return (
            <li key={row.label} className="flex items-start gap-3">
              <Icon
                icon="solar:check-circle-bold"
                className={`text-base flex-shrink-0 mt-0.5 ${tx.bulletIcon}`}
              />
              <div className="min-w-0 flex-1">
                <p className={`text-[10px] uppercase tracking-[.18em] font-semibold mb-0.5 ${tx.bulletLabel}`}>
                  {row.label}
                </p>
                <p
                  className={`text-[13.5px] leading-snug ${highlight ? "font-semibold" : tx.bulletValue}`}
                  style={{ color: highlight ? tx.bulletHighlight : undefined }}
                >
                  {row.value}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Benefits */}
      {benefits && benefits.length > 0 && (
        <div className={`mt-7 rounded-xl px-4 py-3.5 ${tx.benefitsBox}`}>
          <p className={`text-[10px] uppercase tracking-[.18em] font-bold mb-1.5 ${tx.benefitsTitle}`}>
            Benefits
          </p>
          <ul className="space-y-1">
            {benefits.map((b) => (
              <li key={b} className={`flex items-start gap-2 text-[13px] leading-snug ${tx.benefitsItem}`}>
                <Icon icon="solar:gift-bold" className="text-sm flex-shrink-0 mt-0.5" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footnote */}
      {footnote && (
        <p className={`mt-4 text-[11px] leading-relaxed ${tx.footnote}`}>{footnote}</p>
      )}

      {/* Spacer 로 비용 하단 고정 (CTA 없음) */}
      <div className="flex-1 min-h-[1.5rem]" />

      {/* Cost — bottom 보조정보, focusing 하지 않음 */}
      <div className={`mt-8 pt-5 border-t ${tx.costBorder}`}>
        <div className="flex items-baseline justify-between gap-3">
          <span className={`text-[10px] uppercase tracking-[.22em] font-semibold ${tx.costLabel}`}>
            과정 비용
          </span>
          <span className={`text-sm tabular-nums tracking-tight font-medium ${tx.costValue}`}>
            {course.cost}
          </span>
        </div>
        <p className={`mt-1 text-[11px] text-right ${tx.costNote}`}>{course.costNote}</p>
      </div>
    </article>
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
            <h2 className="tracking-[-0.05em]" style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", lineHeight: 1, fontWeight: 800 }}>
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

            {/* P1 · P2 · ERAU(추천, 우측) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 items-stretch">
              <Reveal className="h-full">
                <CourseCard course={COURSE_P1} />
              </Reveal>
              <Reveal delay={0.08} className="h-full">
                <CourseCard course={COURSE_P2} />
              </Reveal>
              <Reveal delay={0.16} className="h-full">
                <CourseCard course={COURSE_ERAU} />
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
