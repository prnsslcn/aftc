"use client";

import type { ReactNode } from "react";

/* 과정 문의 폼 프리미티브 — 박스형 인풋(흰 배경 + 얇은 보더 + 16px 라운드), 흑백 pill (제어 컴포넌트) */

export const boxInput =
  "w-full rounded-2xl border border-black/[.1] bg-white px-5 py-4 text-[15px] md:text-base text-[#0a0a0a] placeholder:text-[#0a0a0a]/25 outline-none transition-colors focus:border-[#0a0a0a] hover:border-black/20";

export function Field({
  label,
  required,
  hint,
  error,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string | null;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-2.5">
        <span className="text-sm font-medium text-[#0a0a0a]/80">
          {label}
          {required && <span className="ml-1 text-[#0a0a0a]/35">*</span>}
        </span>
        {hint && <span className="font-mono text-[10px] tracking-[.14em] uppercase text-[#0a0a0a]/35">{hint}</span>}
      </div>
      {children}
      {error && <p data-field-error className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

/* 섹션 구분 — mono 라벨 + 제목. 폼을 세 묶음으로 읽히게 하되 단계 전환은 없음 */
export function Section({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  return (
    <section className="pt-10 md:pt-12 first:pt-0">
      <p className="font-mono text-[11px] tracking-[.22em] uppercase text-[#0a0a0a]/40">{label}</p>
      <h3 className="mt-2 text-lg md:text-xl font-semibold tracking-[-0.02em]">{title}</h3>
      <div className="mt-6 grid gap-6 md:grid-cols-2">{children}</div>
    </section>
  );
}

export function Pill({
  type = "radio",
  name,
  value,
  label,
  checked,
  onChange,
}: {
  type?: "radio" | "checkbox";
  name: string;
  value: string;
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="cursor-pointer">
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.currentTarget.checked)}
        className="peer sr-only"
      />
      <span className="inline-block rounded-full border border-black/[.1] bg-white px-4 py-2 text-sm text-[#0a0a0a]/65 transition-colors hover:border-black/30 peer-checked:bg-[#0a0a0a] peer-checked:border-[#0a0a0a] peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-black/20">
        {label ?? value}
      </span>
    </label>
  );
}
