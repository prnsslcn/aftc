"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CONTACT, FORM_ENTRIES } from "@/lib/constants";
import { BLOCK_EASE } from "@/lib/motion";
import InquiryFields from "./InquiryFields";

type FormState = "idle" | "submitting" | "success" | "error";

/* 제출: FormData → JSON → POST /api/inquiry (서버가 DB 저장 + Google Form 전달). */
export default function InquiryForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [planOther, setPlanOther] = useState(false);
  const [schoolOther, setSchoolOther] = useState(false);
  const [schoolError, setSchoolError] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const schools = data.getAll(FORM_ENTRIES.school).map(String).filter((v) => v !== "__other_option__");
    const schoolOtherText = String(data.get(`${FORM_ENTRIES.school}.other`) ?? "").trim();
    if (schoolOther && schoolOtherText) schools.push(schoolOtherText);
    if (schools.length === 0) {
      setSchoolError(true);
      return;
    }
    setSchoolError(false);
    setState("submitting");
    setErrorMessage(null);

    const planValue = String(data.get(FORM_ENTRIES.plan) ?? "");
    const plan = planValue === "__other_option__" ? String(data.get(`${FORM_ENTRIES.plan}.other`) ?? "").trim() : planValue;

    const payload = {
      name: data.get(FORM_ENTRIES.name),
      phone: data.get(FORM_ENTRIES.phone),
      email: data.get(FORM_ENTRIES.email),
      status: data.get(FORM_ENTRIES.status),
      plan,
      schools,
      english: data.get(FORM_ENTRIES.english) ?? "",
      experience: data.get(FORM_ENTRIES.experience) ?? "",
      inquiry: data.get(FORM_ENTRIES.inquiry) ?? "",
      website: data.get("website") ?? "",
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
      setPlanOther(false);
      setSchoolOther(false);
      form.reset();
    } catch {
      setErrorMessage("네트워크 오류로 접수하지 못했습니다.");
      setState("error");
    }
  }

  return (
    <AnimatePresence mode="wait">
      {state === "success" ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: BLOCK_EASE }}
          className="rounded-[24px] bg-[#0a0a0a] text-white p-8 md:p-12"
        >
          <p className="font-mono text-[11px] uppercase tracking-[.22em] text-white/40">Inquiry received</p>
          <h3 className="mt-5 font-display tracking-[-0.04em]" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, lineHeight: 1 }}>
            Received.
          </h3>
          <p className="mt-5 text-white/70 leading-relaxed break-keep-all">
            문의가 접수되었습니다. 빠른 시일 내에 안내 연락을 드리겠습니다.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <Link href="/" className="underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors">
              홈으로
            </Link>
            <Link href="/notices" className="underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors">
              공지사항
            </Link>
            <button type="button" onClick={() => setState("idle")} className="text-white/50 hover:text-white transition-colors">
              다시 작성하기
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="border-b border-black/[.08]"
        >
          {/* honeypot — 봇 차단용, 사람에게는 보이지 않음 */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

          <InquiryFields
            planOther={planOther}
            setPlanOther={setPlanOther}
            schoolOther={schoolOther}
            setSchoolOther={setSchoolOther}
            schoolError={schoolError}
            clearSchoolError={() => setSchoolError(false)}
          />

          <div className="py-8 md:py-10 md:pl-[72px]">
            <button
              type="submit"
              disabled={state === "submitting"}
              className="w-full rounded-full bg-[#0a0a0a] py-4 text-[15px] font-semibold text-white transition-[transform,opacity] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state === "submitting" ? "접수 중…" : "문의 보내기"}
            </button>
            {state === "error" && (
              <p className="mt-4 text-sm text-red-600 break-keep-all">
                {errorMessage ?? "제출 중 오류가 발생했습니다."} 계속 실패하면 {CONTACT.phone} 으로 문의해 주세요.
              </p>
            )}
            <p className="mt-4 font-mono text-[10px] tracking-[.14em] uppercase text-[#0a0a0a]/35">
              * 표시는 필수 항목
            </p>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
