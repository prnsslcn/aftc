#!/usr/bin/env node
/* 로컬에서 SQL 마이그레이션을 실행. Vercel/Neon SQL Editor 의 prepared-statement 제약을 우회.
   사용법:
     node scripts/migrate.mjs db/migrations/0001_init.sql
   .env.local 에 POSTGRES_URL_NON_POOLING (또는 POSTGRES_URL) 이 있어야 함. */

import { readFileSync } from "node:fs";
import path from "node:path";
import pg from "pg";

/* .env.local 로드 */
try {
  const envPath = path.resolve(process.cwd(), ".env.local");
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)="?([^"\n]*)"?$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {
  console.warn("[WARN] .env.local 로드 실패");
}

const file = process.argv[2];
if (!file) {
  console.error("사용법: node scripts/migrate.mjs <sql-file>");
  process.exit(1);
}

const conn =
  process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
if (!conn) {
  console.error(
    "POSTGRES_URL_NON_POOLING (또는 POSTGRES_URL) 환경변수가 없습니다. `vercel env pull .env.local` 을 먼저 실행하세요."
  );
  process.exit(1);
}

const sqlText = readFileSync(file, "utf8");
console.log(`▶ Running: ${file}`);

const client = new pg.Client({ connectionString: conn });
await client.connect();
try {
  await client.query(sqlText); // multi-statement 지원
  console.log("✔ Migration successful");
} catch (e) {
  console.error("✗ Migration failed:", e.message);
  process.exit(1);
} finally {
  await client.end();
}
