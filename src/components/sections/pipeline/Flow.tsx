"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PIPELINE_STEPS } from "@/lib/constants";

const ACCENT = "#467ee9";
const EASE = [0.65, 0, 0.35, 1] as const;

function StepCol({ step, index, total }: {
  step: { label: string; sub?: string };
  index: number;
  total: number;
}) {
  const isLast = index === total - 1;
  return (
    <motion.div
      className="relative flex flex-col items-start"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.08, ease: EASE }}
    >
      {/* 번호 + 도트 + connector line */}
      <div className="w-full relative mb-5">
        <p className="font-mono text-[11px] tracking-[.2em] mb-3" style={{ color: ACCENT }}>
          {String(index + 1).padStart(2, "0")}
        </p>
        <div className="flex items-center w-full">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: ACCENT }} />
          {!isLast && (
            <div className="flex-1 h-px ml-1" style={{ backgroundColor: "rgba(0,0,0,0.08)" }} />
          )}
        </div>
      </div>
      <p className="text-[15px] font-semibold tracking-tight">{step.label}</p>
      {step.sub && (
        <p className="text-[12px] opacity-45 mt-1.5 leading-snug">{step.sub}</p>
      )}
    </motion.div>
  );
}

function StepRow({ step, index, total }: {
  step: { label: string; sub?: string };
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const isLast = index === total - 1;
  return (
    <div ref={ref} className="grid grid-cols-[40px_1fr] gap-4 items-start">
      <div className="flex flex-col items-center pt-1">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.05 + index * 0.06, ease: EASE }}
        >
          <p className="font-mono text-[10px] tracking-[.2em] mb-1.5 text-center" style={{ color: ACCENT }}>
            {String(index + 1).padStart(2, "0")}
          </p>
          <div className="w-2 h-2 rounded-full mx-auto" style={{ backgroundColor: ACCENT }} />
        </motion.div>
        {!isLast && (
          <motion.div
            className="w-px flex-1 mt-2 origin-top"
            style={{ backgroundColor: "rgba(0,0,0,0.1)", minHeight: "2rem" }}
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.15 + index * 0.06, ease: EASE }}
          />
        )}
      </div>
      <motion.div
        className={`pb-${isLast ? "0" : "5"}`}
        initial={{ opacity: 0, x: -12 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.15 + index * 0.06, ease: EASE }}
      >
        <p className="text-[15px] font-semibold tracking-tight">{step.label}</p>
        {step.sub && (
          <p className="text-[12px] opacity-45 mt-1 leading-snug">{step.sub}</p>
        )}
      </motion.div>
    </div>
  );
}

export default function Flow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  return (
    <section ref={ref} className="mt-28 md:mt-36">
      {/* Header */}
      <motion.p
        className="font-mono text-[11px] opacity-40 uppercase tracking-[.28em] mb-4"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 0.4 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
      >
        Program Flow
      </motion.p>
      <motion.h3
        className="font-display tracking-[-0.04em]"
        style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1 }}
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
      >
        전체 절차
      </motion.h3>

      {/* Desktop: 6-column horizontal flow */}
      <div className="hidden md:grid grid-cols-6 gap-6 mt-14">
        {PIPELINE_STEPS.map((step, i) => (
          <StepCol key={step.label} step={step} index={i} total={PIPELINE_STEPS.length} />
        ))}
      </div>

      {/* Mobile: vertical compact list */}
      <div className="md:hidden mt-10">
        {PIPELINE_STEPS.map((step, i) => (
          <StepRow key={step.label} step={step} index={i} total={PIPELINE_STEPS.length} />
        ))}
      </div>
    </section>
  );
}
