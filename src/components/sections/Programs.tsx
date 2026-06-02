"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
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

/* Ground School 과목별 이미지 (Unsplash / Pexels 무료 라이선스, /public/images/ground/).
   매핑 없는 5개 과목 (FAR, Aircraft Instrument, Airspace, Weight & Balance, Aviation Weather) 은
   빈 흰 카드로 렌더링 — 추후 이미지 추가 시 매핑만 추가하면 됨 */
const SUBJECT_IMAGES: Record<string, string> = {
  "Aerodynamics": "/images/ground/02.jpg",
  "Aircraft System": "/images/ground/03.jpg",
  "Airport & Airport Operation": "/images/ground/05.jpg",
  "Navigation": "/images/ground/07.jpg",
  "Performance": "/images/ground/08.jpg",
  "Aviation Weather Service": "/images/ground/11.jpg",
  "Aeromedical & Night Operation": "/images/ground/12.jpg",
  "Safety of Flight": "/images/ground/13.jpg",
};

/* Hero-grid 3-col 분배 — 5+4+4 = 13 과목. aspect ratio 는 컬럼별 시각적 다양성 위해 혼합.
   2-col 모바일 모드일 때는 HeroGridSection 에서 자동 재분배 */
type GridCard = { subject: string; aspect: string };
const COL_1_CARDS: GridCard[] = [
  { subject: "FAR Introduction", aspect: "1/1" },
  { subject: "Aerodynamics", aspect: "6/5" },
  { subject: "Aircraft System", aspect: "6/5" },
  { subject: "Aircraft Instrument", aspect: "1/1" },
  { subject: "Airport & Airport Operation", aspect: "9/16" },
];
const COL_2_CARDS: GridCard[] = [
  { subject: "Airspace", aspect: "6/5" },
  { subject: "Navigation", aspect: "4/5" },
  { subject: "Performance", aspect: "16/10" },
  { subject: "Weight & Balance", aspect: "1/1" },
];
const COL_3_CARDS: GridCard[] = [
  { subject: "Aviation Weather", aspect: "3/4" },
  { subject: "Aviation Weather Service", aspect: "6/5" },
  { subject: "Aeromedical & Night Operation", aspect: "4/5" },
  { subject: "Safety of Flight", aspect: "16/10" },
];

/* Shopify B5 verbatim — 컬럼/카드 인덱스로 CSS 변수 계산.
   3-col 일 때 ±350px / yBase 300 / yStep 100 — 2-col 보다 훨씬 큰 값 */
function computeCardVars(colIndex: number, cardIndex: number, totalCols: number) {
  const hash = colIndex * 7 + cardIndex * 13;
  const xRatio = totalCols === 1 ? 0 : (colIndex / (totalCols - 1)) * 2 - 1;
  const compact = totalCols <= 2;
  const xAmp = compact ? 80 : 350;
  const yBase = compact ? 120 : 300;
  const yStep = compact ? 40 : 100;
  return {
    xOffset: Math.round(xRatio * xAmp),
    yOffset: yBase + cardIndex * yStep,
    duration: 1.5 + (hash % 4) * 0.2,
  };
}

/* Hero-grid 섹션 — Shopify H5 verbatim, 3-col desktop / 2-col mobile (ResizeObserver) */
function HeroGridSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [totalCols, setTotalCols] = useState(3);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width !== 0) {
        setTotalCols(entry.contentRect.width < 768 ? 2 : 3);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const allCols = totalCols === 3 ? [COL_1_CARDS, COL_2_CARDS, COL_3_CARDS] : [
    /* 2-col 으로 재분배 — 컬럼 3 카드들을 컬럼 1/2 에 번갈아 추가 */
    [...COL_1_CARDS, ...COL_3_CARDS.filter((_, i) => i % 2 === 0)],
    [...COL_2_CARDS, ...COL_3_CARDS.filter((_, i) => i % 2 === 1)],
  ];

  return (
    <div ref={gridRef} className="mt-14 md:mt-20 hero-grid">
      {allCols.map((col, colIndex) => (
        <div
          key={colIndex}
          className="hero-grid-col"
          style={{ ["--col-offset" as string]: colIndex * 0.08 } as React.CSSProperties}
        >
          {col.map((card, cardIndex) => (
            <HeroGridCard
              key={card.subject}
              card={card}
              colIndex={colIndex}
              cardIndex={cardIndex}
              totalCols={totalCols}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* Hero-grid 카드 — Shopify V5 verbatim:
   1. IntersectionObserver threshold 0 (useInView) 로 wrapper 진입 감지
   2. .card-in 추가 → animation 시작
   3. animationend → .card-in 제거 + .card-static 추가 (hover 활성)
   B5 함수로 컬럼/카드 인덱스 + totalCols 로 --card-x/y/dur 계산 */
function HeroGridCard({
  card,
  colIndex,
  cardIndex,
  totalCols,
}: {
  card: GridCard;
  colIndex: number;
  cardIndex: number;
  totalCols: number;
}) {
  const { xOffset, yOffset, duration } = computeCardVars(colIndex, cardIndex, totalCols);
  const cardRef = useRef<HTMLDivElement>(null);
  // Shopify V5 는 IntersectionObserver threshold 0, rootMargin 없음 — wrapper 가 viewport 진입 시점에 즉시 트리거
  const inView = useInView(cardRef, { once: true });
  const [stage, setStage] = useState<"initial" | "in" | "static">("initial");

  useEffect(() => {
    if (inView && stage === "initial") setStage("in");
  }, [inView, stage]);

  const imageSrc = SUBJECT_IMAGES[card.subject];

  return (
    <div
      ref={cardRef}
      className="hero-grid-card-wrap"
      style={
        {
          ["--card-aspect" as string]: card.aspect,
          ["--card-x" as string]: `${xOffset}px`,
          ["--card-y" as string]: `${yOffset}px`,
          ["--card-dur" as string]: `${duration}s`,
          ["--hero-card-delay" as string]: "0ms",
          ["--card-bg" as string]: "#fff",
        } as React.CSSProperties
      }
    >
      <button
        type="button"
        aria-label={card.subject}
        className={`hero-grid-card ${stage === "in" ? "card-in" : ""} ${stage === "static" ? "card-static" : ""}`}
        onAnimationEnd={() => stage === "in" && setStage("static")}
      >
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={card.subject}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            quality={82}
            className="hero-grid-card-poster"
          />
        )}
      </button>
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

            <HeroGridSection />
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
