"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* Intro — Hero 다음 첫 콘텐츠 섹션.
   Sticky Hero + Intro 조합으로 Hero 를 덮으며 등장.
   상단 라운드가 진입 마지막 15% 구간에서 flat 하게 → 뷰포트 꽉 채움.
   텍스트는 terafab.ai hero 방식 — 블록 단위로 blur 해제 + 상승 + fade 를 짧은 시차로 연달아. */

const HEADLINE =
  "예비 조종사 양성부터 항공사 입사까지 이어지는\n통합 조종사 교육 시스템을 갖춘 비행교육원입니다.";
const BODY1 =
  "본 교육원은 A320, B737, C172 FTD (Flight Training Device) 를 기반으로 이론과 실습을 결합한 현장 중심 교육을 제공하며, 국내외 항공교육 환경을 반영한 커리큘럼으로 실제 항공사 교육과정에도 빠르게 적응할 수 있는 인재를 양성하고 있습니다.";
const BODY2 =
  "해외 비행학교뿐만 아니라 미국 최고의 항공운항학과를 보유한 Embry-Riddle 항공대학교와의 협력을 통해 검증된 교육을 제공하며, 단순한 교육을 넘어 조종사 커리어의 시작부터 항공사 취업까지 책임지는 교육기관을 지향합니다.";

/* terafab heroLineIn: from { opacity 0; blur 11px; translateY 18% } → to { 1; 0; 0 }
   ease cubic-bezier(0.22, 1, 0.36, 1). 헤드라인은 blur 11px / y 18%, 본문은 8px / 14%. */
const EASE = [0.22, 1, 0.36, 1] as const;
const blockIn = (blur: number, y: string, duration: number, delay: number, inView: boolean) => ({
  initial: { opacity: 0, filter: `blur(${blur}px)`, y },
  animate: inView ? { opacity: 1, filter: "blur(0px)", y: "0%" } : undefined,
  transition: { duration, ease: EASE, delay },
});

/* '\n' → <br> */
function Lines({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {line}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

export default function Intro() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  /* IntersectionObserver 로 최초 뷰포트 진입 감지 (한 번만) */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* scrollYProgress → 상단 라운드 flatten (진입 마지막 15%) */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });
  const radius = useTransform(scrollYProgress, [0.85, 1], [48, 0]);
  const radiusPx = useTransform(radius, (r) => `${r}px`);

  return (
    <motion.section
      ref={ref}
      id="intro"
      data-nav-theme="dark"
      className="relative z-20 min-h-[100dvh] flex flex-col items-center justify-center bg-[#0a0a0a] text-white px-6 md:px-10 lg:px-16 py-24 md:py-32"
      style={{
        borderTopLeftRadius: radiusPx,
        borderTopRightRadius: radiusPx,
      }}
    >
      {/* 컨텐츠는 뷰포트 중앙, 헤드라인 ↔ body 그룹 사이에 큼직한 gap */}
      <div className="mx-auto max-w-4xl w-full flex flex-col items-center text-center gap-20 md:gap-28">
        <motion.h2
          className="font-display font-black tracking-[-0.025em] text-white leading-[1.3] break-keep-all text-[1.75rem] md:text-[2.75rem]"
          style={{ willChange: "opacity, filter, transform" }}
          {...blockIn(11, "18%", 0.82, 0.08, inView)}
        >
          <Lines text={HEADLINE} />
        </motion.h2>

        {/* body 두 문단은 그룹화 — 헤드라인 0.08s → 본문1 0.28s → 본문2 0.48s 순 등장 */}
        <div className="flex flex-col gap-8 md:gap-12 w-full">
          <motion.p
            className="text-white/75 break-keep-all text-justify leading-[1.55] text-[1rem] md:text-[1.35rem]"
            style={{ willChange: "opacity, filter, transform" }}
            {...blockIn(8, "14%", 0.78, 0.28, inView)}
          >
            {BODY1}
          </motion.p>

          <motion.p
            className="text-white/75 break-keep-all text-justify leading-[1.55] text-[1rem] md:text-[1.35rem]"
            style={{ willChange: "opacity, filter, transform" }}
            {...blockIn(8, "14%", 0.78, 0.48, inView)}
          >
            {BODY2}
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
}
