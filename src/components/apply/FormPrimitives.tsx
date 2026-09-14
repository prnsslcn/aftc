"use client";

import { useId, type ReactNode } from "react";

/* 과정 문의 폼 프리미티브
   - FloatInput: erau-edu AuthForm 의 밑줄 + 플로팅 라벨 패턴을 흑백으로 이식.
     비어 있으면 라벨이 입력 자리에 크게, 포커스·입력 시 위로 작게. 포커스 시 밑줄이 검정으로.
   - Field: 선택형(pill) 필드용 — 라벨 위 배치
   - Section / Pill */

const floatLabel =
  "pointer-events-none absolute left-0 top-1 text-xs text-[#0a0a0a]/55 transition-all duration-300 " +
  "peer-placeholder-shown:top-[26px] peer-placeholder-shown:text-[15px] peer-placeholder-shown:md:text-base peer-placeholder-shown:text-[#0a0a0a]/35 " +
  "peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#0a0a0a]/55";

export function FloatInput({
  label,
  required,
  error,
  multiline,
  className,
  ...rest
}: {
  label: string;
  required?: boolean;
  error?: string | null;
  multiline?: boolean;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className" | "placeholder">) {
  const id = useId();
  const wrapper = `group relative border-b transition-colors duration-300 ${
    error ? "border-red-500" : "border-black/[.15] focus-within:border-[#0a0a0a]"
  }`;
  const input =
    "peer w-full bg-transparent border-0 px-0 pt-6 pb-2.5 text-[15px] md:text-base text-[#0a0a0a] outline-none rounded-none";
  return (
    <div className={className}>
      <div className={wrapper}>
        {multiline ? (
          <textarea id={id} placeholder=" " className={`${input} resize-none`} {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} />
        ) : (
          <input id={id} placeholder=" " className={input} {...(rest as React.InputHTMLAttributes<HTMLInputElement>)} />
        )}
        <label htmlFor={id} className={floatLabel}>
          {label}
          {required && <span className="ml-1 text-[#0a0a0a]/35">*</span>}
        </label>
      </div>
      {error && <p data-field-error className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

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
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-3">
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
    <section className="pt-12 md:pt-14 first:pt-0">
      <p className="font-mono text-[11px] tracking-[.22em] uppercase text-[#0a0a0a]/40">{label}</p>
      <h3 className="mt-2 text-lg md:text-xl font-semibold tracking-[-0.02em]">{title}</h3>
      <div className="mt-6 grid gap-x-8 gap-y-7 md:grid-cols-2">{children}</div>
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
      <span className="inline-block rounded-full border border-black/[.12] px-4 py-2 text-sm text-[#0a0a0a]/65 transition-colors hover:border-black/30 peer-checked:bg-[#0a0a0a] peer-checked:border-[#0a0a0a] peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-black/20">
        {label ?? value}
      </span>
    </label>
  );
}
