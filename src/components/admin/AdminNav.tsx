"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_HOME, ADMIN_SECTIONS } from "@/lib/admin-sections";

const TABS = [{ href: ADMIN_HOME, label: "대시보드" }, ...ADMIN_SECTIONS.map((s) => ({ href: s.href, label: s.label }))];

/* 관리자 헤더 탭 — 현재 경로에 흰 밑줄. 항목은 lib/admin-sections 에서 관리 */
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
