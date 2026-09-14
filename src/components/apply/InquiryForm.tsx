"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CONTACT } from "@/lib/constants";
import { BLOCK_EASE } from "@/lib/motion";
import { EMPTY_VALUES, StepBasic, StepExtra, StepSituation, type Errors, type InquiryValues } from "./StepFields";

const STEPS = [
  { key: "basic", title: "기본 정보", sub: "연락드릴 정보를 알려 주세요." },
  { key: "situation", title: "현재 상황", sub: "지금 어디쯤 계신지, 어떤 과정에 관심이 있는지." },
  { key: "extra", title: "추가 정보", sub: "선택 사항입니다. 비워 두셔도 됩니다." },
] as const;

type FormState = "idle" | "submitting" | "success" | "error";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* 스텝별 필수 검사 — 서버(Zod) 검증과 별개로 다음 단계 진입을 막는 용도 */
function validateStep(step: number, v: InquiryValues): Errors {
  const e: Errors = {};
  if (step === 0) {
    if (!v.name.trim()) e.name = "이름을 입력해 주세요.";
    if (!v.phone.trim()) e.phone = "연락처를 입력해 주세요.";
    if (!EMAIL_RE.test(v.email.trim())) e.email = "올바른 이메일을 입력해 주세요.";
  }
  if (step === 1) {
    if (!v.status) e.status = "현재 상태를 선택해 주세요.";
    if (!v.plan || (v.plan === "__other_option__" && !v.planOther.trim())) e.plan = "계획을 선택하거나 입력해 주세요.";
    const n = v.schools.length + (v.schoolOtherOn && v.schoolOther.trim() ? 1 : 0);
    if (n === 0) e.schools = "하나 이상 선택해 주세요.";
  }
  return e;
}

export default function InquiryForm() {
  const [values, setValues] = useState<InquiryValues>(EMPTY_VALUES);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const set = <K extends keyof InquiryValues>(key: K, value: InquiryValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const go = (next: number) => {
    if (next > step) {
      const e = validateStep(step, values);
      if (Object.values(e).some(Boolean)) {
        setErrors(e);
        return;
      }
    }
    setDir(next > step ? 1 : -1);
    setErrors({});
    setStep(next);
  };

  async function submit() {
    const e = validateStep(1, values);
    if (Object.values(e).some(Boolean)) {
      setErrors(e);
      setStep(1);
      return;
    }
    setState("submitting");
    setErrorMessage(null);
    const schools = [...values.schools];
    if (values.schoolOtherOn && values.schoolOther.trim()) schools.push(values.schoolOther.trim());
    const payload = {
      name: values.name,
      phone: values.phone,
      email: values.email,
      status: values.status,
      plan: values.plan === "__other_option__" ? values.planOther.trim() : values.plan,
      schools,
      english: values.english,
      experience: values.experience,
      inquiry: values.inquiry,
      website: "",
    };
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setErrorMessage(json.error ?? "접수에 실패했습니다.");
        setState("error");
        return;
      }
      setState("success");
    } catch {
      setErrorMessage("네트워크 오류로 접수하지 못했습니다.");
      setState("error");
    }
  }

  const reset = () => {
    setValues(EMPTY_VALUES);
    setStep(0);
    setErrors({});
    setState("idle");
  };

  if (state === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: BLOCK_EASE }}
        className="rounded-[24px] bg-[#0a0a0a] text-white p-8 md:p-12"
      >
        <p className="font-mono text-[11px] uppercase tracking-[.22em] text-white/40">Inquiry received</p>
        <h3 className="mt-5 font-display tracking-[-0.04em]" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, lineHeight: 1 }}>
          Received.
        </h3>
        <p className="mt-5 text-white/70 leading-relaxed break-keep-all">문의가 접수되었습니다. 빠른 시일 내에 안내 연락을 드리겠습니다.</p>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <Link href="/" className="underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors">홈으로</Link>
          <Link href="/notices" className="underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors">공지사항</Link>
          <button type="button" onClick={reset} className="text-white/50 hover:text-white transition-colors">다시 작성하기</button>
        </div>
      </motion.div>
    );
  }

  const last = step === STEPS.length - 1;
  const stepProps = { v: values, set, errors };

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (last) submit(); else go(step + 1); }}>
      {/* 스텝 헤더 — mono 진행 표시 + 얇은 프로그레스 바 */}
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="font-mono text-[11px] tracking-[.22em] text-[#0a0a0a]/40 tabular-nums">
            STEP {String(step + 1).padStart(2, "0")} <span className="text-[#0a0a0a]/20">/ {String(STEPS.length).padStart(2, "0")}</span>
          </p>
          <h3 className="mt-3 text-xl md:text-2xl font-semibold tracking-[-0.02em]">{STEPS[step].title}</h3>
          <p className="mt-1.5 text-sm text-[#0a0a0a]/55 break-keep-all">{STEPS[step].sub}</p>
        </div>
      </div>
      <div className="mt-6 h-px w-full bg-black/[.08]">
        <motion.div className="h-px bg-[#0a0a0a] origin-left" animate={{ scaleX: (step + 1) / STEPS.length }} transition={{ duration: 0.6, ease: BLOCK_EASE }} style={{ width: "100%" }} />
      </div>

      <div className="relative mt-4 overflow-hidden">
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={STEPS[step].key}
            custom={dir}
            initial={{ opacity: 0, x: dir * 32, filter: "blur(6px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: dir * -32, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: BLOCK_EASE }}
          >
            {step === 0 && <StepBasic {...stepProps} />}
            {step === 1 && <StepSituation {...stepProps} />}
            {step === 2 && <StepExtra {...stepProps} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 네비게이션 */}
      <div className="mt-2 border-t border-black/[.08] pt-8 flex items-center justify-between gap-6">
        <button
          type="button"
          onClick={() => go(step - 1)}
          disabled={step === 0 || state === "submitting"}
          className="text-sm text-[#0a0a0a]/50 hover:text-[#0a0a0a] transition-colors disabled:opacity-0 disabled:pointer-events-none"
        >
          ← 이전
        </button>
        <button
          type="submit"
          disabled={state === "submitting"}
          className="rounded-full bg-[#0a0a0a] px-8 py-3.5 text-[15px] font-semibold text-white transition-[transform,opacity] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {last ? (state === "submitting" ? "접수 중…" : "문의 보내기") : "다음 →"}
        </button>
      </div>
      {state === "error" && (
        <p className="mt-4 text-sm text-red-600 break-keep-all text-right">
          {errorMessage ?? "제출 중 오류가 발생했습니다."} 계속 실패하면 {CONTACT.phone} 으로 문의해 주세요.
        </p>
      )}
    </form>
  );
}
