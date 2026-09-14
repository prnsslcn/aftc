"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CONTACT } from "@/lib/constants";
import { BLOCK_EASE } from "@/lib/motion";
import FormSections, { EMPTY_VALUES, type Errors, type InquiryValues } from "./FormSections";

type FormState = "idle" | "submitting" | "success" | "error";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* 클라이언트 필수 검사 — 서버(Zod) 검증과 별개로 제출 전 인라인 안내 */
function validate(v: InquiryValues): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "이름을 입력해 주세요.";
  if (!v.phone.trim()) e.phone = "연락처를 입력해 주세요.";
  if (!EMAIL_RE.test(v.email.trim())) e.email = "올바른 이메일을 입력해 주세요.";
  if (!v.status) e.status = "현재 상태를 선택해 주세요.";
  if (!v.plan || (v.plan === "__other_option__" && !v.planOther.trim())) e.plan = "계획을 선택하거나 입력해 주세요.";
  const n = v.schools.length + (v.schoolOtherOn && v.schoolOther.trim() ? 1 : 0);
  if (n === 0) e.schools = "하나 이상 선택해 주세요.";
  return e;
}

/* 단일 폼. 제출: JSON → POST /api/inquiry (서버가 DB 저장 + Google Form 전달). */
export default function InquiryForm() {
  const [values, setValues] = useState<InquiryValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const set = <K extends keyof InquiryValues>(key: K, value: InquiryValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  async function submit() {
    const e = validate(values);
    if (Object.values(e).some(Boolean)) {
      setErrors(e);
      document.querySelector<HTMLElement>("[data-field-error]")?.scrollIntoView({ behavior: "smooth", block: "center" });
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
          <button type="button" onClick={() => { setValues(EMPTY_VALUES); setErrors({}); setState("idle"); }} className="text-white/50 hover:text-white transition-colors">
            다시 작성하기
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); submit(); }}
      /* Enter 제출 방지 — 한 줄 입력란(input)에서만 막는다. textarea 줄바꿈, 버튼에 포커스 후 Enter 는 그대로 */
      onKeyDown={(e) => {
        if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") e.preventDefault();
      }}
      noValidate
    >
      <FormSections v={values} set={set} errors={errors} />

      <div className="mt-12 md:mt-14 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[10px] tracking-[.14em] uppercase text-[#0a0a0a]/35">* 표시는 필수 항목</p>
        <button
          type="submit"
          disabled={state === "submitting"}
          className="rounded-full bg-[#0a0a0a] px-9 py-4 text-[15px] font-semibold text-white transition-[transform,opacity] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state === "submitting" ? "접수 중…" : "문의 보내기 →"}
        </button>
      </div>
      {state === "error" && (
        <p className="mt-4 text-sm text-red-600 break-keep-all sm:text-right">
          {errorMessage ?? "제출 중 오류가 발생했습니다."} 계속 실패하면 {CONTACT.phone} 으로 문의해 주세요.
        </p>
      )}
    </form>
  );
}
