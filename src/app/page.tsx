import ScrollProgress from "@/components/layout/ScrollProgress";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import FullBleed from "@/components/sections/FullBleed";
import Programs from "@/components/sections/Programs";
import ComingSoon from "@/components/sections/ComingSoon";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <Hero />
      <About />
      <FullBleed />
      <Programs />
      <ComingSoon />
      <Contact />
      <Footer />
    </>
  );
}
