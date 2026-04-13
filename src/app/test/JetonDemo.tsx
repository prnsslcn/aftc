"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/* ═══════════════════════════════════════
   Lenis Smooth Scroll — 전역 인스턴스
   ═══════════════════════════════════════ */
function useLenisInstance() {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis({
      duration: 0.8,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      gestureOrientation: "vertical",
      wheelMultiplier: 1.2,
      touchMultiplier: 1,
    });

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
    };
  }, []);

  return lenis;
}

/* ═══════════════════════════════════════
   공통 컴포넌트
   ═══════════════════════════════════════ */
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const BRAND = "#f73b20";

function Reveal({
  children,
  delay = 0,
  className = "",
  y = 50,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SplitText({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: "110%", opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: delay + i * 0.02, ease: EASE }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

/* ═══════════════════════════════════════
   Navbar
   ═══════════════════════════════════════ */
function Navbar({ lenis }: { lenis: Lenis | null }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!lenis) return;
    const handler = ({ scroll }: { scroll: number }) => setScrolled(scroll > 60);
    lenis.on("scroll", handler);
    return () => lenis.off("scroll", handler);
  }, [lenis]);

  function scrollTo(target: string) {
    const el = document.querySelector(target);
    if (el) lenis?.scrollTo(el as HTMLElement);
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-12 transition-all duration-500"
      style={{
        height: 72,
        backgroundColor: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "1px solid transparent",
        color: scrolled ? "#000" : "#fff",
      }}
    >
      <span className="font-display font-bold text-2xl tracking-tight">Jeton</span>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium opacity-70">
        {["Features", "Cards", "Security", "Pricing"].map((label) => (
          <button
            key={label}
            onClick={() => scrollTo(`#${label.toLowerCase()}`)}
            className="hover:opacity-100 transition-opacity"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">
          Log in
        </button>
        <button
          className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
          style={{
            backgroundColor: scrolled ? BRAND : "rgba(255,255,255,0.15)",
            color: scrolled ? "#fff" : "#fff",
          }}
        >
          Sign up
        </button>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════
   Hero — 200vh sticky with gradient
   ═══════════════════════════════════════ */
function Hero() {
  return (
    <div style={{ height: "200vh" }}>
      <div
        className="sticky top-0 flex flex-col items-center justify-center text-center text-white overflow-hidden"
        style={{
          height: "100vh",
          background: "linear-gradient(180deg, #f96853 0%, #fa8270 50%, #fdb5a9 100%)",
        }}
      >
        <div className="max-w-4xl px-6">
          <div className="overflow-hidden mb-6">
            <SplitText
              text="One app for all your"
              className="font-display font-bold tracking-[-0.04em] justify-center"
              delay={0.3}
            />
          </div>
          <div className="overflow-hidden mb-8">
            <SplitText
              text="financial needs."
              className="font-display font-bold tracking-[-0.04em] justify-center"
              delay={0.6}
            />
          </div>
          <motion.p
            className="text-lg md:text-xl opacity-80 max-w-lg mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ duration: 1, delay: 1, ease: EASE }}
          >
            Single account for all your payments, transfers, and card management.
          </motion.p>
          <motion.div
            className="mt-10 flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3, ease: EASE }}
          >
            <button
              className="px-7 py-3 rounded-xl font-semibold text-sm transition-transform hover:scale-[1.03] active:scale-[0.98]"
              style={{ backgroundColor: "#fff", color: BRAND }}
            >
              Get Started
            </button>
            <button className="px-7 py-3 rounded-xl font-semibold text-sm border border-white/30 hover:bg-white/10 transition-colors">
              Learn More
            </button>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <motion.svg
            width="10" height="14" viewBox="0 0 10 14" fill="none"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M5 1v12M1 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
          </motion.svg>
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   Hero Introduction — Add / Send / Exchange
   Sticky scroll text + floating snippets
   ═══════════════════════════════════════ */
const TAGLINES = [
  { label: "Add", color: "#34C771", icon: "M12 4v16M4 12h16" },
  { label: "Send", color: "#477EE9", icon: "M5 12h14M13 6l6 6-6 6" },
  { label: "Exchange", color: "#FB2D54", icon: "M4 14h15M19 10H4" },
];

function HeroIntroduction() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: headerProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  });

  const titleScale = useTransform(headerProgress, [0, 1], [0.35, 1]);
  const titleOpacity = useTransform(headerProgress, [0, 0.3], [0, 1]);

  return (
    <section ref={sectionRef} className="relative bg-white">
      {/* Header — "Unify your finances" zoom text */}
      <div ref={headerRef} style={{ height: "200vh" }}>
        <div className="sticky top-0 flex items-center justify-center overflow-hidden" style={{ height: "100vh" }}>
          <motion.h2
            className="font-display text-center whitespace-pre-line"
            style={{
              fontSize: "clamp(48px, 8vw, 120px)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              scale: titleScale,
              opacity: titleOpacity,
            }}
          >
            {"Unify your\nfinances"}
          </motion.h2>
        </div>
      </div>

      {/* Taglines — Add / Send / Exchange sticky stacking */}
      <div className="relative flex flex-col items-center" style={{ marginTop: "-40vh" }}>
        {TAGLINES.map((tag, index) => (
          <div
            key={tag.label}
            className="sticky w-full"
            style={{
              top: 0,
              height: "100vh",
              paddingTop: "50vh",
              marginTop: index === 0 ? 0 : "calc(-80vh + 1.1em)",
              fontSize: "clamp(48px, 8vw, 120px)",
              fontWeight: 500,
            }}
          >
            <div
              className="flex items-center justify-center gap-5 md:gap-8"
              style={{
                transform: `translateY(calc((${index} - ${TAGLINES.length} * 0.5) * 1.1em))`,
              }}
            >
              <div
                className="flex items-center justify-center rounded-2xl md:rounded-3xl flex-shrink-0"
                style={{
                  backgroundColor: tag.color,
                  width: "clamp(48px, 6vw, 80px)",
                  height: "clamp(48px, 6vw, 80px)",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ width: "clamp(24px, 3vw, 48px)", height: "clamp(24px, 3vw, 48px)" }}
                >
                  <path d={tag.icon} />
                </svg>
              </div>
              <span style={{ color: tag.color }}>{tag.label}</span>
            </div>
          </div>
        ))}
        {/* 스페이서 — 마지막 항목이 쌓인 후 자연스럽게 넘어가기 위한 여백 */}
        <div style={{ height: "20vh" }} />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Features — Scroll Stack Cards
   ═══════════════════════════════════════ */
const FEATURES = [
  {
    title: "Instant Transfers",
    desc: "Send money anywhere in seconds. Low fees, real-time exchange rates.",
    bg: "#fff6f5",
    accent: BRAND,
  },
  {
    title: "Virtual & Physical Cards",
    desc: "Get a card that works everywhere. Manage spending with smart controls.",
    bg: "#f0f4ff",
    accent: "#3b5bdb",
  },
  {
    title: "Multi-Currency Accounts",
    desc: "Hold and convert 30+ currencies instantly. No hidden fees.",
    bg: "#f0fdf4",
    accent: "#16a34a",
  },
  {
    title: "Bank-Level Security",
    desc: "256-bit encryption, biometric auth, and real-time fraud monitoring.",
    bg: "#fef9ee",
    accent: "#ca8a04",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof FEATURES)[number];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30%" });

  return (
    <motion.div
      ref={ref}
      className="rounded-3xl p-10 md:p-14 flex flex-col justify-between min-h-[420px]"
      style={{ backgroundColor: feature.bg }}
      initial={{ opacity: 0, y: 80, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
    >
      <div>
        <span
          className="inline-block text-[10px] uppercase tracking-[.25em] font-semibold px-3 py-1 rounded-full mb-6"
          style={{ backgroundColor: `${feature.accent}15`, color: feature.accent }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3
          className="tracking-[-0.03em] mb-4"
          style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 600, lineHeight: 1.1 }}
        >
          {feature.title}
        </h3>
        <p className="opacity-55 max-w-md leading-relaxed" style={{ fontSize: "clamp(1rem, 1.3vw, 1.2rem)" }}>
          {feature.desc}
        </p>
      </div>
      <div className="mt-10 flex items-center gap-2 opacity-40 text-sm font-medium">
        <span>Learn more</span>
        <span>→</span>
      </div>
    </motion.div>
  );
}

function Features() {
  return (
    <section id="features" className="bg-white" style={{ padding: "clamp(5rem,8vw,9rem) clamp(1rem,5vw,7.75rem)" }}>
      <div className="max-w-[80rem] mx-auto">
        <Reveal>
          <p className="text-sm opacity-40 uppercase tracking-widest mb-5">Features</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            className="tracking-[-0.04em] max-w-3xl"
            style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)", fontWeight: 600, lineHeight: 1 }}
          >
            Everything you need in one place.
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Walkthrough — 수평 스크롤 스텝
   ═══════════════════════════════════════ */
const STEPS = [
  { step: "01", title: "Create Account", desc: "Sign up in under 2 minutes with just your email." },
  { step: "02", title: "Verify Identity", desc: "Quick KYC process with AI-powered document verification." },
  { step: "03", title: "Add Funds", desc: "Deposit via bank transfer, card, or crypto." },
  { step: "04", title: "Start Using", desc: "Send, spend, and manage your money globally." },
];

function Walkthrough() {
  return (
    <section className="bg-[#0a0a0a] text-white" style={{ padding: "clamp(5rem,8vw,9rem) clamp(1rem,5vw,7.75rem)" }}>
      <div className="max-w-[80rem] mx-auto">
        <Reveal>
          <p className="text-sm opacity-40 uppercase tracking-widest mb-5">How it works</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            className="tracking-[-0.04em] max-w-3xl"
            style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)", fontWeight: 600, lineHeight: 1 }}
          >
            Get started in minutes.
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          {STEPS.map((s, i) => (
            <Reveal key={s.step} delay={0.08 * i}>
              <div className="relative">
                <span className="font-mono text-6xl font-bold opacity-10 leading-none">{s.step}</span>
                <h4 className="mt-4 text-lg font-semibold tracking-tight">{s.title}</h4>
                <p className="mt-3 text-sm opacity-50 leading-relaxed">{s.desc}</p>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 -right-4 text-2xl opacity-15">→</div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Stats — 수치 강조
   ═══════════════════════════════════════ */
const STATS = [
  { value: "5M+", label: "Active Users" },
  { value: "180+", label: "Countries" },
  { value: "30+", label: "Currencies" },
  { value: "99.9%", label: "Uptime" },
];

function Stats() {
  return (
    <section className="bg-white" style={{ padding: "clamp(4rem,6vw,7rem) clamp(1rem,5vw,7.75rem)" }}>
      <div className="max-w-[80rem] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={0.06 * i}>
            <div className="text-center md:text-left">
              <p
                className="font-display tracking-[-0.04em]"
                style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)", fontWeight: 700, lineHeight: 1, color: BRAND }}
              >
                {s.value}
              </p>
              <p className="mt-2 text-sm opacity-40">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Testimonials — 리뷰
   ═══════════════════════════════════════ */
const REVIEWS = [
  { name: "Alex M.", role: "Freelancer", quote: "The best financial app I've ever used. Transfers are instant and fees are minimal." },
  { name: "Sarah K.", role: "Business Owner", quote: "Managing multi-currency accounts has never been this easy. Highly recommend." },
  { name: "David L.", role: "Digital Nomad", quote: "I use Jeton daily across 3 countries. The card works flawlessly everywhere." },
];

function Testimonials() {
  return (
    <section id="pricing" className="bg-[#fafafa]" style={{ padding: "clamp(5rem,8vw,9rem) clamp(1rem,5vw,7.75rem)" }}>
      <div className="max-w-[80rem] mx-auto">
        <Reveal>
          <p className="text-sm opacity-40 uppercase tracking-widest mb-5">Testimonials</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            className="tracking-[-0.04em] max-w-2xl mb-16"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 600, lineHeight: 1.1 }}
          >
            Trusted by millions worldwide.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={0.08 * i}>
              <div className="bg-white rounded-2xl p-8 border border-black/[.04] h-full flex flex-col">
                <p className="text-lg leading-relaxed opacity-70 flex-1">&ldquo;{r.quote}&rdquo;</p>
                <div className="mt-8 pt-6 border-t border-black/[.06]">
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-sm opacity-40">{r.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   CTA — 풀폭 배너
   ═══════════════════════════════════════ */
function CTA() {
  return (
    <section style={{ padding: "clamp(5rem,8vw,9rem) clamp(1rem,5vw,7.75rem)" }}>
      <Reveal>
        <div
          className="max-w-[80rem] mx-auto rounded-3xl text-white text-center flex flex-col items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${BRAND} 0%, #e02d15 100%)`,
            padding: "clamp(4rem,8vw,8rem) clamp(2rem,4vw,4rem)",
          }}
        >
          <h2
            className="font-display tracking-[-0.04em] mb-4"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 700, lineHeight: 1 }}
          >
            Ready to get started?
          </h2>
          <p className="text-lg opacity-80 max-w-md mb-10">
            Join 5 million+ users who trust Jeton for their financial needs.
          </p>
          <button className="px-8 py-4 bg-white rounded-xl font-semibold text-base transition-transform hover:scale-[1.03] active:scale-[0.98]" style={{ color: BRAND }}>
            Create Free Account
          </button>
        </div>
      </Reveal>
    </section>
  );
}

/* ═══════════════════════════════════════
   Footer
   ═══════════════════════════════════════ */
function Footer() {
  return (
    <footer className="border-t border-black/[.06] bg-white" style={{ padding: "clamp(3rem,5vw,5rem) clamp(1rem,5vw,7.75rem)" }}>
      <div className="max-w-[80rem] mx-auto flex flex-col md:flex-row justify-between gap-10">
        <div>
          <span className="font-display font-bold text-xl tracking-tight">Jeton</span>
          <p className="mt-3 text-sm opacity-40 max-w-[30ch]">
            One app for all your financial needs. Secure, fast, global.
          </p>
        </div>
        <div className="flex gap-16 text-sm opacity-50">
          <div className="space-y-3">
            <p className="font-semibold opacity-70">Product</p>
            {["Features", "Cards", "Security", "Pricing"].map((item) => (
              <p key={item} className="hover:opacity-100 transition-opacity cursor-pointer">{item}</p>
            ))}
          </div>
          <div className="space-y-3">
            <p className="font-semibold opacity-70">Company</p>
            {["About", "Newsroom", "Careers", "Contact"].map((item) => (
              <p key={item} className="hover:opacity-100 transition-opacity cursor-pointer">{item}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-[80rem] mx-auto mt-12 pt-6 border-t border-black/[.06] text-xs opacity-30">
        This is a Lenis scroll test page. Not affiliated with Jeton.
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════
   Main — 조합
   ═══════════════════════════════════════ */
export default function JetonDemo() {
  const lenis = useLenisInstance();

  return (
    <div className="bg-white text-black font-sans">
      <Navbar lenis={lenis} />
      <Hero />
      <HeroIntroduction />
      <Features />
      <Stats />
      <Walkthrough />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
