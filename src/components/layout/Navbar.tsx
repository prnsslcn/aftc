"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { NAV_ITEMS } from "@/lib/constants";
import { useLenis } from "@/components/providers/SmoothScrollProvider";

export default function Navbar({ scrollThreshold }: { scrollThreshold?: number }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [autoThreshold, setAutoThreshold] = useState(99999);
  const threshold = scrollThreshold ?? autoThreshold;
  const { scrollY } = useScroll();
  const lenis = useLenis();
  const pathname = usePathname();

  // 홈은 스크롤 임계 통과 시 pill 채움, 그 외 페이지는 항상 채움 상태
  const isHome = pathname === "/";
  const filled = !isHome || scrolled;

  // scrollThreshold prop 미제공 시 4× viewport 로 자동 계산 (test1 패턴)
  useEffect(() => {
    if (scrollThreshold === undefined) {
      setAutoThreshold(window.innerHeight * 4);
    }
  }, [scrollThreshold]);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > threshold));

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    setMobileOpen(false);

    // nav 트리거 스크롤은 천천히 + 출발/도착 모두 부드럽게 (ease-in-out cubic)
    const opts = {
      duration: 2,
      easing: (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    };

    // 같은 페이지 anchor (#xxx)
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

    // 경로 + (선택적) anchor — 현재 페이지면 스크롤만, 아니면 Link 가 라우팅
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
    }
    // 다른 페이지면 Link 의 기본 라우팅에 위임
  }

  return (
    <>
      <nav
        className="fixed top-6 left-1/2 z-[210] flex items-center gap-6 px-6 py-3 rounded-full transition-all duration-500"
        style={{
          transform: "translateX(-50%)",
          backgroundColor: filled ? "rgba(255,255,255,0.85)" : "transparent",
          backdropFilter: filled ? "blur(20px) saturate(180%)" : "none",
          WebkitBackdropFilter: filled ? "blur(20px) saturate(180%)" : "none",
          boxShadow: filled ? "0 8px 40px rgba(0,0,0,0.1)" : "none",
          border: filled ? "1px solid rgba(0,0,0,0.08)" : "1px solid transparent",
          color: filled ? "#000" : "#fff",
        }}
      >
        <Link href="/" onClick={(e) => handleClick(e, "/")} className="font-display font-black tracking-tighter text-xl mr-2">
          ASEA
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium opacity-60">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => handleClick(e, item.href)}
              className="hover:opacity-100 transition-opacity whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          href="/apply"
          onClick={(e) => handleClick(e, "/apply")}
          className="hidden md:flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-500 whitespace-nowrap"
          style={{
            backgroundColor: filled ? "#000" : "rgba(255,255,255,0.15)",
            color: filled ? "#fff" : "inherit",
          }}
        >
          과정 문의
        </Link>
        <Link
          href="/trial"
          onClick={(e) => handleClick(e, "/trial")}
          className="hidden md:flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-500 whitespace-nowrap"
          style={{
            backgroundColor: filled ? "#6b7280" : "rgba(255,255,255,0.15)",
            color: filled ? "#fff" : "inherit",
          }}
        >
          체험 문의
        </Link>

        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-1"
          aria-label="메뉴 열기"
        >
          <Icon icon="solar:hamburger-menu-linear" className="text-xl" />
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[220] bg-white/98 backdrop-blur-3xl flex flex-col items-center justify-center gap-7 text-black"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-black/5 flex items-center justify-center"
              aria-label="메뉴 닫기"
            >
              <Icon icon="solar:close-circle-linear" className="text-xl" />
            </button>

            {NAV_ITEMS.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease: [0.65, 0, 0.35, 1] }}
              >
                <Link
                  href={item.href}
                  onClick={(e) => handleClick(e, item.href)}
                  className="text-2xl font-bold"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Link
                href="/apply"
                onClick={(e) => handleClick(e, "/apply")}
                className="mt-4 inline-block bg-black text-white rounded-full px-8 py-4 text-lg font-semibold"
              >
                과정 문의하기
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.45 }}
            >
              <Link
                href="/trial"
                onClick={(e) => handleClick(e, "/trial")}
                className="bg-[#6b7280] text-white rounded-full px-8 py-4 text-lg font-semibold"
              >
                체험 문의하기
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
