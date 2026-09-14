import "server-only";
import { FORM_ENTRIES, GOOGLE_FORM_ACTION, INQUIRY_OPTIONS } from "@/lib/constants";
import type { InquiryInput } from "@/lib/validation";

/* Google Form 전달.
   - 선택형 질문에 목록 밖 값을 보내면 Google 이 거절하므로, 목록 밖 값은 "기타"(__other_option__) 로 보낸다.
   - 성공 판정 (2026-09-14 실측): 검증 실패 시 HTTP 400 + 폼 페이지(data-validation-failed="true"),
     성공 시 HTTP 200 + 확인 페이지. 확인 페이지에도 FB_PUBLIC_LOAD_DATA_ 가 포함되므로 그걸로 구분하면 안 된다. */

const PLAN_SET = new Set<string>(INQUIRY_OPTIONS.plan);
const SCHOOL_SET = new Set<string>(INQUIRY_OPTIONS.school);

export function buildGoogleFormBody(input: InquiryInput): URLSearchParams {
  const body = new URLSearchParams();
  body.append(FORM_ENTRIES.name, input.name);
  body.append(FORM_ENTRIES.phone, input.phone);
  body.append(FORM_ENTRIES.email, input.email);
  body.append(FORM_ENTRIES.status, input.status);

  if (PLAN_SET.has(input.plan)) {
    body.append(FORM_ENTRIES.plan, input.plan);
  } else {
    body.append(FORM_ENTRIES.plan, "__other_option__");
    body.append(`${FORM_ENTRIES.plan}.other_option_response`, input.plan);
  }

  const otherSchools: string[] = [];
  for (const s of input.schools) {
    if (SCHOOL_SET.has(s)) body.append(FORM_ENTRIES.school, s);
    else otherSchools.push(s);
  }
  if (otherSchools.length) {
    body.append(FORM_ENTRIES.school, "__other_option__");
    body.append(`${FORM_ENTRIES.school}.other_option_response`, otherSchools.join(" / "));
  }

  if (input.english) body.append(FORM_ENTRIES.english, input.english);
  if (input.experience) body.append(FORM_ENTRIES.experience, input.experience);
  if (input.inquiry) body.append(FORM_ENTRIES.inquiry, input.inquiry);
  return body;
}

export type ForwardResult = { ok: true } | { ok: false; error: string };

export async function forwardToGoogleForm(input: InquiryInput): Promise<ForwardResult> {
  const body = buildGoogleFormBody(input);
  try {
    const res = await fetch(GOOGLE_FORM_ACTION, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
    });
    const html = await res.text();
    const validationFailed = html.includes('data-validation-failed="true"');
    if (!res.ok || validationFailed) {
      /* 어떤 질문이 거절됐는지 — Google 오류 문구(class RHiWt) 를 그대로 남긴다 */
      const reasons = [...html.matchAll(/class="RHiWt">(.*?)<\/span>/g)].map((m) => m[1]);
      return {
        ok: false,
        error: `HTTP ${res.status}${validationFailed ? " validation" : ""}${reasons.length ? ": " + reasons.join(" / ") : ""}`,
      };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "네트워크 오류" };
  }
}
