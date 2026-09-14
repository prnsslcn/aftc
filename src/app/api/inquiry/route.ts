import { NextResponse } from "next/server";
import { sql } from "@/lib/db/client";
import { inquirySchema } from "@/lib/validation";
import { clientIp } from "@/lib/auth/request";
import { forwardToGoogleForm } from "@/lib/inquiry/google-form";

/* 과정 문의 접수.
   1) 검증 → 2) DB(inquiries) 저장 → 3) Google Form 전달 → 4) 전달 결과를 DB 에 기록.
   DB 와 Google 중 하나라도 성공하면 방문자에게는 접수 완료. 둘 다 실패해야 오류.
   Google 실패는 forward_error 에 남고 서버 로그로 출력된다. */

const RATE_WINDOW_MINUTES = 10;
const RATE_MAX_PER_IP = 5;

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "잘못된 요청입니다." }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "입력값을 확인해 주세요.";
    return NextResponse.json({ ok: false, error: first }, { status: 400 });
  }
  const input = parsed.data;
  /* honeypot — 봇 응답은 성공처럼 보이게 하고 버린다 */
  if (input.website) return NextResponse.json({ ok: true });

  const ip = clientIp(req.headers);

  /* IP rate limit — DB 없이도 동작해야 하므로 실패는 무시 */
  try {
    if (ip) {
      const since = new Date(Date.now() - RATE_WINDOW_MINUTES * 60_000).toISOString();
      const { rows } = await sql`
        SELECT COUNT(*)::int AS n FROM inquiries WHERE ip = ${ip} AND created_at > ${since}
      `;
      if ((rows[0]?.n ?? 0) >= RATE_MAX_PER_IP) {
        return NextResponse.json(
          { ok: false, error: "잠시 후 다시 시도해 주세요." },
          { status: 429 },
        );
      }
    }
  } catch (e) {
    console.error("[inquiry] rate limit check failed:", e);
  }

  /* 1) DB 저장 */
  let rowId: string | null = null;
  try {
    /* schools 는 TEXT[] — 템플릿 태그가 배열을 받지 않으므로 sql.query 로 파라미터 바인딩 */
    const { rows } = await sql.query<{ id: string }>(
      `INSERT INTO inquiries (name, phone, email, status, plan, schools, english, experience, inquiry, ip)
       VALUES ($1, $2, $3, $4, $5, $6::text[], $7, $8, $9, $10)
       RETURNING id`,
      [
        input.name, input.phone, input.email, input.status, input.plan,
        input.schools, input.english ?? null, input.experience ?? null, input.inquiry ?? null, ip,
      ],
    );
    rowId = rows[0]?.id ?? null;
  } catch (e) {
    console.error("[inquiry] DB insert failed:", e);
  }

  /* 2) Google Form 전달 */
  const forward = await forwardToGoogleForm(input);
  if (!forward.ok) console.error("[inquiry] Google Form forward failed:", forward.error, { rowId });

  /* 3) 전달 결과 기록 */
  if (rowId) {
    try {
      await sql`
        UPDATE inquiries
        SET forwarded = ${forward.ok}, forward_error = ${forward.ok ? null : forward.error}
        WHERE id = ${rowId}
      `;
    } catch (e) {
      console.error("[inquiry] DB update failed:", e);
    }
  }

  if (!rowId && !forward.ok) {
    return NextResponse.json(
      { ok: false, error: "접수에 실패했습니다. 잠시 후 다시 시도하거나 전화로 문의해 주세요." },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true, forwarded: forward.ok, saved: Boolean(rowId) });
}
