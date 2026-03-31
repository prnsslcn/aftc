import { Icon } from "@iconify/react";
import FadeIn from "@/components/ui/FadeIn";
import { CONTACT } from "@/lib/constants";

export default function Contact() {
  return (
    <section id="contact" className="py-24 md:py-36 bg-[#0a0a0a]">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <FadeIn>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[.92]">
              Your flight career
              <br />
              starts here.
            </h2>
          </FadeIn>

          <FadeIn delay={0.08}>
            <p className="mt-8 text-white/35 text-lg leading-relaxed max-w-[48ch]">
              아세아 비행교육원에서 조종사의 꿈을 시작하세요. 과정 상담 및 지원은
              아래 연락처로 문의해주세요.
            </p>
          </FadeIn>

          <FadeIn delay={0.16}>
            <div className="flex flex-wrap gap-4 mt-10">
              <a
                href="#apply"
                className="inline-flex items-center gap-3 bg-white text-[#0a0a0a] rounded-full px-8 py-4 text-[15px] font-semibold hover:scale-[1.03] active:scale-[0.97] transition-transform"
              >
                과정 문의 및 지원
                <span className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center">
                  <Icon icon="solar:arrow-right-up-linear" className="text-[10px]" />
                </span>
              </a>
              <a
                href={`tel:${CONTACT.phone}`}
                className="inline-flex items-center gap-3 bg-white/[.06] text-white ring-1 ring-white/[.1] rounded-full px-8 py-4 text-[15px] font-medium hover:scale-[1.03] active:scale-[0.97] transition-transform"
              >
                <Icon icon="solar:phone-bold" className="text-sm opacity-50" />
                전화 상담
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
