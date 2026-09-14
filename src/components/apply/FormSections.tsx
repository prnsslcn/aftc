"use client";

import { INQUIRY_OPTIONS } from "@/lib/constants";
import { Field, Pill, Section, boxInput } from "./FormPrimitives";

/* 질문 9개를 세 묶음으로. 값은 InquiryForm 이 보관(제어 컴포넌트). */

export type InquiryValues = {
  name: string;
  phone: string;
  email: string;
  status: string;
  plan: string; // 선택지 또는 "__other_option__"
  planOther: string;
  schools: string[];
  schoolOtherOn: boolean;
  schoolOther: string;
  english: string;
  experience: string;
  inquiry: string;
};

export const EMPTY_VALUES: InquiryValues = {
  name: "", phone: "", email: "", status: "", plan: "", planOther: "",
  schools: [], schoolOtherOn: false, schoolOther: "", english: "", experience: "", inquiry: "",
};

export type Errors = Partial<Record<keyof InquiryValues, string>>;

type Props = {
  v: InquiryValues;
  set: <K extends keyof InquiryValues>(key: K, value: InquiryValues[K]) => void;
  errors: Errors;
};

export default function FormSections({ v, set, errors }: Props) {
  const toggleSchool = (opt: string, on: boolean) =>
    set("schools", on ? [...v.schools, opt] : v.schools.filter((s) => s !== opt));

  return (
    <>
      <Section label="01 — Contact" title="기본 정보">
        <Field label="이름" required error={errors.name}>
          <input type="text" value={v.name} onChange={(e) => set("name", e.target.value)} placeholder="홍길동" className={boxInput} autoComplete="name" />
        </Field>
        <Field label="연락처" required error={errors.phone}>
          <input type="tel" value={v.phone} onChange={(e) => set("phone", e.target.value)} placeholder="010-0000-0000" className={boxInput} autoComplete="tel" />
        </Field>
        <Field label="이메일" required error={errors.email} className="md:col-span-2">
          <input type="email" value={v.email} onChange={(e) => set("email", e.target.value)} placeholder="example@email.com" className={boxInput} autoComplete="email" />
        </Field>
      </Section>

      <Section label="02 — Situation" title="현재 상황">
        <Field label="현재 상태" required error={errors.status} className="md:col-span-2">
          <div className="flex flex-wrap gap-2">
            {INQUIRY_OPTIONS.status.map((opt) => (
              <Pill key={opt} name="status" value={opt} checked={v.status === opt} onChange={() => set("status", opt)} />
            ))}
          </div>
        </Field>
        <Field label="해외 비행유학 계획" required error={errors.plan} className="md:col-span-2">
          <div className="flex flex-wrap gap-2">
            {INQUIRY_OPTIONS.plan.map((opt) => (
              <Pill key={opt} name="plan" value={opt} checked={v.plan === opt} onChange={() => set("plan", opt)} />
            ))}
            <Pill name="plan" value="__other_option__" label="기타" checked={v.plan === "__other_option__"} onChange={() => set("plan", "__other_option__")} />
          </div>
          {v.plan === "__other_option__" && (
            <input type="text" value={v.planOther} onChange={(e) => set("planOther", e.target.value)} placeholder="직접 입력해 주세요" className={`${boxInput} mt-3`} />
          )}
        </Field>
        <Field label="희망 비행학교 및 희망 과정" required hint="복수 선택" error={errors.schools} className="md:col-span-2">
          <div className="flex flex-wrap gap-2">
            {INQUIRY_OPTIONS.school.map((opt) => (
              <Pill key={opt} type="checkbox" name="schools" value={opt} checked={v.schools.includes(opt)} onChange={(on) => toggleSchool(opt, on)} />
            ))}
            <Pill type="checkbox" name="schools" value="__other_option__" label="기타" checked={v.schoolOtherOn} onChange={(on) => set("schoolOtherOn", on)} />
          </div>
          {v.schoolOtherOn && (
            <input type="text" value={v.schoolOther} onChange={(e) => set("schoolOther", e.target.value)} placeholder="비행학교 또는 과정 이름을 입력해 주세요" className={`${boxInput} mt-3`} />
          )}
        </Field>
      </Section>

      <Section label="03 — Details" title="추가 정보">
        <Field label="영어 수준" className="md:col-span-2">
          <div className="flex flex-wrap gap-2">
            {INQUIRY_OPTIONS.english.map((opt) => (
              <Pill key={opt} name="english" value={opt} checked={v.english === opt} onChange={() => set("english", v.english === opt ? "" : opt)} />
            ))}
          </div>
        </Field>
        <Field label="조종 관련 경험" className="md:col-span-2">
          <input type="text" value={v.experience} onChange={(e) => set("experience", e.target.value)} placeholder="관련 경험이 있다면 적어 주세요" className={boxInput} />
        </Field>
        <Field label="문의사항" className="md:col-span-2">
          <textarea rows={4} value={v.inquiry} onChange={(e) => set("inquiry", e.target.value)} placeholder="궁금한 점을 자유롭게 적어 주세요" className={`${boxInput} resize-none`} />
        </Field>
      </Section>
    </>
  );
}
