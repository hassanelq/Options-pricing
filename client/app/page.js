import Hero from "./Components/layout/HeroSection";
import CTA from "./Components/layout/CTA";
import GradientWrapper from "./Components/ui/GradientWrapper";
import Features from "./Components/layout/Features";
import AboutMe from "./Components/layout/AboutMe";

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
