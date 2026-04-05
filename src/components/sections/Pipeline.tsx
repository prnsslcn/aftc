"use client";

import { useRef } from "react";
import { Icon } from "@iconify/react";
import { motion, useInView } from "framer-motion";
import { PIPELINE_STEPS, FLIGHT_SCHOOL_COURSES } from "@/lib/constants";

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

const STAGES = [
  {
    num: "01",
    title: "사전교육",
    subtitle: "해외 비행학교 진학 전",
    desc: "필수 항공이론 및 비행 절차를 사전에 학습하는 단계입니다.",
    points: [
      "FAR, 항공역학, 항공기 시스템 등 Ground School 교육",
      "C172 FTD 기반 Maneuver 및 Procedure 훈련",
    ],
    color: "#1767b1",
    bgColor: "bg-blue-50",
  },
  {
    num: "02",
    title: "해외 비행유학",
    subtitle: "검증된 해외 비행학교 연계",
    desc: "실제 조종사 면허 취득 및 비행훈련을 진행합니다.",
    points: [
      "Hillsboro Aero Academy",
      "AeroGuard Flight Training Center",
      "Phoenix East Aviation",
      "개인의 성향과 목표에 맞는 비행학교 선택 및 진로 설계 지원",
    ],
    color: "#16a34a",
    bgColor: "bg-emerald-50",
  },
  {
    num: "03",
    title: "항공사 입사 준비",
    subtitle: "비행훈련 이후 실전 교육",
    desc: "항공사 입사를 위한 실전 중심 교육 단계입니다.",
    points: [
      "A320 / B737 FTD 기반 Jet Transition",
      "필기, 실기 면접준비",
      "항공사 요구 역량을 반영한 실전 교육",
    ],
    color: "#d97706",
    bgColor: "bg-amber-50",
  },
];

export default function Pipeline() {
  return (
    <section id="pipeline" className="bg-[#f0f2f5]" style={{ padding: "clamp(5rem,8vw,9rem) clamp(0.5rem,5vw,7.75rem)" }}>
      <div className="max-w-[80rem] mx-auto">

        {/* Header */}
        <Reveal>
          <p className="text-sm opacity-40 uppercase tracking-widest mb-5">Integrated Pilot Program</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display tracking-[-0.05em]" style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", lineHeight: 1, fontWeight: 400 }}>
            조종사 훈련은 단순한 훈련이 아닌<br />체계적인 단계와 전략이 필요합니다.
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 opacity-50 leading-relaxed max-w-[60ch]" style={{ fontSize: "clamp(1rem, 1.5vw, 1.375rem)" }}>
            아세아 비행교육원은 사전교육에서 해외 비행유학, 항공사 입사준비까지 이어지는
            통합 조종사 교육시스템을 통해 조종사 커리어 전과정을 설계합니다.
          </p>
        </Reveal>

        {/* 아세아의 지향점 */}
        <Reveal delay={0.2}>
          <div className="mt-10 inline-flex items-center gap-3 rounded-full bg-black px-5 py-2.5">
            <span className="text-white text-sm font-medium">단순한 교육제공이 아닌 조종사로서의 커리어 완성</span>
          </div>
        </Reveal>

        {/* 3단계 — 타임라인 */}
        <div className="mt-20 relative">
          {/* 세로 연결선 (데스크톱) */}
          <div className="hidden md:block absolute left-[60px] top-0 bottom-0 w-px bg-black/[.06]" />

          {STAGES.map((stage, i) => (
            <Reveal key={stage.title} delay={i * 0.1}>
              <div className={`relative grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 md:gap-10 ${i > 0 ? "mt-16 md:mt-20" : ""}`}>
                {/* 좌측: 번호 + 도트 */}
                <div className="flex md:flex-col items-center md:items-center gap-3">
                  <div className="relative z-10 w-[14px] h-[14px] rounded-full border-[3px] bg-white" style={{ borderColor: stage.color }} />
                  <span className="font-mono text-[11px] opacity-25">{stage.num}</span>
                </div>

                {/* 우측: 콘텐츠 */}
                <div className="pb-2">
                  <p className="text-[11px] uppercase tracking-[.15em] opacity-35 mb-2">{stage.subtitle}</p>
                  <h3 className="tracking-[-0.03em] mb-4" style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 600, color: stage.color }}>
                    {stage.title}
                  </h3>
                  <p className="opacity-50 leading-relaxed max-w-[50ch] mb-6" style={{ fontSize: "clamp(0.9rem, 1.2vw, 1.05rem)" }}>
                    {stage.desc}
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {stage.points.map((point) => (
                      <span key={point} className="flex items-center gap-2 text-sm opacity-65">
                        <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: stage.color }} />
                        {point}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* 프로그램 절차 — 수평 스텝 */}
        <Reveal className="mt-16">
          <p className="text-sm font-medium opacity-60 mb-6">프로그램 절차</p>
          <div className="flex flex-wrap items-stretch gap-0">
            {PIPELINE_STEPS.map((step, i) => (
              <div key={step.label} className="flex items-center">
                <div className="rounded-xl bg-white px-4 py-3 min-w-[120px]">
                  <p className="text-sm font-medium">{step.label}</p>
                  {step.sub && <p className="text-[11px] opacity-40 mt-0.5 leading-tight">{step.sub}</p>}
                </div>
                {i < PIPELINE_STEPS.length - 1 && (
                  <div className="w-6 flex justify-center">
                    <Icon icon="solar:arrow-right-linear" className="opacity-20 text-sm" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        {/* 세부 절차 — 텍스트 중심 */}
        <div className="mt-24">
          <Reveal>
            <p className="text-sm font-medium opacity-40 uppercase tracking-widest mb-4">After Certification</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h3 className="tracking-[-0.05em]" style={{ fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: 1.05, fontWeight: 400 }}>
              면허 취득 이후,<br />두 갈래의 길이 열립니다.
            </h3>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 opacity-40 leading-relaxed max-w-[50ch]" style={{ fontSize: "clamp(1rem, 1.5vw, 1.375rem)" }}>
              사전교육과 비행학교를 거쳐 면허를 취득한 후, 개인의 목표와 상황에 따라 두 가지 경로로 항공사 입사를 준비합니다.
            </p>
          </Reveal>

          {/* 공통 → 분기 */}
          <Reveal delay={0.15}>
            {/* 공통 */}
            <div className="mt-16 pb-10 border-b border-black/[.06] text-center">
              <p className="text-[11px] uppercase tracking-[.2em] opacity-25 mb-5">Common Path</p>
              <p className="opacity-60" style={{ fontSize: "clamp(1.1rem, 2vw, 1.5rem)" }}>
                <span className="font-semibold opacity-100">사전교육 및 입교 수속</span>
                <span className="mx-3 opacity-25">→</span>
                <span className="font-semibold opacity-100" style={{ color: "#1767b1" }}>PPL · IR · CPL · ME 취득</span>
              </p>
            </div>

            {/* 분기 */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Track A */}
              <div className="py-10 md:pr-12 md:border-r border-b md:border-b-0 border-black/[.06]">
                <p className="text-[11px] uppercase tracking-[.2em] font-semibold mb-3" style={{ color: "#c0425c" }}>Track A</p>
                <h4 className="tracking-[-0.03em] mb-4" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 600 }}>미국 / 국내 항공사</h4>
                <div className="mt-6 space-y-0">
                  {["CFI, CFII 취득", "교관 취임 후 1,000~1,500hr", "항공사 공채 준비", "미국 / 국내 항공사 입사"].map((s, i, arr) => (
                    <div key={s} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: i === arr.length - 1 ? "#c0425c" : "rgba(192,66,92,0.25)" }} />
                        {i < arr.length - 1 && <div className="w-px flex-1 min-h-[24px]" style={{ background: "rgba(192,66,92,0.15)" }} />}
                      </div>
                      <p className={`pb-5 ${i === arr.length - 1 ? "font-semibold" : "opacity-50"}`} style={{ fontSize: "clamp(1.25rem, 2vw, 1.6rem)", color: i === arr.length - 1 ? "#c0425c" : undefined }}>{s}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Track B */}
              <div className="py-10 md:pl-12">
                <p className="text-[11px] uppercase tracking-[.2em] font-semibold mb-3" style={{ color: "#1767b1" }}>Track B</p>
                <h4 className="tracking-[-0.03em] mb-4" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 600 }}>국내 항공사</h4>
                <div className="mt-6 space-y-0">
                  {["Time Building (비행시간 적립)", "Jet Rating 취득 (선택)", "항공사 공채 준비", "국내 항공사 입사"].map((s, i, arr) => (
                    <div key={s} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: i === arr.length - 1 ? "#1767b1" : "rgba(23,103,177,0.25)" }} />
                        {i < arr.length - 1 && <div className="w-px flex-1 min-h-[24px]" style={{ background: "rgba(23,103,177,0.15)" }} />}
                      </div>
                      <p className={`pb-5 ${i === arr.length - 1 ? "font-semibold" : "opacity-50"}`} style={{ fontSize: "clamp(1.25rem, 2vw, 1.6rem)", color: i === arr.length - 1 ? "#1767b1" : undefined }}>{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* 비행학교 과정 비용 테이블 */}
        <Reveal className="mt-12">
          <div className="rounded-2xl bg-white p-6 md:p-9 overflow-x-auto">
            <h3 className="text-lg font-bold tracking-tight mb-1">해외 비행학교 과정 (추정치)</h3>
            <p className="text-xs opacity-30 mb-6">* 학생의 영어, 준비상태, 기량등에 따라서 기간 및 비용은 상이합니다. 생활비 별도.</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="opacity-40 text-left border-b border-black/10">
                  <th className="pb-3 font-medium">과정</th>
                  <th className="pb-3 font-medium">비행시간(Hour)</th>
                  <th className="pb-3 font-medium">소요 기간(Month)</th>
                  <th className="pb-3 font-medium">예상비용(달러)</th>
                </tr>
              </thead>
              <tbody>
                {FLIGHT_SCHOOL_COURSES.map((c) => (
                  <tr key={c.name} className="border-b border-black/5">
                    <td className="py-3 font-medium opacity-70">{c.name}</td>
                    <td className="py-3 opacity-50">{c.hours}</td>
                    <td className="py-3 opacity-50">{c.months}</td>
                    <td className="py-3 opacity-50">{c.cost}</td>
                  </tr>
                ))}
                <tr className="border-t border-black/10">
                  <td className="py-3 font-bold">합계</td>
                  <td className="py-3 opacity-50"></td>
                  <td className="py-3 opacity-50">14~20개월</td>
                  <td className="py-3 font-bold">$110,000~$135,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
