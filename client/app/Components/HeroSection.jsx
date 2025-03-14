"use client";
import NavLink from "./ui/NavLink";
import dynamic from "next/dynamic";

const LottieAnimation = dynamic(() => import("./ui/LootieAnimation"), {
  ssr: false,
});

export default function Hero() {
  return (
    <section>
      <div className="custom-screen text-gray-600 text-center flex flex-col gap-14 pt-14">
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="flex justify-center">
            <LottieAnimation />
          </div>

          <div className="space-y-5">
            <h1 className="text-4xl text-gray-800 font-extrabold mx-auto sm:text-6xl">
              Welcome to Option Pricer
            </h1>
            <p className="max-w-xl mx-auto">
              Fetch options from the market and compute theoretical pricing
              using mathematical models.
            </p>
            <div className="flex items-center justify-center gap-x-3 font-medium text-sm">
              <NavLink
                href="/Options-pricing"
                className="text-white bg-gray-800 hover:bg-gray-600 active:bg-gray-900"
              >
                Start Pricing an Option
              </NavLink>
              <NavLink
                href="https://github.com/hassanelq/Simulations-MC-BrownMotion"
                target="_blank"
                className="text-gray-700 border hover:bg-gray-50"
              >
                Explore more
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
