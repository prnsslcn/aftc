import { Icon } from "@iconify/react";
import FadeIn from "@/components/ui/FadeIn";

const ITEMS = [
  { icon: "solar:airplane-linear", title: "비행학교" },
  { icon: "solar:case-round-linear", title: "항공사 입사과정 교육" },
];

export default function ComingSoon() {
  return (
    <section className="py-20 md:py-28 bg-[#0f0f0f] border-y border-white/[.06]">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ITEMS.map((item, i) => (
            <FadeIn key={item.title} delay={0.08 * i}>
              <div className="rounded-[1.5rem] bg-white/[.02] ring-1 ring-white/[.05] p-7 md:p-9 text-center">
                <div className="w-12 h-12 rounded-full bg-white/[.04] ring-1 ring-white/[.06] flex items-center justify-center mx-auto mb-4">
                  <Icon icon={item.icon} className="text-white/30 text-xl" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white/50">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-white/20">준비 중입니다</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
