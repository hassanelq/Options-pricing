"use client";

import React, { useState, useCallback } from "react";
import LoadingDots from "../../Components/ui/LoadingDots";

const BlackSholesPage = () => {
  const [inputs, setInputs] = useState({
    stockPrice: 100,
    strikePrice: 110,
    riskFreeRate: 5,
    volatility: 20,
    timeToMaturity: 1,
    dividendYield: 0,
    optionType: "call",
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
    dividendYield: "Dividend Yield (%)",
    optionType: "Option Type",
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

export default BlackSholesPage;
