"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function FullBleed() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section style={{ padding: "clamp(5rem,8vw,9rem) clamp(0.5rem,5vw,7.75rem)" }} ref={ref}>
      <div className="max-w-[80rem] mx-auto">
        <motion.div
          className="rounded-2xl overflow-hidden"
          style={{ aspectRatio: "1200/750" }}
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/3.jpg" alt="비행 전경" className="w-full h-full object-cover" loading="lazy" />
        </motion.div>

        <motion.div
          className="max-w-4xl mt-[clamp(3rem,5vw,5rem)]"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <p style={{ fontSize: "clamp(1.8rem, 4vw, 4rem)", letterSpacing: "-0.05em", lineHeight: 1.1, fontWeight: 400 }}>
            해외 비행훈련은 단기간 내 높은 수준의 이해와 절차 숙지가 요구됩니다.
            사전 준비 없이 시작할 경우 학습 부담이 크게 증가할 수 있습니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
