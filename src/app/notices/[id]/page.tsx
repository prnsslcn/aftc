import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Icon } from "@iconify/react";
import { sql } from "@/lib/db/client";
import type { NoticeRow, AttachmentRow } from "@/lib/db/types";

export const revalidate = 60;

interface Params {
  params: Promise<{ id: string }>;
}

async function loadNotice(id: string) {
  const [noticeRes, attRes] = await Promise.all([
    sql<NoticeRow>`
      SELECT * FROM notices
      WHERE id = ${id} AND is_published = TRUE
      LIMIT 1
    `,
    sql<AttachmentRow>`
      SELECT * FROM attachments WHERE notice_id = ${id} ORDER BY created_at ASC
    `,
  ]);
  const notice = noticeRes.rows[0];
  if (!notice) return null;
  return { notice, attachments: attRes.rows };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const data = await loadNotice(id);
  if (!data) return { title: "공지사항" };
  return {
    title: data.notice.title,
    description: data.notice.body.slice(0, 160),
  };
}

export default async function NoticeDetailPage({ params }: Params) {
  const { id } = await params;
  const data = await loadNotice(id);
  if (!data) notFound();
  const { notice, attachments } = data;

  return (
    <main className="min-h-[100dvh] bg-[#0a0a0a] text-white px-6 md:px-10 lg:px-16 pt-32 pb-24">
      <article className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link
            href="/notices"
            className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
          >
            <Icon icon="solar:arrow-left-linear" className="text-base" />
            목록으로
          </Link>
        </div>

        <header className="mb-10 pb-8 border-b border-white/[.08]">
          {notice.is_pinned && (
            <span className="inline-block mb-4 text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 font-medium">
              Pinned
            </span>
          )}
          <h1
            className="font-display font-black tracking-[-0.025em] leading-[1.2] break-keep-all"
            style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
          >
            {notice.title}
          </h1>
          <time className="mt-4 block text-sm text-white/45 font-mono">
            {formatDate(notice.published_at ?? notice.created_at)}
          </time>
        </header>

        <div
          className="prose prose-invert max-w-none
            prose-headings:font-display prose-headings:tracking-[-0.02em]
            prose-p:leading-relaxed prose-p:break-keep-all
            prose-a:text-blue-300 hover:prose-a:text-blue-200
            prose-code:bg-white/[.06] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:bg-white/[.04] prose-pre:border prose-pre:border-white/[.08]
            prose-img:rounded-xl
            prose-hr:border-white/[.08]
            prose-blockquote:border-white/20 prose-blockquote:text-white/80"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{notice.body}</ReactMarkdown>
        </div>

        {attachments.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/[.08]">
            <p className="text-xs font-mono uppercase tracking-[.2em] text-white/50 mb-4">
              Attachments
            </p>
            <ul className="divide-y divide-white/[.06] border border-white/[.08] rounded-xl overflow-hidden">
              {attachments.map((a) => (
                <li key={a.id}>
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/[.03] transition-colors"
                  >
                    <Icon
                      icon={
                        a.content_type.startsWith("image/")
                          ? "solar:gallery-linear"
                          : "solar:file-text-linear"
                      }
                      className="text-lg text-white/60 flex-none"
                    />
                    <span className="flex-1 min-w-0 truncate text-sm">
                      {a.filename}
                    </span>
                    <span className="text-xs text-white/40 flex-none">
                      {formatBytes(a.size)}
                    </span>
                    <Icon
                      icon="solar:download-minimalistic-linear"
                      className="text-base text-white/50 flex-none"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </main>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
