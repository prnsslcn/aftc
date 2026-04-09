"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

function RevealBlock({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AppUpp() {
  return (
    <section id="app-upp" className="bg-[#f0f2f5]" style={{ padding: "clamp(5rem,8vw,9rem) clamp(0.5rem,5vw,7.75rem)" }}>
      <div className="max-w-[80rem] mx-auto">
        <RevealBlock>
          <p className="text-sm opacity-40 uppercase tracking-widest mb-5">APP / UPP</p>
        </RevealBlock>
        <RevealBlock delay={0.08}>
          <h2
            className="tracking-[-0.05em]"
            style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", lineHeight: 1, fontWeight: 600 }}
          >
            APP / UPP
          </h2>
        </RevealBlock>

        <RevealBlock delay={0.16}>
          <div className="mt-12 rounded-2xl overflow-hidden aspect-[16/9]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/dummy.jpg"
              alt="APP / UPP"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </RevealBlock>
      </div>
    </section>
  );
}
