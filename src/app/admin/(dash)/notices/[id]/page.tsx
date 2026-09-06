import { notFound } from "next/navigation";
import { sql } from "@/lib/db/client";
import type { NoticeRow, AttachmentRow } from "@/lib/db/types";
import { NoticeEditor } from "@/components/admin/NoticeEditor";

export default async function EditNoticePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [noticeRes, attRes] = await Promise.all([
    sql<NoticeRow>`SELECT * FROM notices WHERE id = ${id} LIMIT 1`,
    sql<AttachmentRow>`
      SELECT * FROM attachments WHERE notice_id = ${id} ORDER BY created_at ASC
    `,
  ]);

  const notice = noticeRes.rows[0];
  if (!notice) notFound();

  return (
    <NoticeEditor
      initial={{
        id: notice.id,
        title: notice.title,
        body: notice.body,
        is_published: notice.is_published,
        is_pinned: notice.is_pinned,
      }}
      attachments={attRes.rows}
    />
  );
}
