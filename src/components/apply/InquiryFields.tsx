"use client";

import { FORM_ENTRIES, INQUIRY_OPTIONS } from "@/lib/constants";
import { Field, Pill, lineInput } from "./FormPrimitives";

/* 질문 9개 — Google Form 순서 그대로. 필드 name 은 FORM_ENTRIES 키(서버 스키마 키와 동일).
   "기타" 는 __other_option__ 값 + `.other` 자유 입력으로 받고 InquiryForm 이 JSON 으로 정리한다. */
export default function InquiryFields({
  planOther,
  setPlanOther,
  schoolOther,
  setSchoolOther,
  schoolError,
  clearSchoolError,
}: {
  planOther: boolean;
  setPlanOther: (v: boolean) => void;
  schoolOther: boolean;
  setSchoolOther: (v: boolean) => void;
  schoolError: boolean;
  clearSchoolError: () => void;
}) {
  return (
    <>
      <Field num="01" label="이름" required>
        <input name={FORM_ENTRIES.name} type="text" required placeholder="홍길동" className={lineInput} />
      </Field>

      <Field num="02" label="연락처" required>
        <input name={FORM_ENTRIES.phone} type="tel" required placeholder="010-0000-0000" className={lineInput} />
      </Field>

      <Field num="03" label="이메일" required>
        <input name={FORM_ENTRIES.email} type="email" required placeholder="example@email.com" className={lineInput} />
      </Field>

      <Field num="04" label="현재 상태" required>
        <div className="flex flex-wrap gap-2">
          {INQUIRY_OPTIONS.status.map((opt) => (
            <Pill key={opt} name={FORM_ENTRIES.status} value={opt} />
          ))}
        </div>
      </Field>

      <Field num="05" label="해외 비행유학 계획" required>
        <div className="flex flex-wrap gap-2">
          {INQUIRY_OPTIONS.plan.map((opt) => (
            <Pill key={opt} name={FORM_ENTRIES.plan} value={opt} onChange={() => setPlanOther(false)} />
          ))}
          <Pill name={FORM_ENTRIES.plan} value="__other_option__" label="기타" onChange={() => setPlanOther(true)} />
        </div>
        {planOther && (
          <input name={`${FORM_ENTRIES.plan}.other`} type="text" placeholder="직접 입력해 주세요" className={`${lineInput} mt-3`} />
        )}
      </Field>

      <Field
        num="06"
        label="희망 비행학교 및 희망 과정"
        required
        hint="복수 선택"
        error={schoolError ? "하나 이상 선택해 주세요." : null}
      >
        <div className="flex flex-wrap gap-2">
          {INQUIRY_OPTIONS.school.map((opt) => (
            <Pill key={opt} type="checkbox" name={FORM_ENTRIES.school} value={opt} onChange={clearSchoolError} />
          ))}
          <Pill
            type="checkbox"
            name={FORM_ENTRIES.school}
            value="__other_option__"
            label="기타"
            onChange={(e) => {
              setSchoolOther(e.currentTarget.checked);
              clearSchoolError();
            }}
          />
        </div>
        {schoolOther && (
          <input
            name={`${FORM_ENTRIES.school}.other`}
            type="text"
            placeholder="비행학교 또는 과정 이름을 입력해 주세요"
            className={`${lineInput} mt-3`}
          />
        )}
      </Field>

      <Field num="07" label="영어 수준">
        <div className="flex flex-wrap gap-2">
          {INQUIRY_OPTIONS.english.map((opt) => (
            <Pill key={opt} name={FORM_ENTRIES.english} value={opt} />
          ))}
        </div>
      </Field>

      <Field num="08" label="조종 관련 경험">
        <input name={FORM_ENTRIES.experience} type="text" placeholder="관련 경험이 있다면 적어 주세요" className={lineInput} />
      </Field>

      <Field num="09" label="문의사항">
        <textarea
          name={FORM_ENTRIES.inquiry}
          rows={3}
          placeholder="궁금한 점을 자유롭게 적어 주세요"
          className={`${lineInput} resize-none`}
        />
      </Field>
    </>
  );
}
