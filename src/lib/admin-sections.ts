/* 관리자 섹션 정의 — 헤더 탭과 대시보드 카드가 이 목록을 공유한다.
   새 관리 기능을 추가할 때 여기에 한 줄 넣으면 탭·카드가 같이 생긴다. */
export type AdminSection = {
  key: string;
  href: string;
  label: string; // 탭·카드 제목
  eyebrow: string; // 카드 mono 라벨 (영문)
  description: string;
  icon: string; // Iconify Solar
};

/* 관리자 홈(대시보드) — /admin 자체. 탭 없이 브랜드 링크로만 진입 */
export const ADMIN_HOME = "/admin";

export const ADMIN_SECTIONS: AdminSection[] = [
  {
    key: "notices",
    href: "/admin/notices",
    label: "공지사항",
    eyebrow: "Notices",
    description: "공지 작성 · 게시 · 첨부 관리",
    icon: "solar:document-text-linear",
  },
  {
    key: "inquiries",
    href: "/admin/inquiries",
    label: "과정 문의",
    eyebrow: "Inquiries",
    description: "사이트 문의 접수 현황 · Google Form 전달 확인",
    icon: "solar:inbox-in-linear",
  },
];
