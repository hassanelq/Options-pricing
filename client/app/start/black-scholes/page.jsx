"use client";

import React, { useState } from "react";
import axios from "axios";
import LoadingDots from "../../Components/ui/LoadingDots";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const BlackScholesPage = () => {
  // Initial input states
  const [inputs, setInputs] = useState({
    symbols: "AAPL,NVDA,AMZN", // Multiple stock symbols
    expiration: new Date("2025-04-17"), // Expiration date picker
    minStrike: 120,
    maxStrike: 180,
    optionType: "call",
    totalResults: 10, // Max results
  });

  const [optionsList, setOptionsList] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [pricingResult, setPricingResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOptions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/fetchOptions", {
        symbols: inputs.symbols, // "AAPL,NVDA,AMZN"
        expiration: inputs.expiration.toISOString().split("T")[0], // YYYY-MM-DD
        minStrike: inputs.minStrike,
        maxStrike: inputs.maxStrike,
        optionType: inputs.optionType,
        totalResults: inputs.totalResults,
      });

      setOptionsList(response.data);
      setSelectedOption(null);
      setPricingResult(null);
    } catch (error) {
      console.error("Error fetching options:", error);
      setOptionsList([]);
    }
    setIsLoading(false);
  };

  // Fetch available options from API
  // const fetchOptions = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await axios.post("http://127.0.0.1:8000/options-data", {
  //       symbols: inputs.symbols.split(",").map((s) => s.trim()), // Convert CSV to list
  //       expiration: inputs.expiration.toISOString().split("T")[0], // Format to YYYY-MM-DD
  //       min_strike: parseFloat(inputs.minStrike),
  //       max_strike: parseFloat(inputs.maxStrike),
  //       option_type: inputs.optionType.toLowerCase(),
  //       total_results: parseInt(inputs.totalResults),
  //     });

  //     setOptionsList(response.data);
  //     setSelectedOption(null);
  //     setPricingResult(null);
  //   } catch (error) {
  //     console.error("Error fetching options:", error);
  //     setOptionsList([]);
  //   }
  //   setIsLoading(false);
  // };

  // Price selected option using Black-Scholes
  const priceOption = async (option) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/black-scholes-pricing",
        {
          stock_price: option.stock_price,
          strike_price: option.strike_price,
          expiration: option.expiration,
          risk_free_rate: 0.02, // Default risk-free rate
          implied_volatility: option.implied_volatility,
          option_type: option.option_type,
          market_price: option.market_price,
        }
      );
      setPricingResult(response.data);
    } catch (error) {
      console.error("Error pricing option:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen px-4 py-10 flex flex-col gap-10 bg-gray-50">
      {/* Page Header */}
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-4">
          Options Pricing using Black-Scholes Model
        </h1>
        <p className="text-gray-600">
          Fetch options from the market and compute theoretical pricing.
        </p>
      </div>

      {/* Inputs Section */}
      <div className="md:w-2/3 bg-white p-6 rounded-lg shadow-md mx-auto">
        <h3 className="text-xl font-bold mb-4">Select Options Criteria</h3>

        {/* Symbols Input */}
        <div className="mb-4">
          <label className="block font-medium">
            Stock Symbols (comma-separated)
          </label>
          <input
            type="text"
            value={inputs.symbols}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, symbols: e.target.value }))
            }
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Expiration Date Picker */}
        <div className="mb-4">
          <label className="block font-medium">Expiration Date</label>
          <DatePicker
            selected={inputs.expiration}
            onChange={(date) =>
              setInputs((prev) => ({ ...prev, expiration: date }))
            }
            className="border p-2 rounded w-full"
            dateFormat="yyyy-MM-dd"
          />
        </div>

        {/* Strike Price Range Slider */}
        <div className="mb-4">
          <label className="block font-medium">Strike Price Range ($)</label>
          <Slider
            range
            min={50}
            max={500}
            value={[inputs.minStrike, inputs.maxStrike]}
            onChange={(values) =>
              setInputs((prev) => ({
                ...prev,
                minStrike: values[0],
                maxStrike: values[1],
              }))
            }
          />
          <div className="flex justify-between text-sm mt-2">
            <span>${inputs.minStrike}</span>
            <span>${inputs.maxStrike}</span>
          </div>
        </div>

        {/* Option Type */}
        <div className="mb-4">
          <label className="block font-medium">Option Type</label>
          <select
            value={inputs.optionType}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, optionType: e.target.value }))
            }
            className="border p-2 rounded w-full"
          >
            <option value="call">Call</option>
            <option value="put">Put</option>
          </select>
        </div>

        {/* Fetch Button */}
        <button
          onClick={fetchOptions}
          disabled={isLoading}
          className="w-full py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          {isLoading ? <LoadingDots color="white" /> : "Fetch Options"}
        </button>
      </div>

      {/* Options List */}
      {/* Options List */}
      {optionsList && (
        <div className="md:w-3/4 bg-white p-6 rounded-lg shadow-md mx-auto">
          <h3 className="text-xl font-bold mb-4">Available Options</h3>
          {optionsList.length === 0 ? (
            <p className="text-gray-500">
              No options found. Try different filters.
            </p>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Symbol</th>
                  <th className="border p-2">Strike Price</th>
                  <th className="border p-2">Expiration</th>
                  <th className="border p-2">Type</th>
                  <th className="border p-2">Market Price</th>
                  <th className="border p-2">Implied Volatility</th>
                  <th className="border p-2">Select</th>
                </tr>
              </thead>
              <tbody>
                {optionsList.map((option, index) => (
                  <tr key={index} className="text-center">
                    <td className="border p-2">{option.symbol}</td>
                    <td className="border p-2">${option.strike_price}</td>
                    <td className="border p-2">{option.expiration}</td>
                    <td className="border p-2 capitalize">
                      {option.option_type}
                    </td>
                    <td className="border p-2">${option.market_price}</td>
                    <td className="border p-2">
                      {(option.implied_volatility * 100).toFixed(2)}%
                    </td>
                    <td className="border p-2">
                      <button
                        onClick={() => {
                          setSelectedOption(option);
                          priceOption(option);
                        }}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                      >
                        Price Option
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default BlackScholesPage;
