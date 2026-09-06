"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { Lottie, type LottieHandle } from "lottie-react";
import { NAV_ITEMS } from "@/lib/constants";
import { useNavClick } from "@/components/layout/useNavClick";

const PLANE_ICON = "/icons/motion/plane_right.json";
const PLANE_SIZE = 42;

/* Hover 시 처음부터 재생. mouseLeave 해도 중단하지 않고 남은 사이클을 마치게 둠. */
function PlaneHoverIcon() {
  const handleRef = useRef<LottieHandle>(null);
  return (
    <span
      className="inline-flex items-center justify-center"
      style={{ width: PLANE_SIZE, height: PLANE_SIZE }}
      onMouseEnter={() => {
        handleRef.current?.seek({ frame: 0 });
        handleRef.current?.play();
      }}
    >
      <Lottie
        src={PLANE_ICON}
        lottieRef={handleRef}
        autoplay={false}
        loop={false}
        style={{ width: PLANE_SIZE, height: PLANE_SIZE }}
      />
    </span>
  );
}

/* 글로벌 Navbar — 중앙 pill (플레인 아이콘 only).
   Hero 우측 셀 인라인 nav 와 완전 별개.
   홈 데스크탑 Hero 구간에서는 hidden (뷰포트 위쪽),
   HeroTransitionReveal panel 이 Hero 를 덮는 순간 ease-in-out 으로 아래로 내려옴.
   Plane hover 시 아래로 드롭다운 (droplet-style reveal). */
export default function Navbar({ scrollThreshold }: { scrollThreshold?: number }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [transitionRange, setTransitionRange] = useState(1);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const handleClick = useNavClick(() => {
    setMobileOpen(false);
    setExpanded(false);
  });

  const isHome = pathname === "/";
  const isAdmin = pathname.startsWith("/admin");

  /* 라우트 진입 시 visible 재계산:
     - /admin/* → 항상 hidden (관리자 페이지는 자체 헤더 사용)
     - 홈 외 → 항상 visible
     - 홈 데스크탑 → 현재 scrollY 기준 (Hero 구간에 있으면 hidden)
     - 홈 모바일 → 항상 visible
     page transition 의 scroll reset 이 늦게 반영되는 경우 대비해 raf + setTimeout 2회 재검사. */
  useEffect(() => {
    if (isAdmin) {
      setVisible(false);
      return;
    }
    if (!isHome) {
      setVisible(true);
      return;
    }
    if (!isDesktop) {
      setVisible(true);
      return;
    }
    const check = () => setVisible(window.scrollY >= transitionRange);
    check();
    const raf = requestAnimationFrame(check);
    const t = setTimeout(check, 500);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [isAdmin, isHome, isDesktop, transitionRange]);


  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const updateMQ = () => setIsDesktop(mq.matches);
    updateMQ();
    mq.addEventListener("change", updateMQ);
    const updateRange = () => setTransitionRange(window.innerHeight);
    updateRange();
    window.addEventListener("resize", updateRange);
    return () => {
      mq.removeEventListener("change", updateMQ);
      window.removeEventListener("resize", updateRange);
    };
  }, []);

  /* 스크롤 → visibility:
     - scrollThreshold prop (test1) 있으면 그 임계
     - 홈 데스크탑: HeroTransitionReveal panel 이 Hero 를 완전히 덮는 시점 (scrollY ≥ viewportH) 부터
     - 홈 모바일: 항상 visible */
  useMotionValueEvent(scrollY, "change", (v) => {
    if (isAdmin) return;
    if (scrollThreshold !== undefined) {
      setVisible(v > scrollThreshold);
      return;
    }
    if (!isHome) return;
    if (!isDesktop) {
      setVisible(true);
      return;
    }
    setVisible(v >= transitionRange);
  });

  return (
    <>
      {/* Fixed wrapper — 등장 애니메이션(위→아래) + hover 영역 (pill + dropdown 통합) */}
      <motion.div
        className="fixed top-6 left-1/2 z-[210]"
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
          y: visible ? 0 : -140,
        }}
        transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
        style={{
          x: "-50%",
          pointerEvents: visible ? "auto" : "none",
        }}
        onMouseEnter={() => visible && isDesktop && setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        {/* 통합 컨테이너 — pill 좌우 확장 + 세로 확장을 CSS transition 으로 오버랩.
            확장: padding 즉시 (0-750ms) / grid-rows 450ms 후 시작 (450-1200ms)
            축소: grid-rows 즉시 (0-750ms) / padding 450ms 후 시작 (450-1200ms)
            → 두 phase 가 부드럽게 오버랩. */}
        <nav
          className="flex flex-col items-stretch py-4"
          style={{
            borderRadius: 28,
            overflow: "hidden",
            paddingLeft: expanded && isDesktop ? 100 : 10,
            paddingRight: expanded && isDesktop ? 100 : 10,
            transition: `padding 750ms cubic-bezier(0.16, 1, 0.3, 1) ${
              expanded ? "0ms" : "450ms"
            }`,
            backgroundColor: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.1)",
            border: "1px solid rgba(0,0,0,0.08)",
            color: "#000",
          }}
        >
          {/* Row 1: plane (+ mobile hamburger) */}
          <div className="flex items-center justify-center gap-2">
            <Link
              href="/"
              onClick={(e) => handleClick(e, "/")}
              className="flex items-center -my-1"
              aria-label="ABC 비행교육원 홈"
            >
              <PlaneHoverIcon />
            </Link>

            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-1 ml-2"
              aria-label="메뉴 열기"
            >
              <Icon icon="solar:hamburger-menu-linear" className="text-xl" />
            </button>
          </div>

          {/* Row 2: items — grid-template-rows 0fr → 1fr 트릭 (height 측정 없이 부드러운 세로 성장).
              데스크탑 전용. 확장 시 padding 이 진행 중일 때 300ms 딜레이 후 시작 → seamless overlap.
              축소 시 즉시 collapse 시작 → padding 이 300ms 후 이어받음. */}
          <div
            className="hidden md:grid"
            style={{
              gridTemplateRows: expanded && isDesktop ? "1fr" : "0fr",
              opacity: expanded && isDesktop ? 1 : 0,
              transition: `grid-template-rows 750ms cubic-bezier(0.16, 1, 0.3, 1) ${
                expanded ? "450ms" : "0ms"
              }, opacity 750ms cubic-bezier(0.16, 1, 0.3, 1) ${
                expanded ? "450ms" : "0ms"
              }`,
            }}
          >
            <div style={{ overflow: "hidden" }}>
              <div className="mt-4 flex flex-col">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleClick(e, item.href)}
                    className="group block px-5 py-3 text-base font-bold text-[#0a0a0a] whitespace-nowrap text-center"
                  >
                    <span className="relative inline-block after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#0a0a0a] after:transition-[width] after:duration-500 after:ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:after:w-full">
                      {item.label}
                    </span>
                  </Link>
                ))}
                <Link
                  href="/apply"
                  onClick={(e) => handleClick(e, "/apply")}
                  className="mt-3 flex items-center justify-center gap-2 px-5 py-3 text-base font-bold rounded-full bg-[#0a0a0a] text-white whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5"
                >
                  과정 문의
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </motion.div>

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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
