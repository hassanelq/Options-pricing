import React from "react";
import { motion } from "framer-motion";

const PricingResult = ({ priceResult }) => {
  if (!priceResult) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 bg-gradient-to-br from-teal-100 to-emerald-100 p-6 rounded-xl shadow-lg border border-teal-300"
    >
      {/* Price Display */}
      <div className="text-center mb-6">
        <h4 className="text-lg font-medium text-gray-700">Option Price</h4>
        <span className="text-4xl font-bold text-teal-900">
          {priceResult.price?.toFixed(2)} $
        </span>
      </div>

      {/* Other Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-md">
        {Object.entries(priceResult).map(([key, value]) => {
          if (key === "price") return null; // Skip price as it's displayed separately

          return (
            <div
              key={key}
              className="flex justify-between border-b pb-2 last:border-none"
            >
              <span className="text-gray-600 capitalize">
                {key.replace(/_/g, " ")}:
              </span>
              <span className="text-teal-800 font-semibold">
                {typeof value === "number" ? value.toFixed(4) : value}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PricingResult;
