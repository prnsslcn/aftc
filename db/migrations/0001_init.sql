-- ABC 비행교육원 (aftc) 공지사항 게시판 초기 스키마
-- Vercel Postgres (Neon) 에서 실행: Vercel 대시보드 → Storage → 프로젝트 → Data → SQL Editor

-- uuid 생성용 확장 (Postgres 13+ 기본, Neon 은 지원)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ────────────────────────────────
-- 관리자 계정
-- ────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name          TEXT NOT NULL DEFAULT '관리자',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────
-- 공지사항
-- ────────────────────────────────
CREATE TABLE IF NOT EXISTS notices (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  body         TEXT NOT NULL,             -- Markdown 원본
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  is_pinned    BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,               -- 게시 시점 (재정렬 기준). NULL = 초안
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  author_id    UUID REFERENCES admins(id) ON DELETE SET NULL
);

-- 공개 목록 정렬용 (pinned desc, published_at desc)
CREATE INDEX IF NOT EXISTS notices_published_idx
  ON notices (is_published, is_pinned DESC, published_at DESC NULLS LAST);

-- updated_at 자동 갱신
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS notices_set_updated_at ON notices;
CREATE TRIGGER notices_set_updated_at
  BEFORE UPDATE ON notices
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ────────────────────────────────
-- 첨부파일 (Vercel Blob URL 저장)
-- ────────────────────────────────
CREATE TABLE IF NOT EXISTS attachments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notice_id    UUID NOT NULL REFERENCES notices(id) ON DELETE CASCADE,
  filename     TEXT NOT NULL,             -- 원본 파일명 (다운로드 표시)
  url          TEXT NOT NULL,             -- Vercel Blob public URL
  content_type TEXT NOT NULL,
  size         BIGINT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS attachments_notice_idx
  ON attachments (notice_id);

-- ────────────────────────────────
-- 로그인 시도 로그 (rate limit 용)
-- ────────────────────────────────
CREATE TABLE IF NOT EXISTS login_attempts (
  id           BIGSERIAL PRIMARY KEY,
  identifier   TEXT NOT NULL,             -- 이메일
  ip           TEXT,
  success      BOOLEAN NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS login_attempts_id_time_idx
  ON login_attempts (identifier, attempted_at DESC);
CREATE INDEX IF NOT EXISTS login_attempts_ip_time_idx
  ON login_attempts (ip, attempted_at DESC);

-- (선택) 오래된 시도 로그 자동 정리 — 30일 이상 삭제
-- pg_cron 이 필요하므로 여기서는 생략. 필요 시 별도 스크립트로 관리.
