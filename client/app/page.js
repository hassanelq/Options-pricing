import Hero from "./Components/HeroSection";
import CTA from "./Components/CTA";
import GradientWrapper from "./Components/ui/GradientWrapper";
import Features from "./Components/Features";
import AboutMe from "./Components/AboutMe";

export default function Home() {
  return (
    <>
      <Hero />
      <GradientWrapper>
        <Features />
      </GradientWrapper>
      <AboutMe />
      <CTA />
    </>
  );
}
