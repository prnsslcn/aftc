"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error ?? "로그인에 실패했습니다.");
          return;
        }
        router.push("/admin/notices");
        router.refresh();
      } catch {
        setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도하세요.");
      }
    });
  }

  return (
    <main className="min-h-[100dvh] bg-[#0a0a0a] text-white flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-white/45 font-mono uppercase tracking-[.22em] text-xs mb-3">
            Admin
          </p>
          <h1 className="font-display font-black text-3xl tracking-[-0.02em]">
            관리자 로그인
          </h1>
          <p className="mt-3 text-sm text-white/60">
            공지사항을 관리하려면 로그인하세요.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-mono uppercase tracking-[.2em] text-white/50 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="w-full bg-white/[.05] border border-white/[.1] rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
              placeholder="admin@abc.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-mono uppercase tracking-[.2em] text-white/50 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="current-password"
              className="w-full bg-white/[.05] border border-white/[.1] rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
              placeholder="8자 이상"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-white text-[#0a0a0a] font-bold rounded-full py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {pending ? "로그인 중…" : "로그인"}
          </button>
        </form>

        <div className="mt-6 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
          >
            <Icon icon="solar:arrow-left-linear" className="text-base" />
            홈으로
          </Link>
        </div>
      </div>
    </main>
  );
}
