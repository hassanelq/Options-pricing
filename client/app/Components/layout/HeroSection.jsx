"use client";
import NavLink from "../ui/NavLink";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";

const LottieAnimation = dynamic(() => import("../ui/LootieAnimation"), {
  ssr: false,
});

export default function Hero() {
  return (
    <section className="min-h-[85vh] flex items-center">
      <div className="custom-screen text-center flex flex-col gap-14 py-16">
        <div className="space-y-2 md:space-y-8 max-w-4xl mx-auto">
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LottieAnimation />
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl text-gray-800 font-extrabold mx-auto sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-teal-800 to-emerald-600">
              Option Pricing Dashboard
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              A comprehensive toolkit for financial professionals and
              researchers to price options using industry-standard models.
              Combine sophisticated mathematical methods with user-friendly
              interfaces to gain valuable insights into option valuation.
            </p>
            <div className="flex items-center justify-center gap-x-4 font-medium">
              <NavLink
                href="/Options-pricing"
                className="text-white bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 active:from-teal-800 active:to-emerald-700 shadow-md hover:shadow-lg px-6 py-3"
              >
                Start Pricing Options
              </NavLink>
              <NavLink
                href="https://github.com/hassanelq/Options-pricing"
                target="_blank"
                className="border border-indigo-200 text-indigo-700 hover:bg-indigo-50 px-6 py-3"
              >
                View Source Code
              </NavLink>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="bg-teal-100 w-12 h-12 flex items-center justify-center rounded-full mb-4 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-teal-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Multiple Models
            </h3>
            <p className="text-gray-600">
              Support for Black-Scholes, Heston, and Ornstein-Uhlenbeck models
              with mathematical rigor and precision.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="bg-indigo-100 w-12 h-12 flex items-center justify-center rounded-full mb-4 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-indigo-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Method Comparison
            </h3>
            <p className="text-gray-600">
              Analyze pricing differences between numerical methods, closed-form
              solutions, and Monte Carlo simulations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="bg-emerald-100 w-12 h-12 flex items-center justify-center rounded-full mb-4 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-emerald-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Live Market Data
            </h3>
            <p className="text-gray-600">
              Integrate with market APIs to fetch real-time option data,
              calculate implied volatilities, and calibrate models.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
