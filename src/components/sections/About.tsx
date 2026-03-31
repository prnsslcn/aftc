import { Icon } from "@iconify/react";
import FadeIn from "@/components/ui/FadeIn";

const SMALL_CARDS = [
  {
    icon: "solar:square-academic-cap-bold",
    title: "엠브리리들 항공대학 연계",
    desc: "미국 최고의 항공운항학과를 보유한 엠브리리들과의 협력 연계과정을 운영합니다.",
  },
  {
    icon: "solar:globe-bold",
    title: "해외 비행학교 연계",
    desc: "해외 비행학교와의 네트워크로 맞춤형 관리를 제공합니다.",
  },
];

const BOTTOM_CARDS = [
  {
    icon: "solar:route-bold",
    title: "통합 교육 시스템",
    desc: "항공사 입사 준비과정까지 연계된 원스톱 교육.",
  },
  {
    icon: "solar:clipboard-check-bold",
    title: "통합 솔루션",
    desc: "필기, 실기, 면접을 아우르는 종합 준비 과정.",
  },
  {
    icon: "solar:users-group-two-rounded-bold",
    title: "소수 정예 맞춤 교육",
    desc: "소수 정예로 운영하여 개인별 밀착 지도를 제공합니다.",
  },
  {
    icon: "solar:monitor-bold",
    title: "C172 FTD 실습",
    desc: "시뮬레이터 기반 사전 실습으로 비행 이해도를 높입니다.",
  },
];

export default function About() {
  return (
    <section id="intro" className="py-24 md:py-36 bg-[#0a0a0a]">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-20 md:mb-28">
          <FadeIn>
            <p className="text-[11px] uppercase tracking-[.2em] text-white/30 font-medium mb-5">
              About ASEA
            </p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h2 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.06]">
              조종사 커리어의 시작부터
              <br />
              항공사 취업까지.
            </h2>
          </FadeIn>
          <FadeIn delay={0.16}>
            <p className="mt-6 text-white/40 text-lg leading-relaxed">
              아세아 비행교육원은 A320, B737, C172 FTD를 기반으로 이론과 실습을
              결합한 현장 중심 교육을 제공하며, 국내외 항공교육 환경을 반영한
              커리큘럼을 통해 실제 항공사 교육과정까지 빠르게 적응할 수 있는
              인재를 양성합니다.
            </p>
          </FadeIn>
          <FadeIn delay={0.24}>
            <p className="mt-4 text-white/40 text-lg leading-relaxed">
              미국 최고의 항공운항학과를 보유한{" "}
              <span className="text-white/70 font-medium">
                엠브리 리들 항공대학교(Embry-Riddle Aeronautical University)
              </span>
              와의 협력을 통해 검증된 교육을 제공합니다.
            </p>
          </FadeIn>
        </div>

        {/* Bento Grid — top row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Large card */}
          <FadeIn direction="scale" className="md:col-span-8 md:row-span-2">
            <div className="relative rounded-[1.5rem] overflow-hidden h-full min-h-[320px] md:min-h-[480px] bg-white/[.03] ring-1 ring-white/[.06]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://picsum.photos/seed/asea-ftd-training/900/650"
                alt="FTD 훈련 현장"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-[#0a0a0a]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-8">
                <p className="text-[11px] uppercase tracking-[.15em] text-white/40 font-medium mb-2">
                  Why Asea?
                </p>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                  FTD 기반 실습 교육
                </h3>
                <p className="mt-2 text-sm text-white/40 max-w-[42ch] leading-relaxed">
                  A320, B737, C172 FTD로 실습 이해도를 높이고, 현장에서 바로
                  활용 가능한 역량을 키웁니다.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Small cards */}
          {SMALL_CARDS.map((card, i) => (
            <FadeIn
              key={card.title}
              direction="right"
              delay={0.08 * (i + 1)}
              className="md:col-span-4"
            >
              <div className="rounded-[1.5rem] bg-white/[.03] ring-1 ring-white/[.06] p-6 h-full flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-white/[.05] ring-1 ring-white/[.08] flex items-center justify-center mb-4">
                  <Icon icon={card.icon} className="text-white/60 text-lg" />
                </div>
                <h4 className="font-semibold">{card.title}</h4>
                <p className="mt-2 text-sm text-white/30 leading-relaxed flex-1">
                  {card.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Bottom row — 4 cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          {BOTTOM_CARDS.map((card, i) => (
            <FadeIn key={card.title} delay={0.08 * i}>
              <div className="rounded-[1.5rem] bg-white/[.03] ring-1 ring-white/[.06] p-6 h-full">
                <div className="w-10 h-10 rounded-xl bg-white/[.05] ring-1 ring-white/[.08] flex items-center justify-center mb-4">
                  <Icon icon={card.icon} className="text-white/60 text-lg" />
                </div>
                <h4 className="font-semibold text-[15px]">{card.title}</h4>
                <p className="mt-2 text-sm text-white/30 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
