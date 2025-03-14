import React from "react";
import { motion } from "framer-motion";
import TickerSearch from "./BS/searchTicker";

const KeyParametersInput = ({
  selectedAssetType,
  parameters,
  setParameters,
  fetchMarketData,
  isLoading,
  isActive = true,
}) => {
  return (
    <motion.div
      className={`mb-8 bg-white p-6 rounded-xl shadow-sm border border-indigo-100 ${
        isActive ? "" : "opacity-70"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 flex items-center justify-center text-white font-bold mr-3 shadow-md">
          4
        </div>
        <h2 className="text-xl font-semibold text-teal-800">
          Input Key Parameters
        </h2>
      </div>

      <div className="mb-4 ml-11">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {selectedAssetType} Symbol
          </label>

          <TickerSearch
            onSelect={(selectedTicker) =>
              setParameters({ ...parameters, symbol: selectedTicker })
            }
            selectedAssetType={selectedAssetType}
          />

          <div className="text-xs text-gray-500 mt-2">
            Search and select a ticker symbol to get market data
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={fetchMarketData}
          disabled={isLoading}
          className={`mt-2 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-500 text-white rounded-lg shadow hover:shadow-lg transition-all duration-200 font-medium flex items-center gap-2 ${
            isLoading ? "opacity-75" : ""
          }`}
        >
          {isLoading ? (
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
              Fetching Data...
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Fetch Options Data
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default KeyParametersInput;
