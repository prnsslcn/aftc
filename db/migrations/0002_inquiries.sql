-- 과정 문의 백업 테이블
-- 사이트 폼 → /api/inquiry → (1) 이 테이블에 저장 (2) Google Form 으로 전달.
-- Google 전달이 실패해도 문의는 여기에 남는다. forwarded / forward_error 로 전달 상태 추적.
-- 실행: node scripts/migrate.mjs db/migrations/0002_inquiries.sql

CREATE TABLE IF NOT EXISTS inquiries (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  phone         TEXT NOT NULL,
  email         TEXT NOT NULL,
  status        TEXT NOT NULL,             -- 현재 상태
  plan          TEXT NOT NULL,             -- 해외 비행유학 계획 (기타 자유 입력 포함)
  schools       TEXT[] NOT NULL,           -- 희망 비행학교 및 희망 과정 (복수)
  english       TEXT,                      -- 영어 수준
  experience    TEXT,                      -- 조종 관련 경험
  inquiry       TEXT,                      -- 문의사항
  forwarded     BOOLEAN NOT NULL DEFAULT FALSE,   -- Google Form 전달 성공 여부
  forward_error TEXT,                             -- 실패 시 사유
  ip            TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS inquiries_created_idx ON inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS inquiries_ip_created_idx ON inquiries (ip, created_at DESC);
