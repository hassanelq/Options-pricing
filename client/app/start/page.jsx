"use client";

import NavLink from "../Components/ui/NavLink";

export default function StartPage() {
  const simulations = [
    {
      title: "Ornstein Uhlenbeck Process",
      path: "/start/ornstein-uhlenbeck",
      description:
        "Learn about the Ornstein Uhlenbeck Process, a mean-reverting stochastic process used in finance and physics.",
      icon: "📉",
    },
    {
      title: "Black Scholes Model",
      path: "/start/black-scholes",
      description:
        "Understand the Black Scholes Model, a mathematical model used to calculate the theoretical price of European-style options.",
      icon: "🎲",
    },
    {
      title: "Heston Model",
      path: "/start/heston",
      description:
        "Explore the Heston Model, a stochastic volatility model used to price options and other derivatives.",
      icon: "📈",
    },
  ];

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center bg-gray-50 py-12 px-6">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
        Select a model
      </h1>
      <p className="text-lg text-gray-600 mb-12 max-w-2xl text-center">
        Select a model to explore and understand the underlying concepts of
        financial derivatives.
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
