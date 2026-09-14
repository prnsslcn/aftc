"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db/client";
import { requireRole } from "@/lib/auth/session";
import { forwardToGoogleForm } from "@/lib/inquiry/google-form";
import type { ActionResult, InquiryInput } from "@/lib/validation";
import type { InquiryRow } from "@/lib/db/types";

async function guard(): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await requireRole("admin");
  if (!session) return { ok: false, error: "권한이 없습니다." };
  return { ok: true };
}

function revalidateAll(id?: string) {
  revalidatePath("/admin/inquiries");
  if (id) revalidatePath(`/admin/inquiries/${id}`);
}

/* Google Form 재전달 — 폼 설정을 고친 뒤 실패 건을 다시 보낼 때. 결과를 행에 기록 */
export async function resendInquiry(id: string): Promise<ActionResult<{ forwarded: boolean }>> {
  const g = await guard();
  if (!g.ok) return g;

  const { rows } = await sql<InquiryRow>`SELECT * FROM inquiries WHERE id = ${id} LIMIT 1`;
  const row = rows[0];
  if (!row) return { ok: false, error: "문의를 찾을 수 없습니다." };

  const input: InquiryInput = {
    name: row.name,
    phone: row.phone,
    email: row.email,
    status: row.status as InquiryInput["status"],
    plan: row.plan,
    schools: row.schools,
    english: (row.english ?? undefined) as InquiryInput["english"],
    experience: row.experience ?? undefined,
    inquiry: row.inquiry ?? undefined,
  };
  const result = await forwardToGoogleForm(input);
  await sql`
    UPDATE inquiries
    SET forwarded = ${result.ok}, forward_error = ${result.ok ? null : result.error}
    WHERE id = ${id}
  `;
  revalidateAll(id);
  return result.ok ? { ok: true, data: { forwarded: true } } : { ok: false, error: result.error };
}

export async function deleteInquiry(id: string): Promise<ActionResult> {
  const g = await guard();
  if (!g.ok) return g;
  await sql`DELETE FROM inquiries WHERE id = ${id}`;
  revalidateAll();
  return { ok: true };
}
