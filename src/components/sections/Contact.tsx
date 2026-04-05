'use client';

import { useRef } from 'react';
import { Icon } from "@iconify/react";
import { motion, useInView } from "framer-motion";
import { CONTACT } from "@/lib/constants";

function RevealBlock({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
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

export default function Contact() {
  return (
    <section id="contact" className="py-[clamp(5rem,8vw,9rem)] px-[clamp(0.5rem,5vw,7.75rem)] bg-[#f0f2f5]">
      <div className="max-w-[80rem] mx-auto">
        <div className="max-w-3xl">
          <RevealBlock>
            <h2
              className="font-display tracking-[-0.05em]"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 0.92, fontWeight: 400 }}
            >
              Your flight career
              <br />
              starts here.
            </h2>
          </RevealBlock>

          <RevealBlock delay={0.08}>
            <p className="mt-8 opacity-40 leading-relaxed max-w-[48ch]" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.375rem)' }}>
              아세아 비행교육원에서 조종사의 꿈을 시작하세요. 과정 상담 및 지원은
              아래 연락처로 문의해주세요.
            </p>
          </RevealBlock>

          <RevealBlock delay={0.16}>
            <div className="flex flex-wrap gap-4 mt-10">
              <a
                href="#apply"
                className="inline-flex items-center gap-3 h-[42px] px-5 bg-black text-white text-sm rounded-full hover:scale-[1.03] active:scale-[0.97] transition-transform"
              >
                과정 문의 및 지원
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                  <Icon icon="solar:arrow-right-up-linear" className="text-[10px]" />
                </span>
              </a>
              <a
                href={`tel:${CONTACT.phone}`}
                className="inline-flex items-center gap-3 h-[42px] px-5 bg-[#f5f6f8] text-black text-sm rounded-full hover:scale-[1.03] active:scale-[0.97] transition-transform"
              >
                <Icon icon="solar:phone-bold" className="text-sm opacity-50" />
                전화 상담
              </a>
            </div>
          </RevealBlock>
        </div>
      </div>
    </section>
  );
}
