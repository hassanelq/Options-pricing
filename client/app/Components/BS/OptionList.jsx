import React from "react";
import { motion } from "framer-motion";

const OptionList = ({ optionsData, handleAutoFill, isLoading, error }) => {
  if (isLoading) {
    return (
      <motion.div
        className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center text-emerald-700 font-medium my-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-center space-x-2">
          <svg
            className="animate-spin h-5 w-5"
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
          <span>Loading market data...</span>
        </div>
      </motion.div>
    );
  }

  if (error || !optionsData || !Array.isArray(optionsData)) {
    return (
      <motion.div
        className="bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-600 font-medium my-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-center space-x-2">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>
            Failed to fetch market data. Please check the ticker symbol and try
            again.
          </span>
        </div>
      </motion.div>
    );
  }

  if (optionsData.length === 0) {
    return (
      <motion.div
        className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center text-yellow-700 font-medium my-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <span>
          No options data available. Try searching with a different ticker.
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="my-8 bg-white p-6 rounded-xl shadow-sm border border-indigo-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-6">
        <h2 className="text-xl font-semibold text-teal-800">
          Available Options ({optionsData[0]?.symbol || "Unknown"})
        </h2>
        <div className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
          {optionsData.length} contracts
        </div>
      </div>

      <div className="overflow-x-auto ml-4 mr-2">
        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-teal-600 to-emerald-500 text-white">
              <th className="p-2 text-center font-medium">Type</th>
              <th className="p-2 text-center font-medium">Strike</th>
              <th className="p-2 text-center font-medium">Underlying</th>
              <th className="p-2 text-center font-medium">Expiration</th>
              <th className="p-2 text-center font-medium">IV (%)</th>
              <th className="p-2 text-center font-medium">Price</th>
              <th className="p-2 text-center font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {optionsData.map((option, index) => (
              <tr
                key={index}
                className={`border-b border-gray-200 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="p-3 font-medium">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      option.option_type.toLowerCase() === "call"
                        ? "bg-green-100 text-green-800"
                        : "bg-purple-100 text-red-500"
                    }`}
                  >
                    {option.option_type}
                  </span>
                </td>
                <td className="p-3 text-center">
                  ${option.strike_price?.toFixed(2) || "N/A"}
                </td>
                <td className="p-3 text-center">
                  ${option.stock_price?.toFixed(2) || "N/A"}
                </td>
                <td className="p-3 text-center">
                  {option.expiration
                    ? new Date(option.expiration).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="p-3 text-center">
                  {option.implied_volatility
                    ? (option.implied_volatility * 100).toFixed(2) + "%"
                    : "N/A"}
                </td>
                <td className="p-3 text-center">
                  ${option.market_price || "N/A"}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleAutoFill(option)}
                    className="px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                  >
                    Auto-Fill
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default OptionList;
