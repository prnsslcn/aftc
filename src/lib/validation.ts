import { z } from "zod";
import { INQUIRY_OPTIONS } from "@/lib/constants";

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

/* 과정 문의 — 클라이언트 JSON → /api/inquiry.
   plan / schools 는 폼 선택지 외 자유 입력("기타") 허용. 서버에서 Google 전달 시 __other_option__ 으로 변환. */
const short = (label: string, max: number) =>
  z.string().trim().min(1, `${label}을(를) 입력하세요.`).max(max, `${label}이(가) 너무 깁니다.`);

export const inquirySchema = z.object({
  name: short("이름", 50),
  phone: short("연락처", 30),
  email: z.string().trim().toLowerCase().email("올바른 이메일이 아닙니다.").max(120),
  status: z.enum(INQUIRY_OPTIONS.status, { message: "현재 상태를 선택하세요." }),
  plan: short("해외 비행유학 계획", 100),
  schools: z.array(z.string().trim().min(1).max(100)).min(1, "희망 비행학교 및 과정을 하나 이상 선택하세요.").max(10),
  english: z.enum(INQUIRY_OPTIONS.english).optional().or(z.literal("")).transform((v) => v || undefined),
  experience: z.string().trim().max(2000).optional(),
  inquiry: z.string().trim().max(5000).optional(),
  /* honeypot — 봇이 채우는 숨은 필드. 값이 있으면 라우트에서 조용히 폐기 (검증 오류로 알려주지 않음) */
  website: z.string().max(500).optional(),
});
export type InquiryInput = z.infer<typeof inquirySchema>;
