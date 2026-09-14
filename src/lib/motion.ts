/* 블록 등장 애니메이션 — terafab.ai hero 방식.
   from { opacity 0; blur; translateY } → to { 1; 0; 0 }, ease cubic-bezier(0.22, 1, 0.36, 1).
   헤드라인은 blur 11px / y 18%, 본문은 8px / 14% 가 기준값. Intro · pipeline Journey 공용. */
export const BLOCK_EASE = [0.22, 1, 0.36, 1] as const;

export const blockIn = (blur: number, y: string, duration: number, delay: number, inView: boolean) => ({
  initial: { opacity: 0, filter: `blur(${blur}px)`, y },
  animate: inView ? { opacity: 1, filter: "blur(0px)", y: "0%" } : undefined,
  transition: { duration, ease: BLOCK_EASE, delay },
});
