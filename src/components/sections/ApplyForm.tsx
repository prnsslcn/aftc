"use client";

import { useState, useRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import FadeIn from "@/components/ui/FadeIn";
import { GOOGLE_FORM_ACTION, FORM_ENTRIES } from "@/lib/constants";

const STATUS_OPTIONS = ["고등학생", "대학생", "대학 졸업생", "직장인", "기타"];
const PLAN_OPTIONS = ["이미 결정됨", "고민중", "정보 탐색 단계"];
const SCHOOL_OPTIONS = [
  "Hillsboro Aero Academy",
  "Aeroguard Flight Training Center",
  "Phoenix East Aviation",
];
const ENGLISH_OPTIONS = ["초급", "중급", "중상급", "상급"];

type FormState = "idle" | "submitting" | "success" | "error";

export default function ApplyForm() {
  const [state, setState] = useState<FormState>("idle");
  const [planOther, setPlanOther] = useState(false);
  const [schoolOther, setSchoolOther] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");

    const form = e.currentTarget;
    const data = new FormData(form);

    // Google Forms "기타" handling
    if (planOther) {
      const otherText = data.get(`${FORM_ENTRIES.plan}.other`) || "";
      data.set(FORM_ENTRIES.plan, "__other_option__");
      data.set(`${FORM_ENTRIES.plan}.other_option_response`, otherText as string);
      data.delete(`${FORM_ENTRIES.plan}.other`);
    }
    if (schoolOther) {
      const otherText = data.get(`${FORM_ENTRIES.school}.other`) || "";
      data.set(FORM_ENTRIES.school, otherText as string);
      data.delete(`${FORM_ENTRIES.school}.other`);
    }

    try {
      await fetch(GOOGLE_FORM_ACTION, {
        method: "POST",
        body: data,
        mode: "no-cors",
      });
      setState("success");
      setPlanOther(false);
      setSchoolOther(false);
      form.reset();
    } catch {
      setState("error");
    }
  }

  return (
    <section id="apply" className="py-24 md:py-36 bg-[#0a0a0a]">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="max-w-2xl mx-auto">
          <FadeIn>
            <p className="text-[11px] uppercase tracking-[.2em] text-white/30 font-medium mb-5">
              Apply Now
            </p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight leading-[1.06]">
              과정 문의 및 지원
            </h2>
          </FadeIn>
          <FadeIn delay={0.16}>
            <p className="mt-4 text-white/40 leading-relaxed">
              아래 양식을 작성해주시면 상담 안내를 드리겠습니다.
            </p>
          </FadeIn>

          <AnimatePresence mode="wait">
            {state === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 rounded-[1.5rem] bg-emerald-500/10 ring-1 ring-emerald-500/20 p-9 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <Icon icon="solar:check-circle-bold" className="text-emerald-400 text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">제출이 완료되었습니다</h3>
                <p className="text-sm text-white/40">
                  빠른 시일 내에 안내 연락을 드리겠습니다.
                </p>
                <button
                  onClick={() => setState("idle")}
                  className="mt-6 text-sm text-white/40 hover:text-white transition-colors"
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
                      <span className="inline-block rounded-full px-4 py-2 text-sm text-white/45 bg-white/[.03] ring-1 ring-white/[.08] peer-checked:bg-white/[.1] peer-checked:text-white peer-checked:ring-white/[.2] transition-all">
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

                {/* 희망 비행학교 */}
                <Field label="희망 비행학교" required>
                  <div className="flex flex-wrap gap-2">
                    {SCHOOL_OPTIONS.map((opt) => (
                      <RadioPill
                        key={opt}
                        name={FORM_ENTRIES.school}
                        value={opt}
                        onChange={() => setSchoolOther(false)}
                      />
                    ))}
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name={FORM_ENTRIES.school}
                        value="__other__"
                        className="peer sr-only"
                        onChange={() => setSchoolOther(true)}
                      />
                      <span className="inline-block rounded-full px-4 py-2 text-sm text-white/45 bg-white/[.03] ring-1 ring-white/[.08] peer-checked:bg-white/[.1] peer-checked:text-white peer-checked:ring-white/[.2] transition-all">
                        기타
                      </span>
                    </label>
                  </div>
                  {schoolOther && (
                    <input
                      name={`${FORM_ENTRIES.school}.other`}
                      type="text"
                      placeholder="비행학교 이름을 입력해주세요"
                      className="form-input mt-3"
                    />
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
                  className="w-full bg-white text-[#0a0a0a] rounded-full py-4 text-[15px] font-semibold hover:scale-[1.01] active:scale-[0.99] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state === "submitting" ? "제출 중..." : "문의 제출하기"}
                </button>

                {state === "error" && (
                  <p className="text-sm text-red-400 text-center">
                    제출 중 오류가 발생했습니다. 다시 시도해주세요.
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
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/60 mb-2">
        {label}
        {required && <span className="text-emerald-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function RadioPill({ name, value, onChange }: { name: string; value: string; onChange?: () => void }) {
  return (
    <label className="cursor-pointer">
      <input type="radio" name={name} value={value} className="peer sr-only" onChange={onChange} />
      <span className="inline-block rounded-full px-4 py-2 text-sm text-white/45 bg-white/[.03] ring-1 ring-white/[.08] peer-checked:bg-white/[.1] peer-checked:text-white peer-checked:ring-white/[.2] transition-all">
        {value}
      </span>
    </label>
  );
}
