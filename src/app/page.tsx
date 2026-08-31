import Hero from "@/components/sections/Hero";
import HeroTransitionReveal from "@/components/sections/HeroTransitionReveal";
import WhyABC from "@/components/sections/WhyABC";
import Location from "@/components/sections/Location";

export default function Home() {
  return (
    <>
      <HeroTransitionReveal>
        <Hero />
      </HeroTransitionReveal>
      {/* Dark wrapper — WhyABC 의 rounded bottom corner 컷 영역에 dark 노출 */}
      <div className="bg-[#0a0a0a]">
        <WhyABC />
      </div>
      <Location />
    </>
  );
}
