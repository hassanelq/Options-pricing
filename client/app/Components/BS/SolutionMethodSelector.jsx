import React from "react";
import { motion } from "framer-motion";
import { PRICING_CONFIG } from "../../config";

const SolutionMethodSelector = ({
  selectedSolution,
  setSelectedSolution,
  approach,
}) => {
  const approachData = PRICING_CONFIG["European"].find(
    (a) => a.value === approach
  );

  return (
    <motion.div
      className="my-8 bg-white p-6 rounded-xl shadow-sm border border-indigo-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold mr-3 shadow-md">
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-teal-800">
          Choose Solution Method
        </h2>
      </div>

      <div className="flex flex-wrap gap-3 ml-11">
        {approachData?.solutions.map((method, index) => (
          <motion.div
            key={method}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
          >
            <motion.label
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-5 py-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-3
                ${
                  selectedSolution === method
                    ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                }
              `}
            >
              <input
                type="radio"
                name="solutionMethod"
                value={method}
                checked={selectedSolution === method}
                onChange={(e) => setSelectedSolution(e.target.value)}
                className="hidden"
              />

              <span className="font-medium">{method}</span>

              {selectedSolution === method && (
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
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SolutionMethodSelector;
