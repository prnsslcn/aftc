"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.0,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      gestureOrientation: "vertical",
      wheelMultiplier: 1,
      touchMultiplier: 1,
    });

    lenisRef.current = instance;
    setLenis(instance);

    let rafId = 0;
    function raf(time: number) {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  // 라우트 변경 시 항상 top 으로 리셋. hash 처리는 페이지 컴포넌트(Hero 등)가 담당
  useEffect(() => {
    if (!lenisRef.current) return;
    lenisRef.current.scrollTo(0, { immediate: true });
  }, [pathname]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
