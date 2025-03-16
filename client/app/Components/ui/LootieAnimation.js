// components/ui/LootieAnimation.js
"use client";

import { useRef } from "react";
import Lottie from "lottie-react";
import animationData from "/public/Animations/Animation3.json";

const LottieAnimation = () => {
  const lottieRef = useRef();

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animationData}
      loop={true}
      autoplay={true}
      style={{ height: 300 }}
    />
  );
};

export default LottieAnimation;
