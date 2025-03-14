import React from "react";
import { motion } from "framer-motion";

const OptionStyleSelector = ({ selectedStyle, setSelectedStyle }) => {
  const optionStyles = [
    { value: "European", label: "European" },
    // { value: "American", label: "American" },
    // { value: "Asian", label: "Asian" },
    // { value: "Barrier", label: "Barrier" }
  ];

  return (
    <motion.div
      className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-indigo-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 flex items-center justify-center text-white font-bold mr-3 shadow-md">
          1
        </div>
        <h2 className="text-xl font-semibold text-teal-800">
          Select Option Style
        </h2>
      </div>

      <div className="flex flex-wrap gap-3 ml-11">
        {optionStyles.map((style) => (
          <motion.label
            key={style.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-2
              ${
                selectedStyle === style.value
                  ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            <input
              type="radio"
              name="optionStyle"
              value={style.value}
              checked={selectedStyle === style.value}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="hidden"
            />
            {selectedStyle === style.value && (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-4 h-4 text-white"
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
            {style.label}
          </motion.label>
        ))}
      </div>
    </motion.div>
  );
};

export default OptionStyleSelector;
