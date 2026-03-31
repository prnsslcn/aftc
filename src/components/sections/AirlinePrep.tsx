import { Icon } from "@iconify/react";
import FadeIn from "@/components/ui/FadeIn";
import { AIRLINE_PREP_POINTS } from "@/lib/constants";

export default function AirlinePrep() {
  return (
    <section id="airline-prep" className="py-24 md:py-36 bg-[#0a0a0a]">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <FadeIn>
          <p className="text-[11px] uppercase tracking-[.2em] text-white/30 font-medium mb-5">
            Airline Career Preparation
          </p>
        </FadeIn>
        <FadeIn delay={0.08}>
          <h2 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.06]">
            항공사 입사과정 교육.
          </h2>
        </FadeIn>
        <FadeIn delay={0.16}>
          <p className="mt-6 text-white/40 text-lg leading-relaxed max-w-[60ch]">
            비행훈련 이후 항공사 입사를 위한 실전 중심 교육 단계입니다.
            A320 / B737 FTD 기반 Jet Transition부터 필기, 실기, 면접준비까지
            항공사 요구 역량을 반영한 실전 교육을 제공합니다.
          </p>
        </FadeIn>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Points */}
          <FadeIn>
            <div className="rounded-[1.5rem] bg-white/[.03] ring-1 ring-white/[.06] p-7 md:p-9 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20 flex items-center justify-center">
                  <Icon icon="solar:case-round-bold" className="text-amber-400 text-lg" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">교육 특장점</h3>
              </div>
              <ol className="space-y-4">
                {AIRLINE_PREP_POINTS.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/45 leading-relaxed">
                    <span className="text-white/20 font-mono text-xs mt-0.5 w-5 text-right flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {point}
                  </li>
                ))}
              </ol>
            </div>
          </FadeIn>

          {/* Image */}
          <FadeIn delay={0.08} direction="scale">
            <div className="rounded-[1.5rem] overflow-hidden h-full min-h-[280px] md:min-h-[360px] relative bg-white/[.03] ring-1 ring-white/[.06]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/254431.jpg"
                alt="항공기"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-sm text-white/50 font-medium">
                  단순한 교육제공이 아닌 조종사로서의 커리어 완성
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
