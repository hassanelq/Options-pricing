"use client";

import NavLink from "../Components/ui/NavLink";

export default function StartPage() {
  const simulations = [
    {
      title: "Probability Distributions",
      path: "/start/probability",
      description:
        "Explore probability distributions and their applications in real-world scenarios.",
      icon: "🎲",
    },
    {
      title: "Investment Simulation",
      path: "/start/investment",
      description:
        "Simulate the growth of an investment portfolio over time, accounting for market volatility and annual contributions.",
      icon: "📊",
    },
    {
      title: "Options Pricing",
      path: "/start/options",
      description:
        "Estimate the fair value of financial options using the Monte Carlo method by simulating asset price paths.",
      icon: "📊",
    },
    // {
    //   title: "Monte Carlo Simulation",
    //   path: "/start/monteCarlo",
    //   description:
    //     "Simulate random processes and analyze complex systems using Monte Carlo methods.",
    //   icon: "📊",
    // },
    // {
    //   title: "Brownian Motion",
    //   path: "/start/brownianMotion",
    //   description:
    //     "Dive into stochastic processes and Brownian motion with interactive simulations.",
    //   icon: "🌊",
    // },
  ];

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center bg-gray-50 py-12 px-6">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
        Choose a Simulation
      </h1>
      <p className="text-lg text-gray-600 mb-12 max-w-2xl text-center">
        Explore our simulation tools, using Monte Carlo methods. Each simulation
        is designed to help you understand complex concepts through interactive
        visualizations.
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl">
        {simulations.map((sim, index) => (
          <li
            key={index}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center"
          >
            <div className="text-5xl mb-4">{sim.icon}</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              {sim.title}
            </h2>
            <p className="text-gray-600 mb-6">{sim.description}</p>
            <NavLink
              href={sim.path}
              className="block font-medium text-lg text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 px-4 py-2 rounded-md"
            >
              Explore
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
