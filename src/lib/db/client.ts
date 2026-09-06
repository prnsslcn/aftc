import "server-only";
import { sql } from "@vercel/postgres";

/* Vercel Postgres (Neon) 클라이언트 — SQL template literal.
   POSTGRES_URL 환경변수 자동 사용.

   사용법:
     const { rows } = await sql`SELECT * FROM notices WHERE id = ${id}`;
     // rows: Record<string, unknown>[] — 필요한 곳에서 타입 assertion.
*/
export { sql };
