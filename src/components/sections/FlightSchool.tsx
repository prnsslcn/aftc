import { Icon } from "@iconify/react";
import FadeIn from "@/components/ui/FadeIn";
import { FLIGHT_SCHOOLS } from "@/lib/constants";

export default function FlightSchool() {
  return (
    <section id="flight-school" className="py-24 md:py-36 bg-[#0a0a0a]">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <FadeIn>
          <p className="text-[11px] uppercase tracking-[.2em] text-white/30 font-medium mb-5">
            Flight Schools
          </p>
        </FadeIn>
        <FadeIn delay={0.08}>
          <h2 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.06]">
            해외 비행학교.
          </h2>
        </FadeIn>
        <FadeIn delay={0.16}>
          <p className="mt-6 text-white/40 text-lg leading-relaxed max-w-[60ch]">
            검증된 해외 비행학교와 연계를 통해 실제 조종사 면허 취득 및 비행훈련을 진행합니다.
            개인의 성향과 목표에 맞는 비행학교 선택 및 진로 설계를 지원합니다.
          </p>
        </FadeIn>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Map image */}
          <FadeIn direction="scale">
            <div className="rounded-[1.5rem] overflow-hidden h-full min-h-[280px] md:min-h-[360px] relative bg-white/[.03] ring-1 ring-white/[.06] flex items-center justify-center p-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/academy.png"
                alt="비행학교 위치 - Hillsboro, AeroGuard, Phoenix East Aviation"
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </div>
          </FadeIn>

          {/* Schools list */}
          <div className="flex flex-col gap-4">
            {FLIGHT_SCHOOLS.map((school, i) => (
              <FadeIn key={school.name} delay={0.08 * (i + 1)} direction="right">
                <div className="rounded-[1.5rem] bg-white/[.03] ring-1 ring-white/[.06] p-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon icon="solar:airplane-bold" className="text-blue-400 text-lg" />
                  </div>
                  <h4 className="font-semibold tracking-tight">{school.name}</h4>
                </div>
              </FadeIn>
            ))}

            <FadeIn delay={0.32}>
              <div className="rounded-[1.5rem] bg-white/[.03] ring-1 ring-white/[.06] p-6">
                <p className="text-sm text-white/35 leading-relaxed">
                  아세아 비행교육원은 각 비행학교의 특성을 파악하고,
                  학생 개인의 목표와 성향에 맞는 최적의 학교를 추천합니다.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
