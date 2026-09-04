"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* Intro — Hero 다음 첫 콘텐츠 섹션.
   Sticky Hero + Intro 조합으로 Hero 를 덮으며 등장.
   상단 라운드가 진입 마지막 15% 구간에서 flat 하게 → 뷰포트 꽉 채움.
   텍스트는 animejs.com 랜딩 스타일 char/word 단위 slide-in + fade-in stagger. */

const HEADLINE =
  "예비 조종사 양성부터 항공사 입사까지 이어지는\n통합 조종사 교육 시스템을 갖춘 비행교육원입니다.";
const BODY1 =
  "본 교육원은 A320, B737, C172 FTD (Flight Training Device) 를 기반으로 이론과 실습을 결합한 현장 중심 교육을 제공하며, 국내외 항공교육 환경을 반영한 커리큘럼으로 실제 항공사 교육과정에도 빠르게 적응할 수 있는 인재를 양성하고 있습니다.";
const BODY2 =
  "해외 비행학교뿐만 아니라 미국 최고의 항공운항학과를 보유한 Embry-Riddle 항공대학교와의 협력을 통해 검증된 교육을 제공하며, 단순한 교육을 넘어 조종사 커리어의 시작부터 항공사 취업까지 책임지는 교육기관을 지향합니다.";

/* 텍스트를 char/word 단위로 쪼개 slide-in + fade-in.
   기본 초기 상태: opacity 0, x: 0.3em (오른쪽에서 인)
   ease: [0.16, 1, 0.3, 1] (expo-out) */
function AnimatedText({
  text,
  mode,
  inView,
  baseDelay,
  stagger,
  duration = 0.7,
}: {
  text: string;
  mode: "char" | "word";
  inView: boolean;
  baseDelay: number;
  stagger: number;
  duration?: number;
}) {
  /* '\n' 은 <br> 로 렌더. 나머지는 단어 단위로 잘라 mode 에 따라 재분해 */
  const lines = text.split("\n");
  let idx = 0;
  return (
    <>
      {lines.map((line, li) => {
        const words = line.split(/(\s+)/);
        return (
          <span key={li}>
            {words.map((w, wi) => {
              if (/^\s+$/.test(w)) return <span key={wi}>{w}</span>;
              if (mode === "word") {
                const i = idx++;
                return (
                  <motion.span
                    key={wi}
                    style={{ display: "inline-block", willChange: "transform, opacity" }}
                    initial={{ opacity: 0, x: "0.3em" }}
                    animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: "0.3em" }}
                    transition={{
                      duration,
                      ease: [0.16, 1, 0.3, 1],
                      delay: baseDelay + i * stagger,
                    }}
                  >
                    {w}
                  </motion.span>
                );
              }
              /* char 모드 — 단어 wrapper 로 감싸 단어 중간 개행 방지 */
              return (
                <span key={wi} style={{ display: "inline-block" }}>
                  {[...w].map((ch, ci) => {
                    const i = idx++;
                    return (
                      <motion.span
                        key={ci}
                        style={{ display: "inline-block", willChange: "transform, opacity" }}
                        initial={{ opacity: 0, x: "0.3em" }}
                        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: "0.3em" }}
                        transition={{
                          duration,
                          ease: [0.16, 1, 0.3, 1],
                          delay: baseDelay + i * stagger,
                        }}
                      >
                        {ch}
                      </motion.span>
                    );
                  })}
                </span>
              );
            })}
            {li < lines.length - 1 && <br />}
          </span>
        );
      })}
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
      className="relative z-20 min-h-[100dvh] flex flex-col items-center justify-center bg-[#0a0a0a] text-white px-6 md:px-10 lg:px-16 py-24 md:py-32"
      style={{
        borderTopLeftRadius: radiusPx,
        borderTopRightRadius: radiusPx,
      }}
    >
      {/* 컨텐츠는 뷰포트 중앙, 헤드라인 ↔ body 그룹 사이에 큼직한 gap */}
      <div className="mx-auto max-w-4xl w-full flex flex-col items-center text-center gap-20 md:gap-28">
        <h2 className="font-display font-black tracking-[-0.025em] text-white leading-[1.3] break-keep-all text-[1.75rem] md:text-[2.75rem]">
          <AnimatedText
            text={HEADLINE}
            mode="char"
            inView={inView}
            baseDelay={0}
            stagger={0.02}
            duration={0.8}
          />
        </h2>

        {/* body 두 문단은 그룹화 — 헤드라인과 justify-between 로 분리, 그룹 내부는 gap-8/12 */}
        <div className="flex flex-col gap-8 md:gap-12 w-full">
          <p className="text-white/75 break-keep-all text-justify leading-[1.55] text-[1rem] md:text-[1.35rem]">
            <AnimatedText
              text={BODY1}
              mode="word"
              inView={inView}
              baseDelay={1.3}
              stagger={0.032}
            />
          </p>

          <p className="text-white/75 break-keep-all text-justify leading-[1.55] text-[1rem] md:text-[1.35rem]">
            <AnimatedText
              text={BODY2}
              mode="word"
              inView={inView}
              baseDelay={2.8}
              stagger={0.032}
            />
          </p>
        </div>
      </div>
    </motion.section>
  );
}
