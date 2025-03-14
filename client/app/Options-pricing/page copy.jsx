"use client";

import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import TickerSearch from "../Components/BS/searchTicker";

const PRICING_CONFIG = {
  European: [
    {
      label: "Black-Scholes (Vanilla)",
      value: "blackScholes",
      solutions: ["Direct Formula", "Monte Carlo", "Euler Approximation"],
    },
    {
      label: "Heston (Stochastic Vol)",
      value: "heston",
      solutions: ["Fourier Transform", "Monte Carlo", "Finite Difference"],
    },
    {
      label: "Ornstein-Uhlenbeck (OU)",
      value: "ou",
      solutions: ["Direct Formula", "Monte Carlo", "Finite Difference"],
    },
  ],
};

const ASSET_TYPES_MAP = {
  blackScholes: ["Stocks", "Indices", "FX", "ETFs"],
  heston: ["Equities", "Commodities", "FX"],
  ou: ["Interest Rates", "Commodities", "Energy Prices"],
};

const DEFAULT_PARAMETERS = {
  symbol: "",
  underlyingPrice: 0,
  strikePrice: 150,
  timeToExpiration: 1,
  riskFreeRate: 0,
  volatility: 0,
  dividends: 0,
};

const PricingPage = () => {
  const [selectedStyle, setSelectedStyle] = useState("European");
  const [selectedApproach, setSelectedApproach] = useState("blackScholes");
  const [selectedSolution, setSelectedSolution] = useState("Direct Formula");
  const [selectedAssetType, setSelectedAssetType] = useState("");
  const [parameters, setParameters] = useState({ ...DEFAULT_PARAMETERS });
  const [optionsList, setOptionsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({ symbol: "", totalResults: 10 });
  const [selectedOption, setSelectedOption] = useState(null);

  const availableApproaches = useMemo(
    () => PRICING_CONFIG[selectedStyle] || [],
    [selectedStyle]
  );
  const approachData = useMemo(
    () => availableApproaches.find((a) => a.value === selectedApproach),
    [selectedApproach, availableApproaches]
  );

  useEffect(() => {
    if (!approachData && availableApproaches.length > 0) {
      setSelectedApproach(availableApproaches[0].value);
      setSelectedSolution(availableApproaches[0].solutions[0]);
    }
  }, [approachData, availableApproaches]);

  const possibleAssetTypes = useMemo(
    () => ASSET_TYPES_MAP[selectedApproach] || [],
    [selectedApproach]
  );

  useEffect(() => {
    if (!possibleAssetTypes.includes(selectedAssetType)) {
      setSelectedAssetType(possibleAssetTypes[0] || "");
    }
  }, [possibleAssetTypes, selectedAssetType]);

  const handleFetchOptions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/options-data", {
        symbol: inputs.symbol,
        total_results: parseInt(inputs.totalResults),
      });
      setOptionsList(response.data);
    } catch (error) {
      console.error("Error fetching options:", error);
      setOptionsList([]);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-teal-50 flex flex-col gap-10">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-teal-800">
          Option Pricing Dashboard
        </h1>
      </div>

      <div className="w-full md:w-3/4 lg:w-2/3 bg-white p-6 rounded-lg shadow-xl mx-auto">
        <TickerSearch
          onSelect={(selectedTicker) =>
            setInputs({ ...inputs, symbol: selectedTicker })
          }
        />

        <h2 className="text-xl font-semibold mt-4">Pricing Approach</h2>
        <select
          value={selectedApproach}
          onChange={(e) => setSelectedApproach(e.target.value)}
          className="w-full p-2 border rounded mt-2"
        >
          {availableApproaches.map((approach) => (
            <option key={approach.value} value={approach.value}>
              {approach.label}
            </option>
          ))}
        </select>

        <h2 className="text-xl font-semibold mt-4">Asset Type</h2>
        <select
          value={selectedAssetType}
          onChange={(e) => setSelectedAssetType(e.target.value)}
          className="w-full p-2 border rounded mt-2"
        >
          {possibleAssetTypes.map((asset) => (
            <option key={asset} value={asset}>
              {asset}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={inputs.totalResults}
          onChange={(e) =>
            setInputs({ ...inputs, totalResults: e.target.value })
          }
          placeholder="Total Results"
          className="w-full p-2 mt-4 border rounded"
        />
        <button
          onClick={handleFetchOptions}
          className="mt-4 p-2 bg-teal-600 text-white rounded"
        >
          Fetch Options
        </button>

        {isLoading && <p>Loading options...</p>}
        <div className="mt-4">
          {optionsList.map((option, index) => (
            <div
              key={index}
              className="p-2 border-b cursor-pointer"
              onClick={() => setParameters(option)}
            >
              {option.option_type.toUpperCase()} - Strike: {option.strike_price}
              , Expiry: {option.expiration}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
