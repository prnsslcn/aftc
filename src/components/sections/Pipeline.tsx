import { Icon } from "@iconify/react";
import FadeIn from "@/components/ui/FadeIn";
import { PIPELINE_STEPS, FLIGHT_SCHOOL_COURSES } from "@/lib/constants";

const STAGES = [
  {
    num: "01",
    title: "사전교육",
    desc: "해외 비행학교 진학 전, 필수 항공이론 및 비행 절차를 사전에 학습하는 단계입니다.",
    details: ["FAR, 항공역학, 항공기 시스템 등 Ground School 교육", "C172 FTD 기반 Maneuver 및 Procedure 훈련"],
    icon: "solar:book-2-bold",
    accent: "emerald",
  },
  {
    num: "02",
    title: "해외 비행유학",
    desc: "검증된 해외 비행학교와 연계를 통해 실제 조종사 면허 취득 및 비행훈련을 진행합니다.",
    details: ["Hillsboro Aero Academy / AeroGuard / Phoenix East Aviation", "개인의 성향과 목표에 맞는 비행학교 선택 및 진로 설계 지원"],
    icon: "solar:globe-bold",
    accent: "blue",
  },
  {
    num: "03",
    title: "항공사 입사 준비",
    desc: "비행훈련 이후 항공사 입사를 위한 실전 중심 교육 단계입니다.",
    details: ["A320 / B737 FTD 기반 Jet Transition", "필기, 실기 면접준비", "항공사 요구 역량을 반영한 실전 교육"],
    icon: "solar:case-round-bold",
    accent: "amber",
  },
];

const accentMap = {
  emerald: "bg-emerald-500/10 ring-emerald-500/20 text-emerald-400",
  blue: "bg-blue-500/10 ring-blue-500/20 text-blue-400",
  amber: "bg-amber-500/10 ring-amber-500/20 text-amber-400",
};

export default function Pipeline() {
  return (
    <section id="pipeline" className="py-24 md:py-36 bg-[#0a0a0a]">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <FadeIn>
          <p className="text-[11px] uppercase tracking-[.2em] text-white/30 font-medium mb-5">
            Integrated Pilot Program
          </p>
        </FadeIn>
        <FadeIn delay={0.08}>
          <h2 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.06]">
            조종사 커리어의<br />전과정을 설계합니다.
          </h2>
        </FadeIn>
        <FadeIn delay={0.16}>
          <p className="mt-6 text-white/40 text-lg leading-relaxed max-w-[60ch]">
            조종사 훈련은 단순한 훈련이 아닌 체계적인 단계와 전략이 필요한 과정입니다.
            아세아 비행교육원은 사전교육에서 해외 비행유학, 항공사 입사준비까지 이어지는
            통합 조종사 교육시스템을 통해 조종사 커리어 전과정을 설계합니다.
          </p>
        </FadeIn>

        {/* Pipeline flow */}
        <div className="mt-16 flex flex-wrap items-center gap-3 md:gap-0">
          {PIPELINE_STEPS.map((step, i) => (
            <FadeIn key={step.label} delay={0.06 * i} className="flex items-center">
              <div className="rounded-full bg-white/[.05] ring-1 ring-white/[.08] px-4 py-2 text-sm font-medium text-white/60 whitespace-nowrap">
                {step.label}
              </div>
              {i < PIPELINE_STEPS.length - 1 && (
                <Icon icon="solar:arrow-right-linear" className="text-white/15 mx-2 hidden md:block text-xs" />
              )}
            </FadeIn>
          ))}
        </div>

        {/* 3 Stages */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {STAGES.map((stage, i) => (
            <FadeIn key={stage.title} delay={0.08 * i}>
              <div className="rounded-[1.5rem] bg-white/[.03] ring-1 ring-white/[.06] p-7 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-xl ${accentMap[stage.accent as keyof typeof accentMap]} ring-1 flex items-center justify-center`}>
                    <Icon icon={stage.icon} className="text-lg" />
                  </div>
                  <div>
                    <span className="text-white/20 font-mono text-xs">{stage.num}</span>
                    <h3 className="text-lg font-bold tracking-tight">{stage.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-white/35 leading-relaxed mb-4">{stage.desc}</p>
                <ul className="mt-auto space-y-2">
                  {stage.details.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-sm text-white/45 leading-relaxed">
                      <span className="text-white/15 mt-1.5 flex-shrink-0">-</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Flight school cost table */}
        <FadeIn className="mt-12">
          <div className="rounded-[1.5rem] bg-white/[.03] ring-1 ring-white/[.06] p-7 md:p-9 overflow-x-auto">
            <h3 className="text-lg font-bold tracking-tight mb-1">해외 비행학교 과정 (추정치)</h3>
            <p className="text-xs text-white/25 mb-6">* 학생의 영어, 준비상태, 기량등에 따라서 기간 및 비용은 상이합니다. 생활비 별도.</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/30 text-left border-b border-white/[.06]">
                  <th className="pb-3 font-medium">과정</th>
                  <th className="pb-3 font-medium">비행시간(Hour)</th>
                  <th className="pb-3 font-medium">소요 기간(Month)</th>
                  <th className="pb-3 font-medium">예상비용(달러)</th>
                </tr>
              </thead>
              <tbody>
                {FLIGHT_SCHOOL_COURSES.map((c) => (
                  <tr key={c.name} className="border-b border-white/[.04]">
                    <td className="py-3 text-white/60 font-medium">{c.name}</td>
                    <td className="py-3 text-white/45">{c.hours}</td>
                    <td className="py-3 text-white/45">{c.months}</td>
                    <td className="py-3 text-white/45">{c.cost}</td>
                  </tr>
                ))}
                <tr className="border-t border-white/[.08]">
                  <td className="py-3 text-white/70 font-semibold">합계</td>
                  <td className="py-3 text-white/45"></td>
                  <td className="py-3 text-white/45">14~20개월</td>
                  <td className="py-3 text-white/70 font-semibold">$110,000~$135,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
