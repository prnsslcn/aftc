"use client";

import { motion } from "framer-motion";
import { blockIn } from "@/lib/motion";

const BLOCK_STYLE = { willChange: "opacity, filter, transform" } as const;

/* 과정 문의 헤더 — pipeline Header 와 같은 문법: 영문 Outfit 800 헤드라인 + 한글 서브 + 한 줄 설명.
   항상 첫 화면이므로 마운트 즉시 등장. */
export default function ApplyHeader() {
  return (
    <div>
      <motion.h1
        className="font-display tracking-[-0.045em]"
        style={{ fontSize: "clamp(2.25rem, 5.5vw, 5rem)", fontWeight: 800, lineHeight: 0.95, ...BLOCK_STYLE }}
        {...blockIn(11, "18%", 0.82, 0.08, true)}
      >
        Course Inquiry
      </motion.h1>
      <motion.p
        className="mt-4 font-medium text-[#0a0a0a]/60"
        style={{ fontSize: "clamp(1rem, 1.3vw, 1.25rem)", ...BLOCK_STYLE }}
        {...blockIn(8, "14%", 0.78, 0.28, true)}
      >
        과정 문의 및 지원
      </motion.p>
      <motion.p
        className="mt-5 text-[#0a0a0a]/55 leading-relaxed break-keep-all lg:whitespace-nowrap"
        style={{ fontSize: "clamp(0.95rem, 1.15vw, 1.125rem)", ...BLOCK_STYLE }}
        {...blockIn(8, "14%", 0.78, 0.48, true)}
      >
        관심 있는 과정과 현재 상황을 알려 주시면 담당자가 확인 후 상담 안내를 드립니다.
      </motion.p>
    </div>
  );
}
