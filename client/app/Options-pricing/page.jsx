"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import OptionStyleSelector from "./../components/OptionStyleSelector";
import PricingApproachSelector from "./../components/PricingApproachSelector";
import SolutionMethodSelector from "./../components/SolutionMethodSelector";
import AssetTypeSelector from "./../components/AssetTypeSelector";
import KeyParametersInput from "./../components/KeyParametersInput";
import OptionList from "./../components/OptionList";
import ParametersInput from "./../components/ParametersInput";
import PricingResult from "./../components/PricingResult";
import { fetchMarketData } from "./../api/marketData";

const PricingPage = () => {
  const [selectedStyle, setSelectedStyle] = useState("European");
  const [selectedApproach, setSelectedApproach] = useState("blackScholes");
  const [selectedAssetType, setSelectedAssetType] = useState("Stocks");
  const [parameters, setParameters] = useState({
    symbol: "AAPL",
    underlyingPrice: 100,
    strikePrice: 150,
    expiration: new Date(),
    riskFreeRate: 4,
    volatility: 0.1,
    dividends: 0,
  });
  const [selectedSolution, setSelectedSolution] = useState("Direct Formula");
  const [priceResult, setPriceResult] = useState(null);
  const [optionsData, setOptionsData] = useState([]);
  const [activeStep, setActiveStep] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    // Automatically advance to the next step when selections are made
    if (selectedStyle) setActiveStep(Math.max(activeStep, 2));
    if (selectedApproach) setActiveStep(Math.max(activeStep, 3));
    if (selectedAssetType) setActiveStep(Math.max(activeStep, 4));
    if (parameters.symbol) setActiveStep(Math.max(activeStep, 5));
  }, [selectedStyle, selectedApproach, selectedAssetType, parameters.symbol]);

  const handleFetchMarketData = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const marketData = await fetchMarketData(parameters.symbol);
      setOptionsData(marketData);
      setActiveStep(Math.max(activeStep, 6));
    } catch {
      setError(true);
    }
    setIsLoading(false);
  };

  const handleAutoFill = (option) => {
    setParameters({
      symbol: option.symbol,
      underlyingPrice: option.stock_price,
      strikePrice: option.strike_price,
      expiration: option.expiration,
      riskFreeRate: 0,
      volatility: option.implied_volatility,
      dividends: 0,
    });
    setActiveStep(Math.max(activeStep, 7));
  };

  const handleCalculatePrice = () => {
    setIsCalculating(true);

    // Simulate calculation time
    setTimeout(() => {
      setPriceResult({
        price: (Math.random() * 50 + 10).toFixed(2),
        delta: (Math.random() * 0.8).toFixed(4),
        gamma: (Math.random() * 0.05).toFixed(4),
        vega: (Math.random() * 0.5).toFixed(4),
        theta: (-Math.random() * 0.2).toFixed(4),
        rho: (Math.random() * 0.2 - 0.1).toFixed(4),
        methodology: `${selectedStyle} option using ${selectedApproach} with "${selectedSolution}" solution. Asset Type: ${
          selectedAssetType || "N/A"
        }`,
      });
      setIsCalculating(false);
    }, 800);
  };

  const handleResetInputs = () => {
    setSelectedStyle("European");
    setSelectedApproach("blackScholes");
    setSelectedSolution("Direct Formula");
    setSelectedAssetType("Stocks");
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
    setOptionsData([]);
    setActiveStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-10 flex flex-col gap-10">
      <motion.div
        className="text-center max-w-4xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-3 text-teal-800 bg-clip-text text-transparent bg-gradient-to-r from-teal-800 to-emerald-600">
          Option Pricing Dashboard
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Calculate option prices and Greeks using different pricing models and
          methodologies
        </p>
      </motion.div>

      <motion.div
        className="w-full md:w-3/4 lg:w-2/3 bg-white p-8 rounded-2xl shadow-xl mx-auto border border-indigo-100"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-teal-800">
            Configuration
          </h2>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleResetInputs}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset
            </motion.button>
          </div>
        </div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <OptionStyleSelector
              selectedStyle={selectedStyle}
              setSelectedStyle={setSelectedStyle}
              isActive={activeStep >= 1}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: activeStep >= 2 ? 1 : 0.6, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <PricingApproachSelector
              selectedApproach={selectedApproach}
              setSelectedApproach={setSelectedApproach}
              isActive={activeStep >= 2}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: activeStep >= 3 ? 1 : 0.6, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <AssetTypeSelector
              selectedAssetType={selectedAssetType}
              setSelectedAssetType={setSelectedAssetType}
              approach={selectedApproach}
              isActive={activeStep >= 3}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: activeStep >= 4 ? 1 : 0.6, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <KeyParametersInput
              selectedAssetType={selectedAssetType}
              parameters={parameters}
              setParameters={setParameters}
              fetchMarketData={handleFetchMarketData}
              isLoading={isLoading}
              isActive={activeStep >= 4}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: optionsData.length > 0 ? 1 : 0,
              height: optionsData.length > 0 ? "auto" : 0,
            }}
            transition={{ duration: 0.4 }}
          >
            <OptionList
              optionsData={optionsData}
              handleAutoFill={handleAutoFill}
              isLoading={isLoading}
              error={error}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: activeStep >= 6 ? 1 : 0.3, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <ParametersInput
              parameters={parameters}
              setParameters={setParameters}
              isActive={activeStep >= 6}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: activeStep >= 7 ? 1 : 0.3, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <SolutionMethodSelector
              selectedSolution={selectedSolution}
              setSelectedSolution={setSelectedSolution}
              approach={selectedApproach}
              isActive={activeStep >= 7}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="flex justify-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCalculatePrice}
              disabled={isCalculating}
              className={`px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-semibold rounded-lg shadow-md hover:from-teal-700 hover:to-emerald-700 transition-all flex items-center gap-2 ${
                isCalculating ? "opacity-75" : ""
              }`}
            >
              {isCalculating ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  Calculate Option Price
                </>
              )}
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: priceResult ? 1 : 0,
            height: priceResult ? "auto" : 0,
          }}
          transition={{ duration: 0.4 }}
          className="mt-8"
        >
          <PricingResult priceResult={priceResult} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PricingPage;
