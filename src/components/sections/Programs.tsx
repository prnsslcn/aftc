import { Icon } from "@iconify/react";
import FadeIn from "@/components/ui/FadeIn";
import {
  GROUND_SCHOOL,
  FTD_TRAINING,
  COURSE_4W,
  COURSE_8W,
} from "@/lib/constants";

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
    emerald: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
    blue: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
  };

  return (
    <FadeIn delay={delay}>
      <div className="rounded-[1.5rem] bg-white/[.03] ring-1 ring-white/[.06] overflow-hidden h-full relative">
        {"highlight" in course && course.highlight && (
          <div className={`absolute top-5 right-5 rounded-full px-3 py-1 text-[10px] font-semibold ${colors[accent]} ring-1`}>
            {course.highlight}
          </div>
        )}
        <div className="p-7 md:p-9">
          <span className={`inline-block rounded-full px-3 py-1 text-[10px] uppercase tracking-[.15em] font-semibold ${colors[accent]} ring-1 mb-5`}>
            {course.badge}
          </span>
          <h3 className="text-2xl font-bold tracking-tight">{course.title}</h3>
          <p className="mt-3 text-white/35 leading-relaxed">
            {course.description}
          </p>

          <table className="info-table w-full mt-6 text-sm">
            <tbody>
              {course.rows.map((row) => (
                <tr key={row.label}>
                  <td className="text-white/30 w-24">{row.label}</td>
                  <td className={"highlight" in row && row.highlight
                    ? "text-emerald-400/80 font-medium"
                    : "text-white/55"
                  }>
                    {row.value}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="text-white/30">비용</td>
                <td className="text-white/70 font-semibold">
                  {course.cost}{" "}
                  <span className="text-white/30 font-normal">
                    {course.costNote}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          {"footnote" in course && course.footnote && (
            <p className="mt-4 text-xs text-white/25">{course.footnote}</p>
          )}
        </div>
      </div>
    </FadeIn>
  );
}

export default function Programs() {
  return (
    <section id="programs" className="py-24 md:py-36 bg-[#0a0a0a]">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <FadeIn>
          <p className="text-[11px] uppercase tracking-[.2em] text-white/30 font-medium mb-5">
            Pre-Flight Education
          </p>
        </FadeIn>
        <FadeIn delay={0.08}>
          <h2 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.06]">
            비행 유학
            <br />
            사전교육.
          </h2>
        </FadeIn>
        <FadeIn delay={0.16}>
          <p className="mt-6 text-white/40 text-lg leading-relaxed max-w-[60ch]">
            해외 비행학교 진학을 준비하는 예비 조종사를 위한 유학 전문 사전교육
            프로그램입니다. 해외 비행학교 교육과정을 기반으로 한 체계적인
            사전교육을 제공하며, 이론과 실습(C172 FTD)을 결합한 교육을 통해
            준비된 상태로 비행훈련을 시작할 수 있도록 지원합니다.
          </p>
        </FadeIn>

        {/* Curriculum */}
        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ground School */}
          <FadeIn>
            <div className="rounded-[1.5rem] bg-white/[.03] ring-1 ring-white/[.06] p-7 md:p-9 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20 flex items-center justify-center">
                  <Icon icon="solar:book-2-bold" className="text-emerald-400 text-lg" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Ground School</h3>
              </div>
              <ol className="space-y-2.5 text-sm text-white/45 leading-relaxed">
                {GROUND_SCHOOL.map((subject, i) => (
                  <li key={subject} className="flex items-start gap-3">
                    <span className="text-white/20 font-mono text-xs mt-0.5 w-5 text-right flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {subject}
                  </li>
                ))}
              </ol>
            </div>
          </FadeIn>

          {/* FTD Training */}
          <FadeIn delay={0.08}>
            <div className="rounded-[1.5rem] bg-white/[.03] ring-1 ring-white/[.06] p-7 md:p-9 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20 flex items-center justify-center">
                  <Icon icon="solar:monitor-bold" className="text-blue-400 text-lg" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">FTD Training</h3>
              </div>
              <ol className="space-y-2.5 text-sm text-white/45 leading-relaxed">
                {FTD_TRAINING.map((subject, i) => (
                  <li key={subject} className="flex items-start gap-3">
                    <span className="text-white/20 font-mono text-xs mt-0.5 w-5 text-right flex-shrink-0">
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
                <p className="mt-3 text-xs text-white/20">
                  C172 FTD (Flight Training Device) 실습실
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Course cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <CourseCard course={COURSE_4W} accent="emerald" />
          <CourseCard course={COURSE_8W} accent="blue" delay={0.08} />
        </div>

        {/* Apply CTA */}
        <FadeIn className="mt-12">
          <div className="rounded-[1.5rem] bg-gradient-to-r from-white/[.04] to-white/[.02] ring-1 ring-white/[.08] p-7 md:p-9 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold tracking-tight">
                과정 문의 및 지원
              </h3>
              <p className="mt-2 text-sm text-white/35">
                자세한 과정 안내와 상담을 원하시면 아래 버튼을 통해 문의해주세요.
              </p>
            </div>
            <a
              href="#apply"
              className="inline-flex items-center gap-3 bg-white text-[#0a0a0a] rounded-full px-7 py-3.5 text-[15px] font-semibold flex-shrink-0 hover:scale-[1.03] active:scale-[0.97] transition-transform"
            >
              지원 폼 바로가기
              <span className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center">
                <Icon icon="solar:arrow-right-up-linear" className="text-[10px]" />
              </span>
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
