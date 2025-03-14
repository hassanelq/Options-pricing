"use client";

import React, { useState } from "react";
import OptionStyleSelector from "./../components/OptionStyleSelector";
import PricingApproachSelector from "./../components/PricingApproachSelector";
import SolutionMethodSelector from "./../components/SolutionMethodSelector";
import AssetTypeSelector from "./../components/AssetTypeSelector";
import KeyParametersInput from "./../components/KeyParametersInput";
import PricingResult from "./../components/PricingResult";
import { fetchMarketData } from "./../api/marketData";

const PricingPage = () => {
  const [selectedStyle, setSelectedStyle] = useState("European");
  const [selectedApproach, setSelectedApproach] = useState("blackScholes");
  const [selectedSolution, setSelectedSolution] = useState("Direct Formula");
  const [selectedAssetType, setSelectedAssetType] = useState("");
  const [parameters, setParameters] = useState({
    symbol: "AAPL",
    underlyingPrice: 0,
    strikePrice: 150,
    expiration: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    riskFreeRate: 0,
    volatility: 0,
    dividends: 0,
  });
  const [priceResult, setPriceResult] = useState(null);

  const handleFetchMarketData = async () => {
    const marketData = await fetchMarketData(parameters.symbol);
    setParameters((prev) => ({ ...prev, ...marketData }));
  };

  const handleCalculatePrice = () => {
    setPriceResult(
      `Price for a ${selectedStyle} option using ${selectedApproach} with "${selectedSolution}" solution. Asset Type: ${
        selectedAssetType || "N/A"
      }`
    );
  };

  const handleResetInputs = () => {
    setSelectedStyle("European");
    setSelectedApproach("blackScholes");
    setSelectedSolution("Direct Formula");
    setSelectedAssetType("");
    setParameters({
      symbol: "AAPL",
      underlyingPrice: 0,
      strikePrice: 150,
      expiration: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      riskFreeRate: 0,
      volatility: 0,
      dividends: 0,
    });
    setPriceResult(null);
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-teal-50 flex flex-col gap-10">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-teal-800">
          Option Pricing Dashboard
        </h1>
      </div>

      <div className="w-full md:w-3/4 lg:w-2/3 bg-white p-6 rounded-lg shadow-xl mx-auto">
        <OptionStyleSelector
          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
        />
        <PricingApproachSelector
          selectedApproach={selectedApproach}
          setSelectedApproach={setSelectedApproach}
        />
        <SolutionMethodSelector
          selectedSolution={selectedSolution}
          setSelectedSolution={setSelectedSolution}
          approach={selectedApproach}
        />
        <AssetTypeSelector
          selectedAssetType={selectedAssetType}
          setSelectedAssetType={setSelectedAssetType}
          approach={selectedApproach}
        />
        <KeyParametersInput
          parameters={parameters}
          setParameters={setParameters}
          fetchMarketData={handleFetchMarketData}
        />

        <div className="flex flex-wrap gap-4 mt-8">
          <button
            onClick={handleCalculatePrice}
            className="px-4 py-2 bg-teal-600 text-white font-semibold rounded hover:bg-teal-700"
          >
            Calculate Price
          </button>
          <button
            onClick={handleResetInputs}
            className="px-4 py-2 bg-gray-500 text-white font-semibold rounded hover:bg-gray-600"
          >
            Reset Inputs
          </button>
        </div>

        <PricingResult priceResult={priceResult} />
      </div>
    </div>
  );
};

export default PricingPage;
