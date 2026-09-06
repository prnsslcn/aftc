import { z } from "zod";

/* 관리자 로그인 */
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("올바른 이메일이 아닙니다."),
  password: z.string().min(8, "비밀번호는 8자 이상입니다."),
});
export type LoginInput = z.infer<typeof loginSchema>;

/* 공지 생성/수정
   FormData → parse. body 는 Markdown 원본. */
export const noticeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "제목을 입력하세요.")
    .max(200, "제목은 200자 이내입니다."),
  body: z
    .string()
    .trim()
    .min(1, "본문을 입력하세요.")
    .max(50_000, "본문이 너무 깁니다 (5만자 초과)."),
  is_published: z.coerce.boolean().default(false),
  is_pinned: z.coerce.boolean().default(false),
});
export type NoticeInput = z.infer<typeof noticeSchema>;

/* 첨부 업로드 시 파일 메타 검증.
   Vercel Hobby 플랜의 serverless function body 상한이 4.5MB 이므로 4MB 로 제한.
   Pro 업그레이드 시 20MB 등으로 올릴 수 있음. */
export const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
export const MAX_FILE_SIZE_LABEL = "4MB";
export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
];

export function isAllowedFileType(t: string): boolean {
  return ALLOWED_FILE_TYPES.includes(t.toLowerCase());
}

/* 서버 액션 공용 결과 타입 */
export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string };
