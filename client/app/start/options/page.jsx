"use client";

import React, { useState, useCallback } from "react";
import LineChart from "../../Components/Charts/MCLineChart";
import LoadingDots from "../../Components/ui/LoadingDots";
import monteCarloOptions from "../../../utils/monteCarlo/options";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import katex from "katex";
import "katex/dist/katex.min.css";

const OptionsPage = () => {
  const [inputs, setInputs] = useState({
    stockPrice: 100,
    strikePrice: 110,
    riskFreeRate: 5,
    volatility: 20,
    timeToMaturity: 1,
    dividendYield: 0, // New input
    optionType: "call", // New input
    numSimulations: 1000,
  });
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const inputLabels = {
    stockPrice: "Current Stock Price ($)",
    strikePrice: "Strike Price ($)",
    riskFreeRate: "Risk-Free Rate (%)",
    volatility: "Volatility (%)",
    timeToMaturity: "Time to Maturity (Years)",
    dividendYield: "Dividend Yield (%)", // New input
    optionType: "Option Type", // New input
    numSimulations: "Number of Simulations",
  };

  const runSimulation = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      const simulationResults = monteCarloOptions(inputs);
      setResults(simulationResults);
      setIsLoading(false);
    }, 1000);
  }, [inputs]);

  return (
    <div className="min-h-screen px-4 py-10 flex flex-col gap-10 bg-gray-50">
      {/* Page Header */}
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-4">
          Options Pricing Simulation
        </h1>

        <div className="space-y-4 mb-6">
          <p className="text-gray-600">
            Monte Carlo simulation for European options pricing based on the
            Black-Scholes-Merton model.
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
                  {/* Mathematical Model */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3 text-lg">
                      1. Asset Price Model
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm">Geometric Brownian Motion:</p>
                      <div className="bg-white p-3 rounded text-center font-mono">
                        <span
                          className="text-base"
                          dangerouslySetInnerHTML={{
                            __html: katex.renderToString(
                              "S_T = S_0 \\cdot \\exp\\left[\\left(r - q - \\frac{\\sigma^2}{2}\\right)T + \\sigma\\sqrt{T}Z\\right]"
                            ),
                          }}
                        />
                      </div>

                      <ul className="list-disc pl-5 text-sm space-y-2">
                        <li>
                          <span className="font-medium">S0</span> = Spot price (
                          {inputs.stockPrice}$)
                        </li>
                        <li>
                          <span className="font-medium">r</span> = Risk-free
                          rate ({inputs.riskFreeRate}%)
                        </li>
                        <li>
                          <span className="font-medium">σ</span> = Volatility (
                          {inputs.volatility}%)
                        </li>
                        <li>
                          <span className="font-medium">T</span> = Time to
                          maturity ({inputs.timeToMaturity} years)
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
                      2. Monte Carlo Algorithm
                    </h3>
                    <ol className="list-decimal pl-5 space-y-4 text-sm">
                      <li>
                        <span className="font-medium">
                          Simulating Price Paths:
                        </span>
                        <div className="ml-4 mt-2 bg-blue-50 p-2 rounded">
                          <code
                            dangerouslySetInnerHTML={{
                              __html: katex.renderToString(
                                `\\text{for } i = 1 \\text{ to } N\\\\
                          \\quad Z \\leftarrow \\mathcal{N}(0,1)\\\\
                          \\quad S_T^{i} = S_0 \\cdot \\exp(...)\\\\
                          \\quad \\text{payoff}^{i} = \\max(S_T^{i} - K, 0)`
                              ),
                            }}
                          />
                        </div>
                      </li>

                      <li>
                        <span className="font-medium">
                          Discounting Payoffs:
                        </span>
                        <div className="ml-4 mt-2 bg-white p-3 rounded text-center">
                          <span
                            className="text-base"
                            dangerouslySetInnerHTML={{
                              __html: katex.renderToString(
                                "C = e^{-rT} \\cdot \\frac{1}{N} \\sum_{(i = 1)}^{N} \\text{payoff}^{i}"
                              ),
                            }}
                          />
                        </div>
                      </li>
                    </ol>
                  </div>

                  {/* ITM Probability */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3 text-lg">
                      3. In-the-Money (ITM) Probability
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-green-50 p-3 rounded">
                        <p className="font-medium">Call Option:</p>
                        <div className="mt-1">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: katex.renderToString(
                                "\\mathbb{P}(S_T > K) = \\frac{\\text{Number of } S_T > K}{N}"
                              ),
                            }}
                          />
                        </div>
                      </div>
                      <div className="bg-red-50 p-3 rounded">
                        <p className="font-medium">Put Option:</p>
                        <div className="mt-1">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: katex.renderToString(
                                "\\mathbb{P}(S_T < K) = \\frac{\\text{Number of } S_T < K}{N}"
                              ),
                            }}
                          />
                        </div>
                      </div>
                    </div>
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
          <h3 className="text-xl font-bold mb-4">Option Parameters</h3>
          {Object.entries(inputLabels).map(([key, label]) => (
            <div key={key} className="mb-4">
              <label className="block font-medium">{label}</label>
              {key === "optionType" ? (
                <select
                  value={inputs[key]}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                  className="border p-2 rounded w-full"
                >
                  <option value="call">Call</option>
                  <option value="put">Put</option>
                </select>
              ) : (
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
              )}
            </div>
          ))}
          <button
            onClick={runSimulation}
            disabled={isLoading}
            className="w-full py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            {isLoading ? <LoadingDots color="white" /> : "Price Option"}
          </button>
        </div>

        {/* Results Section */}
        <div className="md:w-2/3 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Pricing Results</h3>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingDots color="#3498db" />
            </div>
          ) : results ? (
            <>
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-4">Option Valuation</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Call Option Price</p>
                    <p className="text-2xl font-bold">
                      ${results?.callPrice?.toFixed(2) || "N/A"}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Put Option Price</p>
                    <p className="text-2xl font-bold">
                      ${results?.putPrice?.toFixed(2) || "N/A"}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">ITM Probability</p>
                    <p className="text-2xl font-bold">
                      {results.inTheMoneyProbability}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="">
                  <h5 className="text-lg font-semibold mb-4">
                    Simulated Price Paths
                  </h5>
                  <LineChart data={results.pricePaths} />
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500">
              Run the simulation to view option pricing results
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OptionsPage;
