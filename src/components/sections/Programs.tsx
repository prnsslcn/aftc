'use client';

import { useRef } from 'react';
import { Icon } from "@iconify/react";
import { motion, useInView } from "framer-motion";
import {
  GROUND_SCHOOL,
  FTD_TRAINING,
  COURSE_4W,
  COURSE_8W,
} from "@/lib/constants";

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

function CourseCard({
  course,
  accent,
  delay = 0,
}: {
  course: typeof COURSE_4W | typeof COURSE_8W;
  accent: "emerald" | "blue";
  delay?: number;
}) {
  const colors = {
    emerald: "bg-emerald-500/10 text-emerald-600",
    blue: "bg-blue-500/10 text-blue-600",
  };

  return (
    <RevealBlock delay={delay}>
      <div className="rounded-[10px] bg-[#f0f2f5] overflow-hidden h-full relative">
        {"highlight" in course && course.highlight && (
          <div className={`absolute top-5 right-5 rounded-full px-3 py-1 text-[10px] font-semibold ${colors[accent]}`}>
            {course.highlight}
          </div>
        )}
        <div className="p-7 md:p-9">
          <span className={`inline-block rounded-full px-3 py-1 text-[10px] uppercase tracking-[.15em] font-semibold ${colors[accent]} mb-5`}>
            {course.badge}
          </span>
          <h3 className="text-2xl font-medium tracking-tight">{course.title}</h3>
          <p className="mt-3 opacity-40 leading-relaxed">
            {course.description}
          </p>

          <table className="info-table w-full mt-6 text-sm">
            <tbody>
              {course.rows.map((row) => (
                <tr key={row.label}>
                  <td className="opacity-40 w-24">{row.label}</td>
                  <td className={"highlight" in row && row.highlight
                    ? "text-emerald-600 font-medium"
                    : "opacity-60"
                  }>
                    {row.value}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="opacity-40">비용</td>
                <td className="opacity-80 font-semibold">
                  {course.cost}{" "}
                  <span className="opacity-40 font-normal">
                    {course.costNote}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          {"footnote" in course && course.footnote && (
            <p className="mt-4 text-xs opacity-30">{course.footnote}</p>
          )}
        </div>
      </div>
    </RevealBlock>
  );
}

export default function Programs() {
  return (
    <section id="programs" className="py-[clamp(5rem,8vw,9rem)] px-[clamp(0.5rem,5vw,7.75rem)] bg-white">
      <div className="max-w-[80rem] mx-auto">
        {/* Header */}
        <RevealBlock>
          <p className="text-sm opacity-40 uppercase tracking-widest mb-5">
            Pre-Flight Education
          </p>
        </RevealBlock>
        <RevealBlock delay={0.08}>
          <h2
            className="font-display tracking-[-0.05em]"
            style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', lineHeight: 1, fontWeight: 400 }}
          >
            비행 유학
            <br />
            사전교육.
          </h2>
        </RevealBlock>
        <RevealBlock delay={0.16}>
          <p className="mt-6 opacity-40 leading-relaxed max-w-[60ch]" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.375rem)' }}>
            해외 비행학교 진학을 준비하는 예비 조종사를 위한 유학 전문 사전교육
            프로그램입니다. 해외 비행학교 교육과정을 기반으로 한 체계적인
            사전교육을 제공하며, 이론과 실습(C172 FTD)을 결합한 교육을 통해
            준비된 상태로 비행훈련을 시작할 수 있도록 지원합니다.
          </p>
        </RevealBlock>

        {/* Curriculum */}
        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ground School */}
          <RevealBlock>
            <div className="rounded-[10px] bg-[#f0f2f5] p-7 md:p-9 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Icon icon="solar:book-2-bold" className="text-emerald-600 text-lg" />
                </div>
                <h3 className="text-xl font-medium tracking-tight">Ground School</h3>
              </div>
              <ol className="space-y-2.5 text-sm opacity-50 leading-relaxed">
                {GROUND_SCHOOL.map((subject, i) => (
                  <li key={subject} className="flex items-start gap-3">
                    <span className="opacity-40 font-mono text-xs mt-0.5 w-5 text-right flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {subject}
                  </li>
                ))}
              </ol>
            </div>
          </RevealBlock>

          {/* FTD Training */}
          <RevealBlock delay={0.08}>
            <div className="rounded-[10px] bg-[#f0f2f5] p-7 md:p-9 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Icon icon="solar:monitor-bold" className="text-blue-600 text-lg" />
                </div>
                <h3 className="text-xl font-medium tracking-tight">FTD Training</h3>
              </div>
              <ol className="space-y-2.5 text-sm opacity-50 leading-relaxed">
                {FTD_TRAINING.map((subject, i) => (
                  <li key={subject} className="flex items-start gap-3">
                    <span className="opacity-40 font-mono text-xs mt-0.5 w-5 text-right flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {subject}
                  </li>
                ))}
              </ol>
              <div className="mt-auto pt-8">
                <div className="rounded-xl overflow-hidden aspect-[16/9]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://picsum.photos/seed/c172-ftd-sim/700/400"
                    alt="C172 FTD"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
                    loading="lazy"
                  />
                </div>
                <p className="mt-3 text-xs opacity-30">
                  C172 FTD (Flight Training Device) 실습실
                </p>
              </div>
            </div>
          </RevealBlock>
        </div>

        {/* Course cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <CourseCard course={COURSE_4W} accent="emerald" />
          <CourseCard course={COURSE_8W} accent="blue" delay={0.08} />
        </div>

        {/* Apply CTA */}
        <RevealBlock className="mt-12">
          <div className="rounded-[10px] bg-[#f0f2f5] p-7 md:p-9 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-medium tracking-tight">
                과정 문의 및 지원
              </h3>
              <p className="mt-2 text-sm opacity-40">
                자세한 과정 안내와 상담을 원하시면 아래 버튼을 통해 문의해주세요.
              </p>
            </div>
            <a
              href="#apply"
              className="inline-flex items-center gap-3 h-[42px] px-5 bg-black text-white text-sm rounded-full flex-shrink-0 hover:scale-[1.03] active:scale-[0.97] transition-transform"
            >
              지원 폼 바로가기
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                <Icon icon="solar:arrow-right-up-linear" className="text-[10px]" />
              </span>
            </a>
          </div>
        </RevealBlock>
      </div>
    </section>
  );
}
