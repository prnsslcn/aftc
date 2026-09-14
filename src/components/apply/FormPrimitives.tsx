"use client";

import type { ChangeEvent, ReactNode } from "react";

/* 과정 문의 폼 프리미티브 — Home/pipeline 문법: mono 번호, 하단 보더 라인 인풋, 흑백 pill */

export const lineInput =
  "w-full bg-transparent border-0 border-b border-black/[.15] rounded-none px-0 py-2.5 text-[15px] md:text-base text-[#0a0a0a] placeholder:text-[#0a0a0a]/25 outline-none focus:border-[#0a0a0a] transition-colors";

export function Field({
  num,
  label,
  required,
  hint,
  error,
  children,
}: {
  num: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string | null;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[40px_1fr] md:grid-cols-[56px_1fr] gap-x-4 py-6 md:py-7 border-t border-black/[.08]">
      <span className="font-mono text-[11px] tracking-[.2em] text-[#0a0a0a]/35 tabular-nums pt-[3px]">{num}</span>
      <div>
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-sm font-medium text-[#0a0a0a]/75">
            {label}
            {required && <span className="ml-1 text-[#0a0a0a]/35">*</span>}
          </span>
          {hint && (
            <span className="font-mono text-[10px] tracking-[.14em] uppercase text-[#0a0a0a]/35">{hint}</span>
          )}
        </div>
        <div className="mt-3">{children}</div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}

export function Pill({
  type = "radio",
  name,
  value,
  label,
  onChange,
}: {
  type?: "radio" | "checkbox";
  name: string;
  value: string;
  label?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="cursor-pointer">
      <input type={type} name={name} value={value} className="peer sr-only" onChange={onChange} />
      <span className="inline-block rounded-full border border-black/[.12] px-4 py-2 text-sm text-[#0a0a0a]/60 transition-colors hover:border-black/30 peer-checked:bg-[#0a0a0a] peer-checked:border-[#0a0a0a] peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-black/20">
        {label ?? value}
      </span>
    </label>
  );
}
