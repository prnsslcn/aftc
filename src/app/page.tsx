import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import WhyABC from "@/components/sections/WhyABC";
import Location from "@/components/sections/Location";

export default function Home() {
  return (
    <>
      {/* Hero sticky pin — Intro 가 위로 슬라이드 업하며 Hero 를 덮음.
          Intro 가 full cover 된 시점에 sticky 해제되고 WhyABC 로 자연 스크롤. */}
      <div className="relative">
        <div className="sticky top-0 h-[100dvh] overflow-hidden">
          <Hero />
        </div>
        <Intro />
      </div>
      {/* Dark wrapper — WhyABC 의 rounded bottom corner 컷 영역에 dark 노출 */}
      <div className="bg-[#0a0a0a]">
        <WhyABC />
      </div>
      <Location />
    </>
  );
}
