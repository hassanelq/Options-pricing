"use client";

import React, { useState, useCallback } from "react";
import LineChart from "../../Components/Charts/MCLineChart";
import BarChart from "../../Components/Charts/MCBarChart";
import LoadingDots from "../../Components/ui/LoadingDots";
import monteCarloInvestment from "../../../utils/monteCarlo/investment";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import katex from "katex";
import "katex/dist/katex.min.css";

const InvestmentPage = () => {
  const [inputs, setInputs] = useState({
    initialInvestment: 10000,
    annualReturn: 5,
    annualVolatility: 15,
    timeHorizon: 15,
    annualContribution: 500,
    investmentGoal: 50000,
    numSimulations: 1000,
  });
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const inputLabels = {
    initialInvestment: "Initial Investment ($)",
    annualReturn: "Expected Annual Return (%)",
    annualVolatility: "Annual Volatility (%)",
    timeHorizon: "Investment Horizon (Years)",
    annualContribution: "Annual Contribution ($)",
    investmentGoal: "Target Goal ($)",
    numSimulations: "Number of Simulations",
  };

  const runSimulation = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      const simulationResults = monteCarloInvestment(inputs);
      setResults(simulationResults);
      setIsLoading(false);
    }, 1000);
  }, [inputs]);

  return (
    <div className="min-h-screen px-4 py-10 flex flex-col gap-10 bg-gray-50">
      {/* Page Header */}
      {/* Page Header */}
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-4">Investment Simulation</h1>

        <div className="space-y-4 mb-6">
          <p className="text-gray-600">
            Simulate long-term investment outcomes with market volatility
            analysis. Visualize potential portfolio growth and probability of
            reaching your financial goals using Monte Carlo methods.
          </p>

          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center justify-center w-full gap-2 text-blue-600 hover:text-blue-800 font-medium">
                  <span>{open ? "Hide" : "View"} Theoretical Background</span>
                  <ChevronUpIcon
                    className={`${open ? "transform rotate-180" : ""} w-5 h-5`}
                  />
                </Disclosure.Button>

                <Disclosure.Panel className="mt-6 text-left space-y-6">
                  {/* Portfolio Growth Model */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3 text-lg">
                      1. Portfolio Growth Model
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm">Annual portfolio value update:</p>
                      <div className="bg-white p-3 rounded text-center font-mono">
                        <span
                          className="text-base"
                          dangerouslySetInnerHTML={{
                            __html: katex.renderToString(
                              "S_{t+1} = (S_t + C) \\cdot \\left(1 + \\mu + \\sigma Z\\right)"
                            ),
                          }}
                        />
                      </div>

                      <ul className="list-disc pl-5 text-sm space-y-2">
                        <li>
                          <span className="font-medium">St</span> = Portfolio
                          value at year {`t`} (Current: $
                          {inputs.initialInvestment})
                        </li>
                        <li>
                          <span className="font-medium">μ</span> = Expected
                          annual return ({inputs.annualReturn}%)
                        </li>
                        <li>
                          <span className="font-medium">σ</span> = Annual
                          volatility ({inputs.annualVolatility}%)
                        </li>
                        <li>
                          <span className="font-medium">C</span> = Annual
                          contribution (${inputs.annualContribution})
                        </li>
                        <li>
                          <span className="font-medium">Z</span> ∼{" "}
                          <span
                            dangerouslySetInnerHTML={{
                              __html: katex.renderToString("\\mathcal{N}(0,1)"),
                            }}
                          />
                          (Standard normal random variable)
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Monte Carlo Algorithm */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3 text-lg">
                      2. Simulation Process
                    </h3>
                    <ol className="list-decimal pl-5 space-y-4 text-sm">
                      <li>
                        <span className="font-medium">Initialization:</span>
                        <div className="ml-4 mt-2 bg-blue-50 p-2 rounded">
                          <code>portfolio = initialInvestment</code>
                        </div>
                      </li>
                      <li>
                        <span className="font-medium">Yearly Update:</span>
                        <div className="ml-4 mt-2 bg-blue-50 p-2 rounded">
                          <code
                            dangerouslySetInnerHTML={{
                              __html: katex.renderToString(
                                `\\text{for each year } t = 1 \\text{ to } T\\\\
                          \\quad Z \\leftarrow \\mathcal{N}(0,1)\\\\
                          \\quad \\text{shock} = \\sigma \\times Z\\\\
                          \\quad \\text{portfolio} = (\\text{portfolio} + C) \\times (1 + \\mu + \\text{shock})`
                              ),
                            }}
                          />
                        </div>
                      </li>
                      <li>
                        <span className="font-medium">Repeat Simulations:</span>
                        <div className="ml-4 mt-2 bg-blue-50 p-2 rounded">
                          <code>
                            Run {inputs.numSimulations} independent trials
                          </code>
                        </div>
                      </li>
                    </ol>
                  </div>

                  {/* Success Probability */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3 text-lg">
                      3. Success Probability Calculation
                    </h3>
                    <div className="bg-white p-3 rounded text-center">
                      <span
                        className="text-base"
                        dangerouslySetInnerHTML={{
                          __html: katex.renderToString(
                            `\\mathbb{P}(\\text{Success}) = \\frac{\\text{Number of } S_T \\geq G}{N} \\times 100`
                          ),
                        }}
                      />
                    </div>
                    <ul className="list-disc pl-5 mt-2 text-sm space-y-2">
                      <li>
                        <span className="font-medium">G</span> = Investment goal
                        (${inputs.investmentGoal})
                      </li>
                      <li>
                        <span className="font-medium">ST</span> = Final
                        portfolio value
                      </li>
                      <li>
                        <span className="font-medium">N</span> = Number of
                        simulations ({inputs.numSimulations})
                      </li>
                    </ul>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      </div>

      {/* Simulation Interface */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Inputs Section */}
        <div className="md:w-1/3 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Investment Parameters</h3>
          {Object.entries(inputLabels).map(([key, label]) => (
            <div key={key} className="mb-4">
              <label className="block font-medium">{label}</label>
              <input
                type="number"
                value={inputs[key] || 0}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    [key]: parseFloat(e.target.value) || 0,
                  }))
                }
                className="border p-2 rounded w-full"
              />
            </div>
          ))}
          <button
            onClick={runSimulation}
            disabled={isLoading}
            className="w-full py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            {isLoading ? <LoadingDots color="white" /> : "Run Simulation"}
          </button>
        </div>

        {/* Results Section */}
        <div className="md:w-2/3 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Simulation Results</h3>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingDots color="#3498db" />
            </div>
          ) : results ? (
            <>
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-4">Key Metrics</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Success Probability</p>
                    <p className="text-2xl font-bold">
                      {results.summary["Probability to Reach Target"]}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Average Value</p>
                    <p className="text-2xl font-bold">
                      ${results.summary["Average Final Value"]}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className=" ">
                  <h5 className="text-lg font-semibold mb-4">
                    Portfolio Growth Paths
                  </h5>
                  <LineChart data={results.graph} />
                </div>

                <div className=" ">
                  <h5 className="text-lg font-semibold mb-4">
                    Outcome Distribution
                  </h5>
                  <BarChart data={results.distribution} />
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500">
              Run the simulation to view projected investment outcomes
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestmentPage;
