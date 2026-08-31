"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLenis } from "@/components/providers/SmoothScrollProvider";
import { usePageTransition } from "@/components/layout/PageTransition";

/* 여러 nav (글로벌 Navbar / Hero 인라인 nav 등) 가 공유하는 클릭 핸들러.
   같은 페이지 앵커 → Lenis 스크롤 / 다른 페이지 → PageTransition (Barba 패턴). */
export function useNavClick(onBeforeNavigate?: () => void) {
  const lenis = useLenis();
  const pathname = usePathname();
  const router = useRouter();
  const { runLeave, runEnter, inTransition, awaitNextChildrenChange } =
    usePageTransition();

  return function handleClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    onBeforeNavigate?.();

    const opts = {
      duration: 2,
      easing: (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    };

    if (href.startsWith("#")) {
      e.preventDefault();
      if (href === "#") {
        lenis?.scrollTo(0, opts);
        return;
      }
      const target = document.querySelector(href);
      if (target) lenis?.scrollTo(target as HTMLElement, opts);
      return;
    }

    const hashIndex = href.indexOf("#");
    const path = hashIndex >= 0 ? href.slice(0, hashIndex) || "/" : href;
    const anchor = hashIndex >= 0 ? href.slice(hashIndex) : "";

    if (pathname === path) {
      e.preventDefault();
      if (!anchor || anchor === "#") {
        lenis?.scrollTo(0, opts);
        return;
      }
      const target = document.querySelector(anchor);
      if (target) lenis?.scrollTo(target as HTMLElement, opts);
      return;
    }

    e.preventDefault();
    if (inTransition()) return;

    (async () => {
      await runLeave();
      const childrenChanged = awaitNextChildrenChange();
      router.push(href);
      await Promise.race([
        childrenChanged,
        new Promise<void>((r) => setTimeout(() => r(), 500)),
      ]);
      await new Promise<void>((r) => requestAnimationFrame(() => r()));
      // 앵커 없이 다른 페이지로 이동 시 스크롤을 top 으로 리셋 (SPA 기본 UX)
      if (!anchor) {
        lenis?.scrollTo(0, { immediate: true });
        window.scrollTo(0, 0);
      }
      await runEnter(path === "/");
    })();
  };
}
