import React, { useState } from "react";
import { motion } from "framer-motion";
import OptionPayoffGraphs from "./OptionPayoffGraphs";

const PricingResult = ({
  priceResult,
  compareResults,
  market_price,
  parameters,
}) => {
  const [activeTab, setActiveTab] = useState("performance");

  if (!priceResult && (!compareResults || !compareResults.length)) return null;

  // Helper function to format numbers
  const formatNumber = (num, precision = 2) => {
    if (num === undefined || num === null) return "N/A";
    return typeof num === "number" ? Number(num).toFixed(precision) : num;
  };

  // Determine color based on price difference from market price
  const getPriceColor = (price) => {
    if (!market_price || price === undefined) return "text-teal-900";

    const diff = Math.abs((price - market_price) / market_price);
    if (diff < 0.05) return "text-green-600";
    if (diff < 0.1) return "text-yellow-600";
    return "text-red-600";
  };

  // Calculate error percentage
  const calculateError = (price) => {
    if (!market_price || price === undefined) return null;
    return ((price - market_price) / market_price) * 100;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl shadow-lg border border-slate-200"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-slate-800">
          Option Pricing Result
        </h3>
        {market_price && (
          <div className="flex items-center mt-2 md:mt-0">
            <span className="text-sm font-medium text-slate-600 mr-2">
              Market Price:
            </span>
            <span className="text-lg font-bold text-indigo-600">
              ${formatNumber(market_price, 2)}
            </span>
          </div>
        )}
      </div>

      {priceResult ? (
        // Single Result Display
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Result Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-4 text-white">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-medium">
                {priceResult.methodology || "Option Price"}
              </h4>
              <div className="flex items-center">
                <span className={`text-4xl font-bold text-white`}>
                  ${formatNumber(priceResult.price, 2)}
                </span>
                {market_price && (
                  <div className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                    {calculateError(priceResult.price) > 0 ? "+" : ""}
                    {formatNumber(calculateError(priceResult.price), 2)}%
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex" aria-label="Tabs">
              <button
                className={`py-3 px-4 text-sm font-medium ${
                  activeTab === "performance"
                    ? "text-indigo-600 border-b-2 border-indigo-500"
                    : "text-gray-500 hover:text-indigo-500"
                }`}
                onClick={() => setActiveTab("performance")}
              >
                Performance
              </button>
              <button
                className={`py-3 px-4 text-sm font-medium ${
                  activeTab === "details"
                    ? "text-indigo-600 border-b-2 border-indigo-500"
                    : "text-gray-500 hover:text-indigo-500"
                }`}
                onClick={() => setActiveTab("details")}
              >
                Details
              </button>
              <button
                className={`py-3 px-4 text-sm font-medium ${
                  activeTab === "greeks"
                    ? "text-indigo-600 border-b-2 border-indigo-500"
                    : "text-gray-500 hover:text-indigo-500"
                }`}
                onClick={() => setActiveTab("greeks")}
              >
                Greeks
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === "details" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(priceResult).map(([key, value]) => {
                  // Skip certain keys
                  if (
                    [
                      "price",
                      "methodology",
                      "calculation_time",
                      "delta",
                      "gamma",
                      "theta",
                      "vega",
                      "rho",
                    ].includes(key)
                  )
                    return null;

                  return (
                    <div
                      key={key}
                      className="flex justify-between border-b pb-2 last:border-none"
                    >
                      <span className="text-gray-600 capitalize">
                        {key.replace(/_/g, " ")}:
                      </span>
                      <span className="text-slate-800 font-semibold">
                        {formatNumber(value, 4)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === "greeks" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["delta", "gamma", "theta", "vega", "rho"].map(
                  (greek) =>
                    priceResult[greek] !== undefined && (
                      <div
                        key={greek}
                        className="flex justify-between border-b pb-2 last:border-none"
                      >
                        <span className="text-gray-600 capitalize">
                          {greek}:
                        </span>
                        <span className="text-slate-800 font-semibold">
                          {formatNumber(priceResult[greek], 4)}
                        </span>
                      </div>
                    )
                )}
                {!Object.keys(priceResult).some((key) =>
                  ["delta", "gamma", "theta", "vega", "rho"].includes(key)
                ) && (
                  <p className="text-gray-500 italic">
                    No Greeks available for this pricing method.
                  </p>
                )}
              </div>
            )}

            {activeTab === "performance" && (
              <div className="grid grid-cols-1 gap-4">
                {priceResult.calculation_time !== undefined && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Calculation Time:</span>
                    <span className="text-slate-800 font-semibold">
                      {typeof priceResult.calculation_time === "number"
                        ? `${priceResult.calculation_time} ms`
                        : priceResult.calculation_time}
                    </span>
                  </div>
                )}
                {market_price && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Error vs Market:</span>
                    <span
                      className={`font-semibold ${
                        Math.abs(calculateError(priceResult.price)) < 5
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {calculateError(priceResult.price) > 0 ? "+" : ""}
                      {formatNumber(calculateError(priceResult.price), 2)}%
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        // Comparison Results Display
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Comparison Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-4 text-white">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-medium">Method Comparison</h4>
            </div>
          </div>

          {/* Comparison Results Cards */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${compareResults.length} gap-4 p-4`}
          >
            {compareResults.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-lg border ${
                  item.hasError ? "border-red-200" : "border-gray-200"
                } shadow-md hover:shadow-lg transition-shadow`}
              >
                <div
                  className={`p-4 border-b border-gray-200 ${
                    item.hasError ? "bg-red-50" : "bg-gray-50"
                  }`}
                >
                  <h5 className="text-lg font-bold text-slate-800 mb-1">
                    {item.method}
                  </h5>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>

                <div className="p-4">
                  <div className="text-center mb-4">
                    {item.hasError ? (
                      <div className="text-red-500 text-lg font-medium">
                        Calculation failed
                      </div>
                    ) : (
                      <>
                        <span
                          className={`text-3xl font-bold ${getPriceColor(
                            item.result.price
                          )}`}
                        >
                          ${formatNumber(item.result.price, 2)}
                        </span>
                        {market_price && (
                          <div className="mt-1 text-sm">
                            <span
                              className={`font-medium ${
                                Math.abs(calculateError(item.result.price)) < 5
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {calculateError(item.result.price) > 0 ? "+" : ""}
                              {formatNumber(
                                calculateError(item.result.price),
                                2
                              )}
                              %
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    {!item.hasError &&
                      Object.entries(item.result).map(([key, value]) => {
                        if (
                          ["price", "methodology", "market_price"].includes(key)
                        )
                          return null;

                        return (
                          <div
                            key={key}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-600 capitalize">
                              {key.replace(/_/g, " ")}:
                            </span>
                            <span className="text-slate-800 font-medium">
                              {formatNumber(value, 4)}
                            </span>
                          </div>
                        );
                      })}
                    {item.hasError && (
                      <div className="text-sm text-red-500">
                        {item.result.error ||
                          "An error occurred during calculation"}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      <OptionPayoffGraphs parameters={parameters} priceResult={priceResult} />
    </motion.div>
  );
};

export default PricingResult;
