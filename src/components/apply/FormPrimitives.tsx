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
      <div className="mt-6 grid gap-x-8 gap-y-8 md:grid-cols-2">{children}</div>
    </section>
  );
}

/* 선택 옵션 — nav 링크와 같은 문법의 텍스트 버튼.
   hover: 아래 밑줄(after)이 좌→우로. 선택: 위 밑줄(before)이 우→좌로 그어져 위아래 두 줄 = 선택 상태.
   (Tailwind 정적 스캔을 위해 클래스는 문자열 조립 없이 그대로 나열) */
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
    <label className="group cursor-pointer">
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.currentTarget.checked)}
        className="peer sr-only"
      />
      <span
        className="relative inline-block py-1.5 text-[15px] text-[#0a0a0a]/55 transition-colors duration-300 group-hover:text-[#0a0a0a] peer-checked:text-[#0a0a0a] peer-focus-visible:text-[#0a0a0a]
          after:absolute after:left-0 after:bottom-0 after:h-[1.5px] after:w-0 after:bg-current after:transition-[width] after:duration-500 after:ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:after:w-full peer-checked:after:w-full
          before:absolute before:right-0 before:top-0 before:h-[1.5px] before:w-0 before:bg-current before:transition-[width] before:duration-500 before:ease-[cubic-bezier(0.16,1,0.3,1)] peer-checked:before:w-full"
      >
        {label ?? value}
      </span>
    </label>
  );
}
