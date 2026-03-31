"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { NAV_ITEMS } from "@/lib/constants";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 80));

  return (
    <>
      <motion.nav
        className="fixed top-6 left-1/2 z-50 flex items-center gap-6 px-6 py-3 rounded-full border border-white/10 text-white"
        style={{
          x: "-50%",
          backgroundColor: "rgba(10,10,10,0.9)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
        }}
        animate={{
          boxShadow: scrolled
            ? "0 25px 60px rgba(0,0,0,0.5)"
            : "0 25px 50px -12px rgba(0,0,0,0.25)",
          borderColor: scrolled
            ? "rgba(255,255,255,0.15)"
            : "rgba(255,255,255,0.1)",
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <a href="#" className="font-black tracking-tighter text-xl mr-2">
          ASEA
        </a>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/70">
          {NAV_ITEMS.map((item) =>
            item.active ? (
              <a
                key={item.label}
                href={item.href}
                className="hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span
                key={item.label}
                className="opacity-35 cursor-default"
                title="준비중"
              >
                {item.label}
              </span>
            )
          )}
        </div>

        <a
          href="#apply"
          className="hidden md:flex items-center gap-2 px-4 py-1.5 text-sm font-medium bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          과정 문의
        </a>

        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-1 text-white"
          aria-label="메뉴 열기"
        >
          <Icon icon="solar:hamburger-menu-linear" className="text-xl" />
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-[#0a0a0a]/98 backdrop-blur-3xl flex flex-col items-center justify-center gap-7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center"
              aria-label="메뉴 닫기"
            >
              <Icon icon="solar:close-circle-linear" className="text-xl" />
            </button>

            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`text-2xl font-bold ${item.active ? "" : "text-white/30"}`}
              >
                {item.label}
                {!item.active && " (준비중)"}
              </a>
            ))}

            <a
              href="#apply"
              onClick={() => setMobileOpen(false)}
              className="mt-4 bg-white text-[#0a0a0a] rounded-full px-8 py-4 text-lg font-semibold"
            >
              과정 문의하기
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
