"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { Lottie, type LottieHandle } from "lottie-react";
import { NAV_ITEMS } from "@/lib/constants";
import { useNavClick } from "@/components/layout/useNavClick";

const PLANE_ICON_DARK = "/icons/motion/plane_right.json";      // 검정 plane — 라이트 배경용
const PLANE_ICON_LIGHT = "/icons/motion/plane_right_white.json"; // 흰 plane — 다크 배경용
const PLANE_SIZE = 32;

/* Plane Lottie 로고 — 마우스 hover 시 처음부터 재생, 사이클 완료까지 진행.
   theme 에 따라 다른 JSON 로드 (라이트 배경엔 검정, 다크 배경엔 흰 plane). */
function PlaneHoverIcon({ theme }: { theme: "light" | "dark" }) {
  const handleRef = useRef<LottieHandle>(null);
  const src = theme === "dark" ? PLANE_ICON_LIGHT : PLANE_ICON_DARK;
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
        key={src}
        src={src}
        lottieRef={handleRef}
        autoplay={false}
        loop={false}
        style={{ width: PLANE_SIZE, height: PLANE_SIZE }}
      />
    </span>
  );
}

type NavTheme = "light" | "dark";

/* 글로벌 상단 minimal fixed nav — Midday 스타일 참조.
   - Full-width, top-0
   - 각 섹션의 data-nav-theme 속성을 스크롤로 감지해 nav 배경/텍스트 색을 라이트↔다크로 전환
   - /admin/* 에서는 렌더 안 함
   - scrollThreshold prop 은 무시 (backwards compat 용) */
export default function Navbar(_props?: { scrollThreshold?: number }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<NavTheme>("light");
  const pathname = usePathname();
  const handleClick = useNavClick(() => setMobileOpen(false));

  useEffect(() => {
    if (typeof window === "undefined") return;

    const detect = () => {
      const zone = 40; // nav 하단 근처
      const sections = document.querySelectorAll<HTMLElement>("[data-nav-theme]");
      let current: NavTheme | null = null;
      for (const s of sections) {
        const rect = s.getBoundingClientRect();
        if (rect.top <= zone && rect.bottom >= zone) {
          const t = s.getAttribute("data-nav-theme");
          if (t === "dark" || t === "light") current = t;
        }
      }
      /* 매칭되는 섹션 없으면 라이트로 fallback (data-nav-theme 미표시 서브페이지 대응) */
      setTheme(current ?? "light");
    };

    detect();
    /* pathname 변경 시 새 섹션이 마운트되기 전 detect 이 돌아 실패할 수 있으므로,
       다음 프레임 + PageTransition 완료 이후에도 다시 검사. */
    const raf1 = requestAnimationFrame(detect);
    const t1 = setTimeout(detect, 400);
    const t2 = setTimeout(detect, 1500);

    let scrollRaf = 0;
    const onScroll = () => {
      cancelAnimationFrame(scrollRaf);
      scrollRaf = requestAnimationFrame(detect);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(scrollRaf);
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

  const isDark = theme === "dark";
  const navStyle = isDark
    ? {
        backgroundColor: "rgba(10,10,10,0.35)",
        backdropFilter: "blur(6px) saturate(140%)",
        WebkitBackdropFilter: "blur(6px) saturate(140%)",
        // borderBottom: "1px solid rgba(255,255,255,0.05)",
        color: "#ffffff",
      }
    : {
        backgroundColor: "rgba(250,250,248,0.55)",
        backdropFilter: "blur(6px) saturate(140%)",
        WebkitBackdropFilter: "blur(6px) saturate(140%)",
        // borderBottom: "1px solid rgba(0,0,0,0.06)",
        color: "#0a0a0a",
      };

  const linkClass = isDark
    ? "text-white hover:text-white"
    : "text-[#0a0a0a] hover:text-[#0a0a0a]";

  const iconBtnClass = isDark
    ? "text-white/80 hover:text-white"
    : "text-[#0a0a0a]/70 hover:text-[#0a0a0a]";

  /* 현재 경로가 해당 링크의 대상인지. 앵커 (#/#xxx) 는 별도 페이지가 아니므로 false. */
  const isActive = (href: string): boolean => {
    if (href.startsWith("#") || href.startsWith("/#")) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  /* 밑줄 span 클래스 — active 면 항상 full, 아니면 hover 시 slide */
  const underlineClass = (active: boolean) =>
    `relative inline-block py-1 after:absolute after:left-0 after:bottom-0 after:h-[1.5px] after:bg-current after:transition-[width] after:duration-500 after:ease-[cubic-bezier(0.16,1,0.3,1)] ${
      active ? "after:w-full" : "after:w-0 group-hover:after:w-full"
    }`;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100]">
        <div
          className="flex items-center py-3 md:py-4 px-4 md:px-6 lg:px-10 transition-colors duration-300"
          style={navStyle}
        >
          {/* 좌 — Plane 로고 (Home 링크) */}
          <Link
            href="/"
            onClick={(e) => handleClick(e, "/")}
            className="flex items-center flex-none -my-1"
            aria-label="ABC 비행교육원 홈"
          >
            <PlaneHoverIcon theme={theme} />
          </Link>

          {/* 우측 그룹 — nav items + 세로 border + 과정 문의 (텍스트) + mobile hamburger.
              ml-auto 로 오른쪽 정렬 (container 의 px 로 자연 gutter 유지). */}
          <div className="ml-auto flex items-center gap-5 md:gap-6">
            <div className="hidden lg:flex items-center gap-6 xl:gap-7">
              {NAV_ITEMS.filter((item) => item.href !== "/notices").map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleClick(e, item.href)}
                  className={`group text-sm font-medium ${linkClass} transition-colors whitespace-nowrap`}
                >
                  <span className={underlineClass(isActive(item.href))}>
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* border — 메인 items 와 공지사항 사이 (lg+ 에서만) */}
            <span
              aria-hidden
              className="hidden lg:block w-px h-4 bg-current opacity-20"
            />

            <Link
              href="/notices"
              onClick={(e) => handleClick(e, "/notices")}
              className={`group hidden lg:inline text-sm font-medium ${linkClass} transition-colors whitespace-nowrap`}
            >
              <span className={underlineClass(isActive("/notices"))}>
                공지사항
              </span>
            </Link>

            {/* border — 공지사항 과 과정 문의 사이 (lg+ 에서만) */}
            <span
              aria-hidden
              className="hidden lg:block w-px h-4 bg-current opacity-20"
            />

            <Link
              href="/apply"
              onClick={(e) => handleClick(e, "/apply")}
              className={`group hidden md:inline text-sm font-medium ${linkClass} transition-colors whitespace-nowrap`}
            >
              <span className={underlineClass(isActive("/apply"))}>
                과정 문의
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className={`lg:hidden p-1.5 -mr-1 transition-colors ${iconBtnClass}`}
              aria-label="메뉴 열기"
            >
              <Icon icon="solar:hamburger-menu-linear" className="text-2xl" />
            </button>
          </div>
        </div>
      </nav>

      {/* 모바일 풀스크린 메뉴 */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[220] bg-[#0a0a0a]/98 backdrop-blur-3xl flex flex-col items-center justify-center gap-7 text-white"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/[.05] flex items-center justify-center"
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
                className="mt-4 inline-block bg-white text-[#0a0a0a] rounded-full px-8 py-4 text-lg font-semibold"
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
