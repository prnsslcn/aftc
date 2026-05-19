"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Icon } from "@iconify/react";

function RevealBlock({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.65, 0, 0.35, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function TrialInquiry() {
  return (
    <section id="trial" className="bg-[#fafaf8]" style={{ padding: "clamp(5rem,8vw,9rem) clamp(0.5rem,5vw,7.75rem)" }}>
      <div className="max-w-[80rem] mx-auto">
        <RevealBlock>
          <p className="text-sm opacity-40 uppercase tracking-widest mb-5">Trial Inquiry</p>
        </RevealBlock>
        <RevealBlock delay={0.08}>
          <h2
            className="tracking-[-0.05em]"
            style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", lineHeight: 1, fontWeight: 600 }}
          >
            체험 문의
          </h2>
        </RevealBlock>

        <RevealBlock delay={0.16}>
          <div className="mt-12 rounded-2xl bg-[#fafaf8] aspect-[16/9] flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-black/[.04] flex items-center justify-center">
              <Icon icon="solar:hourglass-line-linear" className="text-2xl text-black/40" />
            </div>
            <p className="mt-5 text-black/70 font-medium" style={{ fontSize: "clamp(1.125rem, 1.6vw, 1.375rem)", letterSpacing: "-0.02em" }}>
              준비 중입니다
            </p>
            <p className="mt-2 text-sm text-black/40">
              곧 안내드릴 예정입니다.
            </p>
          </div>
        </RevealBlock>
      </div>
    </section>
  );
}
