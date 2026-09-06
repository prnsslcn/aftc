import "server-only";
import { sql } from "@/lib/db/client";

/* DB 기반 로그인 rate limit. 같은 식별자(email) 또는 같은 IP 의 최근 실패 횟수로 차단. */

const WINDOW_MINUTES = 15;
const MAX_FAILS_PER_ID = 5; // 식별자당 15분 내 실패 허용치
const MAX_FAILS_PER_IP = 20; // IP당 15분 내 실패 허용치

export async function recordAttempt(args: {
  identifier: string;
  ip: string | null;
  success: boolean;
}): Promise<void> {
  await sql`
    INSERT INTO login_attempts (identifier, ip, success)
    VALUES (${args.identifier}, ${args.ip}, ${args.success})
  `;
}

export interface RateLimitResult {
  blocked: boolean;
  retryAfterMinutes: number;
}

export async function checkRateLimit(args: {
  identifier: string;
  ip: string | null;
}): Promise<RateLimitResult> {
  const since = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();

  /* 식별자/IP 실패 카운트 병렬 조회 */
  const [idRes, ipRes] = await Promise.all([
    sql<{ count: string }>`
      SELECT COUNT(*)::text AS count FROM login_attempts
      WHERE identifier = ${args.identifier}
        AND success = false
        AND attempted_at >= ${since}
    `,
    args.ip
      ? sql<{ count: string }>`
          SELECT COUNT(*)::text AS count FROM login_attempts
          WHERE ip = ${args.ip}
            AND success = false
            AND attempted_at >= ${since}
        `
      : Promise.resolve({ rows: [{ count: "0" }] }),
  ]);

  const idCount = Number(idRes.rows[0]?.count ?? 0);
  const ipCount = Number(ipRes.rows[0]?.count ?? 0);

  if (idCount >= MAX_FAILS_PER_ID) {
    return { blocked: true, retryAfterMinutes: WINDOW_MINUTES };
  }
  if (args.ip && ipCount >= MAX_FAILS_PER_IP) {
    return { blocked: true, retryAfterMinutes: WINDOW_MINUTES };
  }

  return { blocked: false, retryAfterMinutes: 0 };
}
