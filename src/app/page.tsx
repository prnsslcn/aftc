import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Pipeline from "@/components/sections/Pipeline";
import Programs from "@/components/sections/Programs";
import FlightSchool from "@/components/sections/FlightSchool";
import AirlinePrep from "@/components/sections/AirlinePrep";
import ApplyForm from "@/components/sections/ApplyForm";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Pipeline />
      <Programs />
      <FlightSchool />
      <AirlinePrep />
      <ApplyForm />
      <Contact />
      <Footer />
    </>
  );
}
