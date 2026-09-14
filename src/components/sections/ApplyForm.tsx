"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import FadeIn from "@/components/ui/FadeIn";
import { CONTACT, FORM_ENTRIES, INQUIRY_OPTIONS } from "@/lib/constants";

/* 선택지는 Google Form 과 동일 (lib/constants INQUIRY_OPTIONS). 폼 필드 name 은 FORM_ENTRIES 키를 그대로 써서
   FormData → JSON 변환 시 서버 스키마 키와 맞춘다 (실제 Google entry ID 매핑은 서버가 담당). */
const STATUS_OPTIONS = INQUIRY_OPTIONS.status;
const PLAN_OPTIONS = INQUIRY_OPTIONS.plan;
const SCHOOL_OPTIONS = INQUIRY_OPTIONS.school;
const ENGLISH_OPTIONS = INQUIRY_OPTIONS.english;

type FormState = "idle" | "submitting" | "success" | "error";

export default function ApplyForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [planOther, setPlanOther] = useState(false);
  const [schoolOther, setSchoolOther] = useState(false);
  const [schoolError, setSchoolError] = useState(false);
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    /* 체크박스 그룹은 HTML required 로 강제되지 않으므로 직접 검사 */
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
    const plan =
      planValue === "__other_option__"
        ? String(data.get(`${FORM_ENTRIES.plan}.other`) ?? "").trim()
        : planValue;

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
      setSchoolError(false);
      form.reset();
    } catch {
      setErrorMessage("네트워크 오류로 접수하지 못했습니다.");
      setState("error");
    }
  }

  return (
    <section id="apply" className="bg-[#fafaf8]" style={{ padding: "clamp(5rem,8vw,9rem) clamp(0.5rem,5vw,7.75rem)" }}>
      <div className="max-w-[80rem] mx-auto">
        <div className="max-w-2xl mx-auto">
          <FadeIn>
            <p className="text-[11px] uppercase tracking-[.2em] text-black opacity-60 font-medium mb-5">
              Apply Now
            </p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.06]">
              과정 문의 및 지원
            </h2>
          </FadeIn>
          <FadeIn delay={0.16}>
            <p className="mt-4 text-black opacity-70 leading-relaxed">
              아래 양식을 작성해주시면 상담 안내를 드리겠습니다.
            </p>
          </FadeIn>

          <AnimatePresence mode="wait">
            {state === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 rounded-[1.5rem] bg-emerald-50 p-9 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <Icon icon="solar:check-circle-bold" className="text-emerald-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">제출이 완료되었습니다</h3>
                <p className="text-sm text-black opacity-70">
                  빠른 시일 내에 안내 연락을 드리겠습니다.
                </p>
                <button
                  onClick={() => setState("idle")}
                  className="mt-6 text-sm text-black opacity-70 hover:text-black transition-colors"
                >
                  다시 작성하기
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="mt-12 space-y-6"
              >
                {/* honeypot — 봇 차단용, 사람에게는 보이지 않음 */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />

                {/* 이름 */}
                <Field label="이름" required>
                  <input
                    name={FORM_ENTRIES.name}
                    type="text"
                    required
                    placeholder="홍길동"
                    className="form-input"
                  />
                </Field>

                {/* 연락처 */}
                <Field label="연락처" required>
                  <input
                    name={FORM_ENTRIES.phone}
                    type="tel"
                    required
                    placeholder="010-0000-0000"
                    className="form-input"
                  />
                </Field>

                {/* 이메일 */}
                <Field label="이메일" required>
                  <input
                    name={FORM_ENTRIES.email}
                    type="email"
                    required
                    placeholder="example@email.com"
                    className="form-input"
                  />
                </Field>

                {/* 현재 상태 */}
                <Field label="현재 상태" required>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((opt) => (
                      <RadioPill key={opt} name={FORM_ENTRIES.status} value={opt} />
                    ))}
                  </div>
                </Field>

                {/* 해외 비행유학 계획 */}
                <Field label="해외 비행유학 계획" required>
                  <div className="flex flex-wrap gap-2">
                    {PLAN_OPTIONS.map((opt) => (
                      <RadioPill
                        key={opt}
                        name={FORM_ENTRIES.plan}
                        value={opt}
                        onChange={() => setPlanOther(false)}
                      />
                    ))}
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name={FORM_ENTRIES.plan}
                        value="__other_option__"
                        className="peer sr-only"
                        onChange={() => setPlanOther(true)}
                      />
                      <span className="inline-block rounded-full px-4 py-2 text-sm text-black/50 bg-black/[.04] peer-checked:bg-[#1a1a1a] peer-checked:text-white peer-checked:opacity-100 transition-all">
                        기타
                      </span>
                    </label>
                  </div>
                  {planOther && (
                    <input
                      name={`${FORM_ENTRIES.plan}.other`}
                      type="text"
                      placeholder="직접 입력해주세요"
                      className="form-input mt-3"
                    />
                  )}
                </Field>

                {/* 희망 비행학교 및 희망 과정 — 복수 선택 */}
                <Field label="희망 비행학교 및 희망 과정" required hint="복수 선택 가능">
                  <div className="flex flex-wrap gap-2">
                    {SCHOOL_OPTIONS.map((opt) => (
                      <RadioPill
                        key={opt}
                        type="checkbox"
                        name={FORM_ENTRIES.school}
                        value={opt}
                        onChange={() => setSchoolError(false)}
                      />
                    ))}
                    <label className="cursor-pointer">
                      <input
                        type="checkbox"
                        name={FORM_ENTRIES.school}
                        value="__other_option__"
                        className="peer sr-only"
                        onChange={(e) => {
                          setSchoolOther(e.currentTarget.checked);
                          setSchoolError(false);
                        }}
                      />
                      <span className="inline-block rounded-full px-4 py-2 text-sm text-black/50 bg-black/[.04] peer-checked:bg-[#1a1a1a] peer-checked:text-white peer-checked:opacity-100 transition-all">
                        기타
                      </span>
                    </label>
                  </div>
                  {schoolOther && (
                    <input
                      name={`${FORM_ENTRIES.school}.other`}
                      type="text"
                      placeholder="비행학교 또는 과정 이름을 입력해주세요"
                      className="form-input mt-3"
                    />
                  )}
                  {schoolError && (
                    <p className="mt-2 text-sm text-red-600">하나 이상 선택해주세요.</p>
                  )}
                </Field>

                {/* 영어 수준 */}
                <Field label="영어 수준">
                  <div className="flex flex-wrap gap-2">
                    {ENGLISH_OPTIONS.map((opt) => (
                      <RadioPill key={opt} name={FORM_ENTRIES.english} value={opt} />
                    ))}
                  </div>
                </Field>

                {/* 조종 관련 경험 */}
                <Field label="조종 관련 경험">
                  <input
                    name={FORM_ENTRIES.experience}
                    type="text"
                    placeholder="관련 경험이 있다면 입력해주세요"
                    className="form-input"
                  />
                </Field>

                {/* 문의사항 */}
                <Field label="문의사항">
                  <textarea
                    name={FORM_ENTRIES.inquiry}
                    rows={3}
                    placeholder="궁금한 점을 자유롭게 작성해주세요"
                    className="form-input resize-none"
                  />
                </Field>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={state === "submitting"}
                  className="w-full bg-black text-white rounded-full py-4 text-[15px] font-semibold hover:scale-[1.01] active:scale-[0.99] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state === "submitting" ? "제출 중..." : "문의 제출하기"}
                </button>

                {state === "error" && (
                  <p className="text-sm text-red-500 text-center">
                    {errorMessage ?? "제출 중 오류가 발생했습니다."} 계속 실패하면 {CONTACT.phone} 으로 문의해 주세요.
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-black/60 mb-2">
        {label}
        {required && <span className="text-emerald-600 ml-1">*</span>}
        {hint && <span className="ml-2 text-xs font-normal text-black/40">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function RadioPill({
  name,
  value,
  onChange,
  type = "radio",
}: {
  name: string;
  value: string;
  onChange?: () => void;
  type?: "radio" | "checkbox";
}) {
  return (
    <label className="cursor-pointer">
      <input type={type} name={name} value={value} className="peer sr-only" onChange={onChange} />
      <span className="inline-block rounded-full px-4 py-2 text-sm text-black/50 bg-black/[.04] peer-checked:bg-[#1a1a1a] peer-checked:text-white peer-checked:opacity-100 transition-all">
        {value}
      </span>
    </label>
  );
}
