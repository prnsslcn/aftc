#!/usr/bin/env node
/* 관리자 계정 seed 스크립트.
   사용법:
     node scripts/create-admin.mjs <email> <password> [name]
   예:
     node scripts/create-admin.mjs admin@abc.com mypassword123 "박노훈"
   .env.local 에 POSTGRES_URL 있어야 함 (vercel env pull 로 세팅). */

import { readFileSync } from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import { sql } from "@vercel/postgres";

/* .env.local 수동 로드 (Node 는 dotenv 없이 로드 못 함) */
try {
  const envPath = path.resolve(process.cwd(), ".env.local");
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)="?([^"\n]*)"?$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {
  console.warn("[WARN] .env.local 로드 실패 — 환경변수는 shell 에 이미 설정돼 있어야 합니다.");
}

const [, , email, password, name = "관리자"] = process.argv;
if (!email || !password) {
  console.error("사용법: node scripts/create-admin.mjs <email> <password> [name]");
  process.exit(1);
}
if (password.length < 8) {
  console.error("비밀번호는 8자 이상이어야 합니다.");
  process.exit(1);
}
if (!process.env.POSTGRES_URL) {
  console.error(
    "POSTGRES_URL 환경변수가 없습니다. `vercel env pull .env.local` 후 다시 실행하세요."
  );
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);

const result = await sql`
  INSERT INTO admins (email, password_hash, name)
  VALUES (${email.toLowerCase()}, ${hash}, ${name})
  ON CONFLICT (email) DO UPDATE
    SET password_hash = EXCLUDED.password_hash,
        name = EXCLUDED.name
  RETURNING id, email, name, created_at
`;

console.log("✔ 관리자 계정 생성/갱신:");
console.log(result.rows[0]);
