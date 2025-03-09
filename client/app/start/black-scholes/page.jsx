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
        <h1 className="text-3xl font-extrabold mb-4">
          Options Pricing using Black-Scholes Model
        </h1>
        <p className="text-gray-600">
          Fetch options from the market and compute theoretical pricing.
        </p>
      </div>

      <div className="md:w-2/3 bg-white p-6 rounded-lg shadow-md mx-auto">
        <h3 className="text-xl font-bold mb-4">Select Options Criteria</h3>

        <div className="mb-4">
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
        <div className="mb-4 z-10">
          <DatePickerComponent
            selectedDate={inputs.expiration}
            onChange={(date) =>
              setInputs((prev) => ({ ...prev, expiration: date }))
            }
          />
        </div>

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

        <button
          onClick={fetchOptions}
          disabled={isLoading}
          className="w-full py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          {isLoading ? <LoadingDots color="white" /> : "Fetch Options"}
        </button>
      </div>
    </div>
  );
};

export default BlackScholesPage;
