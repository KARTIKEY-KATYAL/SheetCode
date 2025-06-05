import Hero from "../components/Hero";
import { HowItWorks } from "../components/Howitworks";
import { FAQ } from "../components/FAQ";
import Features from "../components/Features";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Hero/>
      <Features/>
      <HowItWorks/>
      <FAQ/>
      <Footer/>
    </>
  );
}

export default Home;
