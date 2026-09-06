import "server-only";
import bcrypt from "bcryptjs";

/* 관리자 소수 계정 + 로그인 rate limit 전제 → 낮은 비용으로 응답 속도 확보. */
const ROUNDS = 10;

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, ROUNDS);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
