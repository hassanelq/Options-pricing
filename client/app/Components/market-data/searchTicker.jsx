"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import rawData from "../../../public/data/tickers.json";

// Map category names to JSON data keys
const CATEGORY_MAP = {
  Stocks: "StockOptions",
  Indices: "Indices",
  ETFs: "ETFs",
  "Interest Rates": "InterestRates",
  Commodities: "Commodities",
  "Energy Prices": "EnergyPrices",
  FX: "FX",
};

const TickerSearch = ({ onSelect, selectedAssetType }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTickers, setFilteredTickers] = useState([]);
  const [availableTickers, setAvailableTickers] = useState([]);

  // Fetch tickers based on the selected asset type
  const getTickersByAssetType = () => {
    if (!selectedAssetType || !CATEGORY_MAP[selectedAssetType]) return [];
    return (
      rawData[CATEGORY_MAP[selectedAssetType]]?.map((item) => ({
        Ticker: item.ticker,
        Name: item.name,
      })) || []
    );
  };

  // Update tickers when asset type changes
  useEffect(() => {
    const tickers = getTickersByAssetType();
    setAvailableTickers(tickers);
    setFilteredTickers([]); // Reset suggestions when asset type changes
    setSearchTerm(""); // Clear search input when changing asset type
  }, [selectedAssetType]);

  const handleSearch = (e) => {
    const query = e.target.value.toUpperCase();
    setSearchTerm(query);

    if (query.length > 0) {
      setFilteredTickers(
        availableTickers.filter(
          (item) =>
            item.Ticker.toUpperCase().startsWith(query) ||
            item.Name.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setFilteredTickers([]);
    }
  };

  const handleSelect = (ticker) => {
    setSearchTerm(ticker.Ticker);
    setFilteredTickers([]);
    onSelect(ticker.Ticker);
  };

  return (
    <motion.div
      className="relative my-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="block mb-2 font-medium text-teal-800">
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 flex items-center justify-center text-white font-bold mr-2 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          Search Symbol
        </div>
      </label>

      <motion.div
        className="relative"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => setFilteredTickers(availableTickers)}
          className="w-full border border-indigo-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all duration-200 shadow-sm"
          placeholder={
            availableTickers.length === 0
              ? "No available tickers"
              : `Search ${selectedAssetType || "Asset"}...`
          }
          disabled={availableTickers.length === 0} // Disable input if no tickers
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-700">
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </motion.div>

      {filteredTickers.length > 0 && (
        <motion.ul
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute z-10 w-full bg-white border border-indigo-100 rounded-lg shadow-lg mt-1 max-h-52 overflow-auto"
        >
          {filteredTickers.map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              whileHover={{ backgroundColor: "#EEF2FF" }}
              className="p-3 cursor-pointer flex justify-between items-center border-b last:border-b-0 border-indigo-50"
              onClick={() => handleSelect(item)}
            >
              <div>
                <span className="font-bold text-emerald-700">
                  {item.Ticker}
                </span>{" "}
                <span className="text-gray-600">- {item.Name}</span>
              </div>
              <motion.div
                whileHover={{ scale: 1.2 }}
                className="text-emerald-700"
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.div>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </motion.div>
  );
};

export default TickerSearch;
