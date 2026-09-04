"use client";

import { useEffect, useRef } from "react";
import { Lottie, type LottieHandle } from "lottie-react";
import { DropletReveal } from "@/components/ui/DropletReveal";

/* Why ABC — 7가지 이유 리스트.
   각 항목 앞: iconPath 있으면 Motion Icon (Lottie), 없으면 넘버링 */
type Item = {
  title: string;
  iconPath?: string;
};

const ITEMS: Item[] = [
  {
    title: "Embry-Riddle 항공대학 연계과정을 보유한 교육원",
    iconPath: "/icons/motion/why-01.json",
  },
  {
    title: "항공정비 교수 시스템 심화강의",
    iconPath: "/icons/motion/why-02.json",
  },
  {
    title: "FTD 기반 실습 교육으로 이해도 향상",
    iconPath: "/icons/motion/why-03.json",
  },
  {
    title: "해외 비행학교 연계 맞춤형 관리",
    iconPath: "/icons/motion/why-04.json",
  },
  {
    title: "항공사 입사 준비까지 이어지는 교육 시스템",
    iconPath: "/icons/motion/why-05.json",
  },
  {
    title: "필기 · 실기 · 면접 통합 솔루션",
    iconPath: "/icons/motion/why-06.json",
  },
  {
    title: "소수 정예 맞춤형 교육",
    iconPath: "/icons/motion/why-07.json",
  },
];

const ICON_SIZE = 64;

/* Lottie 로드 (URL fetch 자동) + 뷰포트 진입 시 처음부터 재생 */
function MotionIcon({ path }: { path: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<LottieHandle>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          handleRef.current?.seek({ frame: 0 });
          handleRef.current?.play();
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{ width: ICON_SIZE, height: ICON_SIZE }}
      className="flex-none"
    >
      <Lottie
        src={path}
        lottieRef={handleRef}
        autoplay={false}
        loop
        style={{ width: ICON_SIZE, height: ICON_SIZE }}
      />
    </div>
  );
}

export default function WhyABC() {
  return (
    <section
      className="relative z-20 bg-[#fafaf8] py-24 md:py-36 px-6 md:px-10 lg:px-16"
      style={{
        marginTop: "-48px",
        borderTopLeftRadius: "48px",
        borderTopRightRadius: "48px",
        borderBottomLeftRadius: "48px",
        borderBottomRightRadius: "48px",
      }}
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        {/* 좌: sticky 헤딩 */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <DropletReveal>
            <p className="text-[#0a0a0a]/55 font-mono uppercase tracking-[.22em] text-xs mb-5">
              Why ABC
            </p>
            <h2
              className="font-display tracking-[-0.03em] leading-[0.95] break-keep-all"
              style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)" }}
            >
              <span className="font-light">Why </span>
              <span className="font-black text-[#467ee9]">ABC</span>
              <span className="font-light">?</span>
            </h2>
            <p className="mt-6 text-[#0a0a0a]/55 max-w-sm text-sm md:text-[15px] leading-relaxed break-keep-all">
              예비 조종사 양성부터 항공사 입사까지 이어지는 통합 교육 시스템,
              일곱 가지 핵심 이유.
            </p>
          </DropletReveal>
        </div>

        {/* 우: 7가지 이유 리스트 */}
        <ul className="divide-y divide-black/[.08]">
          {ITEMS.map((item, i) => (
            <DropletReveal key={item.title} delay={80 + i * 90}>
              <li className="flex items-center gap-5 md:gap-8 py-6 md:py-8">
                {item.iconPath ? (
                  <MotionIcon path={item.iconPath} />
                ) : (
                  <span className="font-mono text-[#0a0a0a]/40 text-xs md:text-sm tracking-[.2em] flex-none w-16 text-center">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                )}
                <h3
                  className="font-light tracking-[-0.025em] leading-[1.2] break-keep-all text-[#0a0a0a]"
                  style={{ fontSize: "clamp(1.25rem, 2vw, 1.9rem)" }}
                >
                  {item.title}
                </h3>
              </li>
            </DropletReveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
