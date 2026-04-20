"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { NAV_ITEMS } from "@/lib/constants";

export default function Navbar({ scrollThreshold = 80 }: { scrollThreshold?: number }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > scrollThreshold));

  return (
    <>
      <nav
        className="fixed top-6 left-1/2 z-[210] flex items-center gap-6 px-6 py-3 rounded-full transition-all duration-500"
        style={{
          transform: "translateX(-50%)",
          backgroundColor: scrolled ? "rgba(255,255,255,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          boxShadow: scrolled ? "0 8px 40px rgba(0,0,0,0.1)" : "none",
          border: scrolled ? "1px solid rgba(0,0,0,0.08)" : "1px solid transparent",
          color: scrolled ? "#000" : "#fff",
        }}
      >
        <a href="#" className="font-display font-black tracking-tighter text-xl mr-2">
          ASEA
        </a>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium opacity-60">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hover:opacity-100 transition-opacity whitespace-nowrap"
            >
              {item.label}
            </a>
          ))}
        </div>

        <a
          href="#apply"
          className="hidden md:flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-500 whitespace-nowrap"
          style={{
            backgroundColor: scrolled ? "#000" : "rgba(255,255,255,0.15)",
            color: scrolled ? "#fff" : "inherit",
          }}
        >
          과정 문의
        </a>
        <a
          href="#trial"
          className="hidden md:flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-500 whitespace-nowrap"
          style={{
            backgroundColor: scrolled ? "#6b7280" : "rgba(255,255,255,0.15)",
            color: scrolled ? "#fff" : "inherit",
          }}
        >
          체험 문의
        </a>

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
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-black/5 flex items-center justify-center"
              aria-label="메뉴 닫기"
            >
              <Icon icon="solar:close-circle-linear" className="text-xl" />
            </button>

            {NAV_ITEMS.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                {item.label}
              </motion.a>
            ))}

            <motion.a
              href="#apply"
              onClick={() => setMobileOpen(false)}
              className="mt-4 bg-black text-white rounded-full px-8 py-4 text-lg font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              과정 문의하기
            </motion.a>
            <motion.a
              href="#trial"
              onClick={() => setMobileOpen(false)}
              className="bg-[#6b7280] text-white rounded-full px-8 py-4 text-lg font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.45 }}
            >
              체험 문의하기
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
