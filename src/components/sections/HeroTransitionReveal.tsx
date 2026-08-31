"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

/* Hero sticky pin + top-corner rounded 직사각형 panel.
   Panel 안에 한 줄 문장이 초기엔 뷰포트 중앙에 작게 → 스크롤에 따라 커지며 상단으로 이동.
   Reveal 완료 시점에 텍스트가 뷰포트 95% 폭, 상단 배치. */
export default function HeroTransitionReveal({
  children,
}: {
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  /* Panel 위치 (viewport 유지) + clip-path reveal + top corner flatten */
  const y = useTransform(scrollYProgress, [0, 0.5], ["-100vh", "0vh"]);
  const topInset = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
  const radius = useTransform(scrollYProgress, [0.4, 0.5], [48, 0]);
  const clipPath = useTransform(
    [topInset, radius],
    ([t, r]: number[]) => `inset(${t}% 0 0 0 round ${r}px ${r}px 0 0)`
  );

  /* Text scale + position + opacity —
     scale end 는 1.0 (자연 크기) 로 두어 최종 상태에서 upscale blur 없이 crisp 렌더.
     최종 시각 크기 유지를 위해 base font-size 를 상향 (2.4vw → 2.64vw ≈ 이전 1.1x) */
  const textScale = useTransform(scrollYProgress, [0, 0.5], [0.19, 1.0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], ["50.5vh", "-25vh"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.08], [0, 1]);

  /* Body 문단 — scale end 는 1.0 (upscale blur 방지), font-size 는 1.2x 로 보정해 최종 시각 크기 유지 */
  const body1Opacity = useTransform(scrollYProgress, [0.16, 0.24], [0, 1]);
  const body1Y = useTransform(scrollYProgress, [0.16, 0.5], ["50vh", "0vh"]);
  const body1Scale = useTransform(scrollYProgress, [0.16, 0.5], [0.42, 1.0]);
  const body2Opacity = useTransform(scrollYProgress, [0.16, 0.24], [0, 1]);
  const body2Y = useTransform(scrollYProgress, [0.16, 0.5], ["50vh", "0vh"]);
  const body2Scale = useTransform(scrollYProgress, [0.16, 0.5], [0.42, 1.0]);

  return (
    <div ref={ref} className="relative" style={{ height: "200dvh" }}>
      {/* Hero sticky pin */}
      <div className="sticky top-0 overflow-hidden" style={{ height: "100dvh" }}>
        {children}
      </div>

      {/* Nav anchor — '교육원 소개' 클릭 시 panel 완전히 덮인 상태로 landing */}
      <div
        id="intro"
        aria-hidden="true"
        className="absolute left-0"
        style={{ top: "100vh", width: 1, height: 1 }}
      />

      {/* Panel — 위치는 viewport, clip-path 로 reveal.
          bg 는 Hero 와 동일 (#fafaf8), drop-shadow 로 top edge 구분감 */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-10 bg-[#0a0a0a] overflow-hidden"
        style={{
          y,
          clipPath,
          height: "100dvh",
        }}
      >
        {/* 한 줄 문장 — flex center 기준, scale + y translate 로 애니메이션 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.h2
            className="whitespace-nowrap text-white font-display font-black tracking-[-0.025em] text-center break-keep-all"
            style={{
              fontSize: "2.64vw",
              scale: textScale,
              y: textY,
              opacity: textOpacity,
              transformOrigin: "center center",
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
            }}
          >
            예비 조종사 양성부터 항공사 입사까지 이어지는 통합 조종사 교육
            시스템을 갖춘 교육원입니다.
          </motion.h2>
        </div>

        {/* Body 문단 1 — 헤드라인 아래 중앙 (top: 50dvh), slide up + scale */}
        <motion.div
          className="absolute inset-x-0 px-6 md:px-12 lg:px-20 flex justify-center"
          style={{
            top: "50dvh",
            opacity: body1Opacity,
            y: body1Y,
            scale: body1Scale,
            transformOrigin: "center center",
          }}
        >
          <p
            className="max-w-4xl text-white leading-relaxed break-keep-all text-center"
            style={{
              fontSize: "clamp(1.2rem, 1.44vw, 1.5rem)",
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
            }}
          >
            본 교육원은 A320, B737, C172 FTD (Flight Training Device) 를 기반으로
            이론과 실습을 결합한 현장 중심 교육을 제공하며, 국내외 항공교육
            환경을 반영한 커리큘럼으로 실제 항공사 교육과정에도 빠르게 적응할 수
            있는 인재를 양성하고 있습니다.
          </p>
        </motion.div>

        {/* Body 문단 2 — Body 1 아래 (top: 72dvh), Body 1 이후 slide up + scale */}
        <motion.div
          className="absolute inset-x-0 px-6 md:px-12 lg:px-20 flex justify-center"
          style={{
            top: "72dvh",
            opacity: body2Opacity,
            y: body2Y,
            scale: body2Scale,
            transformOrigin: "center center",
          }}
        >
          <p
            className="max-w-4xl text-white leading-relaxed break-keep-all text-center"
            style={{
              fontSize: "clamp(1.2rem, 1.44vw, 1.5rem)",
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
            }}
          >
            해외 비행학교뿐만 아니라 미국 최고의 항공운항학과를 보유한
            Embry-Riddle 항공대학교와의 협력을 통해 검증된 교육을 제공하며,
            단순한 교육을 넘어 조종사 커리어의 시작부터 항공사 취업까지 책임지는
            교육기관을 지향합니다.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
