import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

async function fetchRiskFreeRate(years) {
  // Goes to /api/v1/risk-free-rate/<years>, your Next.js route
  const { data } = await axios.get(`/api/v1/risk-free-rate/${years}`);

  // If there's an "error" key, throw it
  if (data.error) {
    throw new Error(data.error);
  }

  // Otherwise, data.value is your latestValue from FRED
  return data.value;
}

const ParametersInput = ({ parameters, setParameters }) => {
  const [timeToExpiration, setTimeToExpiration] = useState(1);
  const [isFetchingRate, setIsFetchingRate] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [rateType, setRateType] = useState("N/A");

  // Function to determine the correct Treasury rate
  const getRateType = (years) => {
    const numYears = parseFloat(years); // Ensure it's a number

    if (isNaN(numYears) || numYears < 0) return "Invalid Expiration Date";
    if (numYears < 1) return "3-month T-Bill";
    if (numYears < 5) return "5-year Treasury Note";
    return "10-year Treasury Note";
  };

  // Function to handle expiration date change
  const handleExpirationChange = () => {
    const selectedDate = new Date(parameters.expiration);
    const today = new Date();

    if (isNaN(selectedDate.getTime())) {
      setTimeToExpiration(0); // Reset to 0 if no valid date is selected
      return;
    }

    const yearsRemaining =
      (selectedDate - today) / (1000 * 60 * 60 * 24 * 365.25); // Adjusted for leap years

    setTimeToExpiration(yearsRemaining.toFixed(2));
    setParameters((prev) => ({
      ...prev,
      yearsToExpiration: yearsRemaining.toFixed(2),
    }));
  };

  const fetchRiskFreeRateData = async () => {
    try {
      setIsFetchingRate(true);
      const latestRate = await fetchRiskFreeRate(timeToExpiration);
      setParameters((prev) => ({ ...prev, riskFreeRate: latestRate }));
      setRateType(getRateType(parseFloat(timeToExpiration))); // Ensure it's a number
    } catch (error) {
      setFetchError(error.message);
    } finally {
      setIsFetchingRate(false);
    }
  };

  // Automatically run handleExpirationChange if expiration date changes
  useEffect(() => {
    if (parameters.expiration) {
      handleExpirationChange();
    }
  }, [parameters.expiration]);

  // Automatically fetch risk-free rate when timeToExpiration is valid
  useEffect(() => {
    if (timeToExpiration > 0) {
      fetchRiskFreeRateData();
    }
  }, [timeToExpiration]); // Runs when timeToExpiration changes

  return (
    <motion.div
      className="my-8 bg-white p-6 rounded-xl shadow-sm border border-indigo-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 flex items-center justify-center text-white font-bold mr-3 shadow-md">
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
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-teal-800">
          Option Parameters
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4 ml-11">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <label className="block mb-1 font-medium text-teal-800">
            Option Type
          </label>
          <div className="flex space-x-4">
            {[
              {
                name: "Call",
                value: "call",
                color: "from-teal-600 to-emerald-500",
              },
              { name: "Put", value: "put", color: "from-red-600 to-red-500" },
            ].map((option) => (
              <motion.label
                key={option.value}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-3
        ${
          parameters.option_type === option.value
            ? `bg-gradient-to-r ${option.color} text-white shadow-md`
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
        }
      `}
              >
                {/* Hidden Radio Input */}
                <input
                  type="radio"
                  name="option_type"
                  value={option.value}
                  checked={parameters.option_type === option.value}
                  onChange={() =>
                    setParameters((prev) => ({
                      ...prev,
                      option_type: option.value,
                    }))
                  }
                  className="hidden"
                />

                {/* Label Text */}
                <span className="font-medium text-base">{option.name}</span>

                {/* Checkmark when selected */}
                {parameters.option_type === option.value && (
                  <motion.svg
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="w-5 h-5 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                )}
              </motion.label>
            ))}
          </div>
        </motion.div>
        {[
          { label: "Underlying Price ($)", key: "underlyingPrice", step: "1" },
          { label: "Strike Price ($)", key: "strikePrice", step: "1" },
          {
            label: "Volatility (%)",
            key: "volatility",
            step: "0.5",
            isPercentage: true,
          },
        ].map(({ label, key, step, isPercentage }, index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <label className="block mb-1 font-medium text-teal-800">
              {label}
            </label>
            <input
              type="number"
              step={step}
              value={
                isPercentage
                  ? (parameters[key] * 100).toFixed(2)
                  : parameters[key].toFixed(2)
              }
              onChange={(e) =>
                setParameters((prev) => ({
                  ...prev,
                  [key]: isPercentage
                    ? parseFloat(e.target.value) / 100
                    : parseFloat(e.target.value) || 0,
                }))
              }
              className="w-full border border-indigo-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all duration-200"
            />
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <label className="block mb-1 font-medium text-teal-800">
            Expiration Date
          </label>
          <input
            type="date"
            value={
              parameters.expiration
                ? new Date(parameters.expiration).toISOString().split("T")[0]
                : ""
            }
            min={
              new Date(new Date().setDate(new Date().getDate() + 1))
                .toISOString()
                .split("T")[0]
            }
            onChange={(e) =>
              setParameters((prev) => ({
                ...prev,
                expiration: new Date(e.target.value), // Convert back to Date object
              }))
            }
            className="w-full border border-indigo-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all duration-200"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <label className="block mb-1 font-medium text-teal-800">
            Time to Expiration (Years)
          </label>
          <input
            type="text"
            value={timeToExpiration}
            readOnly
            className="w-full border border-indigo-200 bg-gray-50 rounded-lg px-3 py-2 focus:outline-none text-gray-700"
          />
        </motion.div>

        {/* Risk-Free Rate Input with Fetch Button */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <label className="block mb-1 font-medium text-teal-800">
            Risk-Free Rate (%)
          </label>
          <div className="flex">
            <input
              type="number"
              step="0.5"
              value={parameters.riskFreeRate.toFixed(2)}
              onChange={(e) =>
                setParameters((prev) => ({
                  ...prev,
                  riskFreeRate: parseFloat(e.target.value) || 0,
                }))
              }
              className="w-full border border-indigo-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all duration-200"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchRiskFreeRateData}
              className={`ml-2 px-3 py-2 bg-gradient-to-r from-teal-600 to-emerald-500 text-white rounded-lg shadow hover:shadow-lg transition-all duration-200 font-medium flex items-center gap-2 ${
                isFetchingRate ? "opacity-75" : ""
              }`}
            >
              {isFetchingRate ? (
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
                  Fetch
                </>
              )}
            </motion.button>
          </div>
          {fetchError && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-right text-red-500 font-semibold mt-1 flex items-center justify-end"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
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
              {fetchError}
            </motion.div>
          )}
          <p className="text-sm text-emerald-700 mt-1 ml-1">
            {rateType !== "N/A" ? `Using ${rateType}` : ""}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ParametersInput;
