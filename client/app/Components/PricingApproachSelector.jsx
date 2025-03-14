import React from "react";
import { motion } from "framer-motion";
import { PRICING_CONFIG } from "../config";

const PricingApproachSelector = ({ selectedApproach, setSelectedApproach }) => {
  const availableApproaches = PRICING_CONFIG["European"] || [];

  return (
    <motion.div
      className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-indigo-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 flex items-center justify-center text-white font-bold mr-3 shadow-md">
          2
        </div>
        <h2 className="text-xl font-semibold text-teal-800">
          Pricing Approach
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 ml-11">
        {availableApproaches.map((approach, index) => (
          <motion.label
            key={approach.value}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`
              px-4 py-3 rounded-lg cursor-pointer transition-all duration-200
              ${
                selectedApproach === approach.value
                  ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
              }
            `}
          >
            <div className="flex items-center">
              <input
                type="radio"
                name="pricingApproach"
                value={approach.value}
                checked={selectedApproach === approach.value}
                onChange={(e) => setSelectedApproach(e.target.value)}
                className="hidden"
              />

              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3
                ${
                  selectedApproach === approach.value
                    ? "border-white bg-white"
                    : "border-gray-400"
                }
              `}
              >
                {selectedApproach === approach.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-3 h-3 rounded-full bg-emerald-600"
                  />
                )}
              </div>

              <div>
                <div className="font-medium">{approach.label}</div>
                {approach.description && (
                  <div className="text-xs mt-1 opacity-80">
                    {approach.description}
                  </div>
                )}
              </div>
            </div>
          </motion.label>
        ))}
      </div>
    </motion.div>
  );
};

export default PricingApproachSelector;
