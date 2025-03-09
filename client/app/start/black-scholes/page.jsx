"use client";

import React, { useState } from "react";
import axios from "axios";
import LoadingDots from "../../Components/ui/LoadingDots";
import TickerSearch from "../../Components/BS/searchTicker";
import DatePickerComponent from "../../Components/BS/datePicker";

const BlackScholesPage = () => {
  const [inputs, setInputs] = useState({
    symbol: "AAPL",
    optionStyle: "American",
    expiration: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    optionType: "call",
    totalResults: 10,
  });

  const [optionsList, setOptionsList] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [pricingResult, setPricingResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOptions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/fetchOptions", {
        symbol: inputs.symbol,
        optionStyle: inputs.optionStyle,
        expiration: inputs.expiration.toISOString().split("T")[0],
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

  return (
    <div className="min-h-screen px-4 py-10 flex flex-col gap-10 bg-gray-50">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-4 text-gray-800">
          Options Pricing using Black-Scholes Model
        </h1>
        <p className="text-gray-600">
          Fetch options from the market and compute theoretical pricing.
        </p>
      </div>

      {/* Updated Form Width for Better Mobile Layout */}
      <div className="w-full md:w-3/4 lg:w-2/3 bg-white p-6 rounded-lg shadow-lg mx-auto">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Select Options Criteria
        </h3>

        {/* Ticker Search */}
        <div className="mb-6">
          <TickerSearch
            onSelect={(ticker, optionStyle) =>
              setInputs((prev) => ({
                ...prev,
                symbol: ticker,
                optionStyle: optionStyle,
              }))
            }
          />
        </div>

        {/* Expiration Date & Option Type Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Expiration Date */}
          <div className="w-full md:w-1/2">
            <DatePickerComponent
              selectedDate={inputs.expiration}
              onChange={(date) =>
                setInputs((prev) => ({ ...prev, expiration: date }))
              }
            />
          </div>

          {/* Option Type Selection */}
          <div className="w-full md:w-1/2">
            <label className="block font-medium text-gray-700 mb-2">
              Option Type
            </label>
            <div className="flex gap-6">
              <label className="flex items-center cursor-pointer p-3 border rounded-lg shadow-sm hover:bg-gray-100 transition w-full justify-center">
                <input
                  type="radio"
                  value="call"
                  checked={inputs.optionType === "call"}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      optionType: e.target.value,
                    }))
                  }
                  className="hidden"
                />
                <div
                  className={`w-6 h-6 border-2 rounded-full flex justify-center items-center ${
                    inputs.optionType === "call"
                      ? "border-blue-500"
                      : "border-gray-400"
                  }`}
                >
                  {inputs.optionType === "call" && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <span className="ml-3 text-gray-800 font-medium">Call</span>
              </label>

              <label className="flex items-center cursor-pointer p-3 border rounded-lg shadow-sm hover:bg-gray-100 transition w-full justify-center">
                <input
                  type="radio"
                  value="put"
                  checked={inputs.optionType === "put"}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      optionType: e.target.value,
                    }))
                  }
                  className="hidden"
                />
                <div
                  className={`w-6 h-6 border-2 rounded-full flex justify-center items-center ${
                    inputs.optionType === "put"
                      ? "border-blue-500"
                      : "border-gray-400"
                  }`}
                >
                  {inputs.optionType === "put" && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <span className="ml-3 text-gray-800 font-medium">Put</span>
              </label>
            </div>
          </div>
        </div>

        {/* Fetch Button */}
        <button
          onClick={fetchOptions}
          disabled={isLoading}
          className="w-full py-3 mt-6 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
        >
          {isLoading ? <LoadingDots color="white" /> : "Fetch Options"}
        </button>
      </div>
    </div>
  );
};

export default BlackScholesPage;
