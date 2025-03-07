"use client";

import React, { useState, useRef, useEffect } from "react";
import ProbabilityBarChart from "../../Components/Charts/ProbabilityBarChart";
import LoadingDots from "../../Components/ui/LoadingDots";

const distributions = [
  {
    type: "normal",
    name: "Normal Distribution",
    description: "Models continuous data with a bell-shaped curve.",
  },
  {
    type: "uniform",
    name: "Uniform Distribution",
    description: "Equal probability for all values in a range.",
  },
  {
    type: "exponential",
    name: "Exponential Distribution",
    description: "Models time between events in a Poisson process.",
  },
  {
    type: "poisson",
    name: "Poisson Distribution",
    description: "Probability of events in a fixed interval.",
  },
  {
    type: "binomial",
    name: "Binomial Distribution",
    description: "Counts successes in a fixed number of trials.",
  },
  {
    type: "lognormal",
    name: "Log-Normal Distribution",
    description: "Model asset prices with right-skewed returns.",
  },
  {
    type: "studentt",
    name: "Student's t-Distribution",
    description: "Model returns with fat-tailed distributions.",
  },
  {
    type: "cauchy",
    name: "Cauchy Distribution",
    description: "Model extreme market movements and heavy tails.",
  },
  {
    type: "beta",
    name: "Beta Distribution",
    description: "Model recovery rates and bounded variables.",
  },
  {
    type: "gamma",
    name: "Gamma Distribution",
    description: "Model insurance risks and waiting times.",
  },
  {
    type: "levy",
    name: "Lévy Distribution",
    description: "Models extreme price jumps and flash crashes.",
  },
  {
    type: "pareto",
    name: "Pareto Distribution",
    description: "Models wealth distribution and insurance claims.",
  },
  {
    type: "hypergeometric",
    name: "Hypergeometric Distribution",
    description: "Models default correlation in small portfolios.",
  },
  {
    type: "weibull",
    name: "Weibull Distribution",
    description: "Models equipment failure and operational risk.",
  },
  {
    type: "triangular",
    name: "Triangular Distribution",
    description: "Models subjective expert estimates and scenarios.",
  },
];

const distributionExplanations = {
  normal:
    "Used in Black-Scholes model for option pricing. Assumes symmetric returns.",
  uniform:
    "Models equal likelihood scenarios, useful for random number generation.",
  exponential: "Models decay processes like credit default timing.",
  poisson: "Used in modeling rare events like market crashes.",
  binomial: "Models binary outcomes like option exercise decisions.",
  lognormal:
    "Models stock prices (cannot go negative). If X ~ Normal(μ,σ), then e^X ~ Lognormal.",
  studentt:
    "Used in Value-at-Risk calculations for small sample sizes. ν < 30 gives heavier tails.",
  cauchy:
    "Models extreme events. No defined mean or variance. Used in stress testing.",
  beta: "Models recovery rates (0-100%). Also used in Bayesian analysis.",
  gamma: "Models insurance claim sizes. k=1 gives exponential distribution.",
  levy: "Models extreme price jumps with heavy tails. Used in high-frequency trading analysis.",
  pareto:
    "Models wealth distribution and extreme events following the 80-20 rule.",
  hypergeometric:
    "Models successes in draws without replacement from finite populations.",
  weibull:
    "Models failure rates with changing risk over time. Used in reliability engineering.",
  triangular:
    "Models subjective estimates with minimum, maximum, and most likely values.",
};

const defaultInputs = {
  normal: { mu: 0, sigma: 1, N: 1000 },
  uniform: { a: 0, b: 1, N: 1000 },
  exponential: { lambda: 1, N: 1000 },
  poisson: { lambda: 1, N: 1000 },
  binomial: { n: 10, p: 0.5, N: 1000 },
  lognormal: { mu: 0, sigma: 1, N: 1000 },
  studentt: { nu: 5, N: 1000 },
  cauchy: { x0: 0, gamma: 1, N: 100 },
  beta: { alpha: 2, beta: 2, N: 1000 },
  gamma: { k: 2, theta: 2, N: 1000 },
  levy: { alpha: 1, gamma: 1, N: 100 },
  pareto: { alpha: 2, xm: 1, N: 100 },
  hypergeometric: { K: 10, N: 50, n: 5, simulations: 1000 },
  weibull: { lambda: 1, k: 1, N: 100 },
  triangular: { a: 0, b: 1, c: 0.5, N: 1000 },
};

const parameterConstraints = {
  normal: { sigma: { min: 0.01 } },
  lognormal: { sigma: { min: 0.01 } },
  studentt: { nu: { min: 1 } },
  cauchy: { gamma: { min: 0.01 } },
  beta: { alpha: { min: 0.01 }, beta: { min: 0.01 } },
  gamma: { k: { min: 0.01 }, theta: { min: 0.01 } },
  binomial: { p: { min: 0, max: 1 } },
  exponential: { lambda: { min: 0.01 } },
  poisson: { lambda: { min: 0.01 } },
  levy: { alpha: { min: 0.1, max: 2 }, gamma: { min: 0.01 } },
  pareto: { alpha: { min: 0.01 }, xm: { min: 0.01 } },
  hypergeometric: {
    K: { min: 1 },
    N: { min: 1 },
    n: { min: 1 },
  },
  weibull: { lambda: { min: 0.01 }, k: { min: 0.01 } },
  triangular: {}, // No constraints needed for a, b, c
};

const inputLabels = {
  normal: {
    mu: "Mean (μ)",
    sigma: "Standard Deviation (σ)",
    N: "Number of Simulations",
  },
  uniform: {
    a: "Start of Range",
    b: "End of Range",
    N: "Number of Simulations",
  },
  exponential: {
    lambda: "Rate Parameter",
    N: "Number of Simulations",
  },
  poisson: {
    lambda: "Rate Parameter",
    N: "Number of Simulations",
  },
  binomial: {
    n: "Number of Trials",
    p: "Success Probability",
    N: "Number of Simulations",
  },
  lognormal: {
    mu: "Log-Mean",
    sigma: "Log-Std Dev",
    N: "Number of Simulations",
  },
  studentt: {
    nu: "Degrees of Freedom",
    N: "Number of Simulations",
  },
  cauchy: {
    x0: "Location",
    gamma: "Scale",
    N: "Number of Simulations",
  },
  beta: {
    alpha: "Shape α",
    beta: "Shape β",
    N: "Number of Simulations",
  },
  gamma: {
    k: "Shape",
    theta: "Scale",
    N: "Number of Simulations",
  },
  levy: {
    alpha: "Stability parameter (0 < α ≤ 2)",
    gamma: "Scale parameter (γ > 0)",
    N: "Number of Simulations",
  },
  pareto: {
    alpha: "Shape parameter (α > 0)",
    xm: "Scale parameter (xₘ > 0)",
    N: "Number of Simulations",
  },
  hypergeometric: {
    K: "Number of success states in population",
    N: "Population size",
    n: "Number of draws",
    simulations: "Number of Simulations",
  },
  weibull: {
    lambda: "Scale parameter (λ > 0)",
    k: "Shape parameter (k > 0)",
    N: "Number of Simulations",
  },
  triangular: {
    a: "Minimum value",
    b: "Maximum value",
    c: "Mode (most likely value)",
    N: "Number of Simulations",
  },
};

const parameterTooltips = {
  normal: {
    mu: "Central tendency of the distribution",
    sigma: "Spread of the distribution (must be > 0)",
  },
  lognormal: {
    mu: "Mean of the underlying normal distribution",
    sigma: "Volatility of the underlying normal distribution",
  },
  studentt: {
    nu: "Degrees of freedom (controls tail heaviness, must be ≥ 1)",
  },
  cauchy: {
    x0: "Central location parameter",
    gamma: "Scale parameter (must be > 0)",
  },
  beta: {
    alpha: "First shape parameter (must be > 0)",
    beta: "Second shape parameter (must be > 0)",
  },
  gamma: {
    k: "Shape parameter (must be > 0)",
    theta: "Scale parameter (must be > 0)",
  },
  binomial: {
    p: "Probability of success (between 0 and 1)",
  },
  exponential: {
    lambda: "Rate parameter (must be > 0)",
  },
  poisson: {
    lambda: "Rate parameter (must be > 0)",
  },
  levy: {
    alpha: "Stability parameter (0 < α ≤ 2)",
    gamma: "Scale parameter (must be > 0)",
  },
  pareto: {
    alpha: "Shape parameter (must be > 0)",
    xm: "Scale parameter (must be > 0)",
  },
  weibull: {
    lambda: "Scale parameter (must be > 0)",
    k: "Shape parameter (must be > 0)",
  },
  triangular: {
    a: "Minimum value",
    b: "Maximum value",
    c: "Mode (most likely value)",
  },
};

const getFinancialUseCases = (distributionType) => {
  const useCases = {
    normal: ["Portfolio returns", "Risk factor modeling"],
    uniform: ["Random number generation", "Scenario analysis"],
    exponential: ["Credit default timing", "Insurance claims"],
    poisson: ["Market crash modeling", "Operational risk events"],
    binomial: ["Option exercise probability", "Credit default swaps"],
    lognormal: ["Stock prices", "Real estate values"],
    studentt: ["VaR calculations", "Small sample analysis"],
    cauchy: ["Extreme risk modeling", "Market crash scenarios"],
    beta: ["Recovery rates", "Default probabilities"],
    gamma: ["Insurance claims", "Operational risk"],
    levy: ["Flash crash modeling", "High-frequency trading anomalies"],
    pareto: ["Wealth distribution analysis", "Catastrophic insurance claims"],
    hypergeometric: [
      "Portfolio default correlation",
      "Small sample risk assessment",
    ],
    weibull: ["Equipment failure prediction", "Operational risk modeling"],
    triangular: [
      "Expert estimation scenarios",
      "Business planning simulations",
    ],
  };
  return useCases[distributionType] || [];
};

const distributionCategories = {
  continuous: {
    name: "Continuous Distributions",
    types: [
      "normal",
      "uniform",
      "exponential",
      "lognormal",
      "studentt",
      "beta",
      "gamma",
      "weibull",
      "triangular",
    ],
  },
  discrete: {
    name: "Discrete Distributions",
    types: ["binomial", "poisson", "hypergeometric"],
  },
  extreme: {
    name: "Extreme/Rare Event Distributions",
    types: ["cauchy", "levy", "pareto"],
  },
};

const ProbabilityDistributionsPage = () => {
  const [distributionType, setDistributionType] = useState(null);
  const [inputs, setInputs] = useState({});
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null); // Add scroll ref

  useEffect(() => {
    if (distributionType && scrollRef.current) {
      scrollRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [distributionType]);

  const handleDistributionChange = (type) => {
    setDistributionType(type);
    setInputs(defaultInputs[type]);
    setResults(null);
    setError(null);
  };

  const handleInputChange = (key, value) => {
    setInputs((prev) => ({
      ...prev,
      [key]: parseFloat(value) || 0,
    }));
  };

  const validateInputs = () => {
    const constraints = parameterConstraints[distributionType] || {};
    return Object.entries(constraints).every(([param, { min, max }]) => {
      const value = inputs[param];
      return (
        (min === undefined || value >= min) &&
        (max === undefined || value <= max)
      );
    });
  };

  const simulateDistribution = async () => {
    if (!validateInputs()) {
      setError("Invalid parameters! Check input constraints.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const simulate = await import(
        `../../../utils/probability/${distributionType}.js`
      );
      const simulationResults = simulate.default(inputs);
      setResults(simulationResults);
    } catch (error) {
      console.error("Simulation error:", error);
      setError("Error running simulation. Please check parameters.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-fit px-4 lg:px-10 py-10 flex flex-col gap-10 bg-gray-50">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-4">
          Probability Distributions
        </h1>
        <p className="text-gray-600">
          Explore and visualize various probability distributions used in
          quantitative finance.
        </p>
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-6">Select a Distribution</h2>
        <div className="space-y-12">
          {Object.entries(distributionCategories).map(
            ([categoryKey, category]) => (
              <div key={categoryKey} className="mb-12">
                <h3 className="text-xl font-semibold mb-6 text-gray-700">
                  {category.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {distributions
                    .filter((dist) => category.types.includes(dist.type))
                    .map((dist) => (
                      <div
                        key={dist.type}
                        onClick={() => handleDistributionChange(dist.type)}
                        className={`cursor-pointer p-6 rounded-lg shadow-md transition transform hover:scale-105 ${
                          distributionType === dist.type
                            ? "bg-blue-100 border-blue-500 border-2"
                            : "bg-white"
                        }`}
                      >
                        <h3 className="text-lg font-bold">{dist.name}</h3>
                        <p className="text-gray-600 mt-2">{dist.description}</p>
                      </div>
                    ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {distributionType && (
        <div ref={scrollRef} className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Input Parameters</h3>
            <div className="space-y-4">
              {Object.entries(inputs).map(([key, value]) => {
                const constraints =
                  parameterConstraints[distributionType]?.[key] || {};
                return (
                  <div key={key} className="relative">
                    <label className="block mb-1 font-medium">
                      {inputLabels[distributionType][key]}
                      <span className="ml-2 text-gray-500 text-sm">
                        {parameterTooltips[distributionType]?.[key]}
                      </span>
                    </label>
                    <input
                      type="number"
                      min={constraints.min}
                      max={constraints.max}
                      step={key === "p" ? 0.01 : key === "N" ? 1 : "any"}
                      className="border p-2 rounded w-full"
                      value={value}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                    />
                  </div>
                );
              })}
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <button
                onClick={simulateDistribution}
                disabled={isLoading}
                className="w-full py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                {isLoading ? <LoadingDots color="white" /> : "Run Simulation"}
              </button>
            </div>
          </div>

          <div className="md:w-2/3 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Results</h3>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingDots color="#3498db" />
              </div>
            ) : results ? (
              <>
                <div className="mb-6">
                  <ProbabilityBarChart
                    data={results.data.frequencies}
                    labels={results.data.labels}
                    distributionType={distributionType}
                    params={inputs}
                    isDiscrete={["binomial", "poisson"].includes(
                      distributionType
                    )}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-lg font-semibold mb-3">Statistics</h4>
                    <ul className="space-y-2">
                      {Object.entries(results.statistics).map(
                        ([key, value]) => (
                          <li key={key} className="flex justify-between">
                            <span className="font-medium">{key}:</span>
                            <span>{value}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-lg font-semibold mb-3">
                      Financial Context
                    </h4>
                    <div className="mb-4">
                      <h5 className="font-medium mb-2">Common Applications</h5>
                      <ul className="list-disc pl-4 space-y-1">
                        {getFinancialUseCases(distributionType).map(
                          (useCase) => (
                            <li key={useCase} className="text-gray-700">
                              {useCase}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Key Insights</h5>
                      <p className="text-gray-700">
                        {distributionExplanations[distributionType]}
                        {distributionType === "lognormal" && (
                          <span className="block mt-2 text-sm">
                            Asset price model: S_t = S₀exp((μ - ½σ²)t + σW_t)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                Run the simulation to view results
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProbabilityDistributionsPage;
