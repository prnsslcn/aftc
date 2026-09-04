"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/* Intro — Hero 다음 첫 콘텐츠 섹션.
   Sticky Hero + Intro 조합으로 Hero 를 덮으며 등장.
   Intro 가 뷰포트 top 에 도달할 즈음 상단 라운드가 48px → 0px 로 평평해져 꽉 채움.
   내용은 헤드라인 + 두 문단 (등장 애니메이션 없음), 중앙 정렬. */
export default function Intro() {
  const ref = useRef<HTMLElement>(null);

  /* scrollYProgress:
       0 = Intro 의 top 이 뷰포트 bottom 에 (뷰포트 밖 아래)
       1 = Intro 의 top 이 뷰포트 top 에 (완전 커버) */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });

  /* 마지막 15% 구간에서 라운드가 flat 해지도록 */
  const radius = useTransform(scrollYProgress, [0.85, 1], [48, 0]);
  const radiusPx = useTransform(radius, (r) => `${r}px`);

  return (
    <motion.section
      ref={ref}
      id="intro"
      className="relative z-20 min-h-[100dvh] flex items-center justify-center bg-[#0a0a0a] text-white px-6 md:px-10 lg:px-16 py-24 md:py-32"
      style={{
        borderTopLeftRadius: radiusPx,
        borderTopRightRadius: radiusPx,
      }}
    >
      <div className="mx-auto max-w-4xl flex flex-col items-center text-center gap-8 md:gap-12">
        <h2
          className="font-display font-black tracking-[-0.025em] text-white leading-[1.3] break-keep-all text-[1.75rem] md:text-[2.75rem]"
        >
          예비 조종사 양성부터 항공사 입사까지 이어지는 통합 조종사 교육
          시스템을 갖춘 비행교육원입니다.
        </h2>

        <p
          className="text-white/75 break-keep-all text-justify leading-[1.55] text-[1rem] md:text-[1.35rem]"
        >
          본 교육원은 A320, B737, C172 FTD (Flight Training Device) 를 기반으로
          이론과 실습을 결합한 현장 중심 교육을 제공하며, 국내외 항공교육
          환경을 반영한 커리큘럼으로 실제 항공사 교육과정에도 빠르게 적응할 수
          있는 인재를 양성하고 있습니다.
        </p>

        <p
          className="text-white/75 break-keep-all text-justify leading-[1.55] text-[1rem] md:text-[1.35rem]"
        >
          해외 비행학교뿐만 아니라 미국 최고의 항공운항학과를 보유한
          Embry-Riddle 항공대학교와의 협력을 통해 검증된 교육을 제공하며,
          단순한 교육을 넘어 조종사 커리어의 시작부터 항공사 취업까지 책임지는
          교육기관을 지향합니다.
        </p>
      </div>
    </motion.section>
  );
}
