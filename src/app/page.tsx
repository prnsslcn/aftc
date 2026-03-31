import ScrollProgress from "@/components/layout/ScrollProgress";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Pipeline from "@/components/sections/Pipeline";
import FullBleed from "@/components/sections/FullBleed";
import Programs from "@/components/sections/Programs";
import FlightSchool from "@/components/sections/FlightSchool";
import AirlinePrep from "@/components/sections/AirlinePrep";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <Hero />
      <About />
      <Pipeline />
      <FullBleed />
      <Programs />
      <FlightSchool />
      <AirlinePrep />
      <Contact />
      <Footer />
    </>
  );
}
