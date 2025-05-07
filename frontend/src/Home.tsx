import { FAQ } from "./components/FAQ";
// import { Features } from "./components/Features";
import Hero from "./components/Hero";
import { HowItWorks } from "./components/Howitworks";

function Home() {
  return (
    <>
      <Hero/>
      <HowItWorks/>
      <FAQ/>
      {/* <Features/> */}
    </>
  );
}

export default Home;
