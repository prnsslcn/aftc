"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/notices", label: "공지사항" },
  { href: "/admin/inquiries", label: "문의" },
];

/* 관리자 헤더 탭 — 현재 경로에 흰 밑줄 */
export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-5 text-sm">
      {TABS.map((t) => {
        const active = pathname === t.href || pathname.startsWith(t.href + "/");
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`relative py-1 transition-colors after:absolute after:left-0 after:bottom-0 after:h-[1.5px] after:bg-white after:transition-[width] after:duration-300 ${
              active ? "text-white after:w-full" : "text-white/60 hover:text-white after:w-0"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
