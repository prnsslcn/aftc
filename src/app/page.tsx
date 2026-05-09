import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import WhyAsea from "@/components/sections/WhyAsea";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <WhyAsea />
      <Contact />
      <Footer />
    </>
  );
}
