import ApplyHeader from "@/components/apply/ApplyHeader";
import InquiryForm from "@/components/apply/InquiryForm";
import Footer from "@/components/layout/Footer";

/* 과정 문의 — 라이트 단일 섹션. 헤더 → 한 열 폼(최대 폭 3xl, 좌측 정렬). */
export default function ApplyPage() {
  return (
    <>
      <section
        id="apply"
        data-nav-theme="light"
        className="bg-[#fafaf8] text-[#0a0a0a] px-6 md:px-10 lg:px-16 pt-28 md:pt-36 pb-24 md:pb-36"
      >
        <div className="mx-auto max-w-6xl">
          <ApplyHeader />
          <div className="mt-16 md:mt-20 max-w-3xl">
            <InquiryForm />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
