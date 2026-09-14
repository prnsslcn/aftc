import ApplyHeader from "@/components/apply/ApplyHeader";
import ApplyAside from "@/components/apply/ApplyAside";
import InquiryForm from "@/components/apply/InquiryForm";
import Footer from "@/components/layout/Footer";

/* 과정 문의 — 라이트 단일 섹션. 헤더 → [좌 sticky 안내 | 우 폼]. 모바일은 폼 → 안내 순. */
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
          <div className="mt-16 md:mt-24 grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <div className="order-2 lg:order-1">
              <ApplyAside />
            </div>
            <div className="order-1 lg:order-2">
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
