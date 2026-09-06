import { redirect } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { getSession } from "@/lib/auth/session";
import { logoutAdmin } from "./actions";

/* 관리자 대시보드 레이아웃 — 인증 가드 + 헤더.
   /admin/login 은 이 route group 밖에 있으므로 가드 적용 안 됨. */
export default async function AdminDashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0a] text-white">
      <header className="border-b border-white/[.08] bg-[#0a0a0a] sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/admin/notices"
              className="font-display font-black tracking-tighter text-lg"
            >
              ABC · Admin
            </Link>
            <nav className="flex items-center gap-4 text-sm text-white/70">
              <Link href="/admin/notices" className="hover:text-white transition-colors">
                공지사항
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-white/50 hidden sm:inline">
              {session.name}
            </span>
            <Link
              href="/"
              className="text-white/60 hover:text-white transition-colors"
              title="사이트로"
            >
              <Icon icon="solar:home-2-linear" className="text-lg" />
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}

function LogoutButton() {
  return (
    <form action={logoutAdmin}>
      <button
        type="submit"
        className="text-white/60 hover:text-white transition-colors"
        title="로그아웃"
      >
        <Icon icon="solar:logout-2-linear" className="text-lg" />
      </button>
    </form>
  );
}
