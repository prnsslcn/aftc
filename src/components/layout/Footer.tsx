import { Icon } from "@iconify/react";
import { NAV_ITEMS, GOOGLE_FORM_URL, CONTACT } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/[.06]">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Logo + info */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                <Icon icon="solar:airplane-bold" className="text-[#0a0a0a] text-[11px]" />
              </div>
              <span className="font-bold text-[15px] tracking-tight">
                아세아 비행교육원
              </span>
            </div>
            <p className="text-white/25 text-sm leading-relaxed max-w-[38ch]">
              Asea Flight Training Center
              <br />
              예비 조종사 양성부터 항공사 입사까지 이어지는 통합 조종사 교육
              시스템
            </p>
            <div className="mt-6 space-y-2 text-sm text-white/20">
              <p className="flex items-center gap-2">
                <Icon icon="solar:buildings-linear" className="text-white/30" />
                {CONTACT.location}
              </p>
              <p className="flex items-center gap-2">
                <Icon icon="solar:phone-linear" className="text-white/30" />
                담당: {CONTACT.name} {CONTACT.phone}
              </p>
            </div>
          </div>

          {/* Nav links */}
          <div className="md:col-span-3">
            <h4 className="font-semibold text-sm mb-4 text-white/60">
              교육과정
            </h4>
            <ul className="space-y-2.5 text-sm text-white/25">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  {item.active ? (
                    <a href={item.href} className="hover:text-white/60 transition-colors">
                      {item.label}
                    </a>
                  ) : (
                    <span className="text-white/15">
                      {item.label} (준비중)
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h4 className="font-semibold text-sm mb-4 text-white/60">문의</h4>
            <p className="text-sm text-white/25 leading-relaxed mb-4">
              과정 상담 및 지원은 아래 링크를 통해 문의해주세요.
            </p>
            <a
              href={GOOGLE_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/[.06] ring-1 ring-white/[.08] rounded-full px-5 py-2.5 text-sm font-medium hover:bg-white/[.1] transition-colors"
            >
              과정 문의 및 지원
              <Icon icon="solar:arrow-right-up-linear" className="text-[10px] opacity-50" />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-white/[.06] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-white/20">
          <p>&copy; 2025 아세아 비행교육원. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="/#" className="hover:text-white/40 transition-colors">
              개인정보처리방침
            </a>
            <a href="/#" className="hover:text-white/40 transition-colors">
              이용약관
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
