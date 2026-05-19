"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useLenis } from "@/components/providers/SmoothScrollProvider";

// fruitful.com 시퀀스: expo.inOut 1.2s
const D = 1.2;
const EASE = [0.87, 0, 0.13, 1] as [number, number, number, number];

type Ctx = {
  runLeave: () => Promise<void>;
  runEnter: (isHome: boolean) => Promise<void>;
  inTransition: () => boolean;
  awaitNextChildrenChange: () => Promise<void>;
};

const TransitionContext = createContext<Ctx>({
  runLeave: async () => {},
  runEnter: async () => {},
  inTransition: () => false,
  awaitNextChildrenChange: async () => {},
});

export function usePageTransition() {
  return useContext(TransitionContext);
}

export function PageTransition({
  navbar,
  children,
}: {
  navbar?: ReactNode;
  children: ReactNode;
}) {
  const lenis = useLenis();
  const [active, setActive] = useState(false);
  const inTransitionRef = useRef(false);

  // children prop 변경 감지를 위한 waiter (router.push 후 React 가 children 을
  // 새 페이지로 commit 할 때까지 기다리기 위함)
  const childrenWaiterRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (childrenWaiterRef.current) {
      childrenWaiterRef.current();
      childrenWaiterRef.current = null;
    }
  }, [children]);

  function awaitNextChildrenChange(): Promise<void> {
    return new Promise<void>((resolve) => {
      childrenWaiterRef.current = resolve;
    });
  }

  const contentControls = useAnimationControls();
  const loadBgControls = useAnimationControls();
  const overlayControls = useAnimationControls();

  async function runLeave() {
    inTransitionRef.current = true;
    setActive(true);
    await new Promise<void>((r) =>
      requestAnimationFrame(() => requestAnimationFrame(() => r()))
    );

    // 매 transition 시작 시 초기 상태로 리셋 (반복 전환 대비)
    // fruitful 동일: borderRadius 단위를 corner 별로 일관되게 유지 (top corners vw, bottom corners px)
    loadBgControls.set({
      scaleY: 0,
      borderRadius: "100vw 100vw 0px 0px",
      originY: 1,
    });
    overlayControls.set({ opacity: 0 });
    contentControls.set({ y: 0 });
    await new Promise<void>((r) => requestAnimationFrame(() => r()));

    // leave: content y 0→-10svh, overlay 0→1, load-bg origin-bottom scaleY 0→1, top corners 100vw→0vw
    await Promise.all([
      contentControls.start({
        y: "-10svh",
        transition: { duration: D, ease: EASE },
      }),
      overlayControls.start({
        opacity: 1,
        transition: { duration: D, ease: EASE },
      }),
      loadBgControls.start({
        scaleY: 1,
        borderRadius: "0vw 0vw 0px 0px",
        transition: { duration: D, ease: EASE },
      }),
    ]);
  }

  async function runEnter(isHome: boolean) {
    // 페이지 swap 시점에 scroll 0 으로 리셋 (블라인드 가린 상태)
    lenis?.scrollTo(0, { immediate: true });

    if (isHome) {
      // Home 행: enter 스킵, Hero pill 애니로 entrance
      contentControls.set({ y: 0 });
      setActive(false);
      inTransitionRef.current = false;
      return;
    }

    // enter 준비: content 10vh 아래, load-bg origin-top 으로 flip + borderRadius enter 시작 형태로 리셋
    // fruitful 동일: top corners px, bottom corners vw
    contentControls.set({ y: "10vh" });
    loadBgControls.set({
      originY: 0,
      borderRadius: "0px 0px 0vw 0vw",
    });
    await new Promise<void>((r) => requestAnimationFrame(() => r()));

    // enter: content y 10vh→0, overlay 1→0, load-bg scaleY 1→0
    await Promise.all([
      contentControls.start({
        y: 0,
        transition: { duration: D, ease: EASE },
      }),
      overlayControls.start({
        opacity: 0,
        transition: { duration: D, ease: EASE },
      }),
      loadBgControls.start({
        scaleY: 0,
        borderRadius: "0px 0px 100vw 100vw",
        transition: { duration: D, ease: EASE },
      }),
    ]);

    setActive(false);
    inTransitionRef.current = false;
  }

  return (
    <TransitionContext.Provider
      value={{
        runLeave,
        runEnter,
        inTransition: () => inTransitionRef.current,
        awaitNextChildrenChange,
      }}
    >
      {/* navbar 는 Provider 안에 있지만 motion.div 밖에 배치 — context 사용 가능 + transform 영향 없음 */}
      {navbar}
      <motion.div animate={contentControls} initial={{ y: 0 }}>
        {children}
      </motion.div>

      {active && (
        <div className="fixed inset-0 z-[1000] pointer-events-none">
          <motion.div
            animate={overlayControls}
            initial={{ opacity: 0 }}
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.15)" }}
          />
          <motion.div
            animate={loadBgControls}
            initial={{
              scaleY: 0,
              borderRadius: "100vw 100vw 0px 0px",
              originY: 1,
            }}
            className="absolute inset-0 bg-[#fafaf8]"
          />
        </div>
      )}
    </TransitionContext.Provider>
  );
}
