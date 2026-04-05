import { Icon } from "@iconify/react";
import { NAV_ITEMS, CONTACT } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-[#d9d9d9]" style={{ padding: "clamp(3rem,5vw,5rem) clamp(0.5rem,5vw,7.75rem)" }}>
      <div className="max-w-[80rem] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
        <div className="md:col-span-4">
          <p className="font-bold text-lg tracking-tight mb-3">ASEA</p>
          <p className="text-sm opacity-40 leading-relaxed max-w-[32ch]">
            Asea Flight Training Center<br />
            예비 조종사 양성부터 항공사 입사까지 이어지는 통합 조종사 교육 시스템
          </p>
          <div className="mt-4 space-y-1 text-sm opacity-30">
            <p className="flex items-center gap-2"><Icon icon="solar:buildings-linear" />{CONTACT.location}</p>
            <p className="flex items-center gap-2"><Icon icon="solar:phone-linear" />{CONTACT.phone}</p>
          </div>
        </div>

        <div className="md:col-span-3">
          <p className="text-sm font-medium mb-4">교육과정</p>
          <ul className="space-y-2 text-sm opacity-40">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}><a href={item.href} className="hover:opacity-100 transition-opacity">{item.label}</a></li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="text-sm font-medium mb-4">Company</p>
          <ul className="space-y-2 text-sm opacity-40">
            <li>FAQ</li>
            <li>개인정보처리방침</li>
            <li>이용약관</li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="text-sm font-medium mb-4">문의</p>
          <a href="#apply" className="inline-flex items-center gap-2 h-[36px] px-4 bg-[#f5f6f8] text-sm rounded-full hover:bg-[#eee] transition-colors">
            과정 문의
            <Icon icon="solar:arrow-right-up-linear" className="text-[10px] opacity-50" />
          </a>
        </div>
      </div>

      <div className="max-w-[80rem] mx-auto mt-14 pt-6 border-t border-[#d9d9d9] flex flex-col md:flex-row items-center justify-between gap-4 text-xs opacity-30">
        <p>&copy; 2025 아세아 비행교육원. All rights reserved.</p>
      </div>
    </footer>
  );
}
