import { NextResponse, after } from "next/server";
import { sql } from "@/lib/db/client";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { checkRateLimit, recordAttempt } from "@/lib/auth/rate-limit";
import { clientIp } from "@/lib/auth/request";
import { loginSchema } from "@/lib/validation";
import type { AdminRow } from "@/lib/db/types";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "입력값을 확인하세요." },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;
  const ip = clientIp(req.headers);

  /* rate limit + admin 조회 병렬 */
  const [limit, adminRes] = await Promise.all([
    checkRateLimit({ identifier: email, ip }),
    sql<Pick<AdminRow, "id" | "name" | "password_hash">>`
      SELECT id, name, password_hash FROM admins WHERE email = ${email} LIMIT 1
    `,
  ]);

  if (limit.blocked) {
    return NextResponse.json(
      {
        error: `로그인 시도가 많습니다. ${limit.retryAfterMinutes}분 후 다시 시도하세요.`,
      },
      { status: 429 }
    );
  }

  const admin = adminRes.rows[0];
  const ok = admin ? await verifyPassword(password, admin.password_hash) : false;

  after(() => recordAttempt({ identifier: email, ip, success: ok }));

  if (!ok || !admin) {
    return NextResponse.json(
      { error: "이메일 또는 비밀번호가 올바르지 않습니다." },
      { status: 401 }
    );
  }

  await createSession({ sub: admin.id, role: "admin", name: admin.name });
  return NextResponse.json({ ok: true });
}
