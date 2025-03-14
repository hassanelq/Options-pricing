"use client";

import React, { useState, useEffect } from "react";
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

  // Fetch tickers based on the selected asset type
  const getTickersByAssetType = () => {
    if (!selectedAssetType || !CATEGORY_MAP[selectedAssetType]) return [];
    return rawData[CATEGORY_MAP[selectedAssetType]].map((item) => ({
      Ticker: item.ticker,
      Name: item.name,
    }));
  };

  const [availableTickers, setAvailableTickers] = useState(
    getTickersByAssetType()
  );

  // Update tickers when asset type changes
  useEffect(() => {
    setAvailableTickers(getTickersByAssetType());
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
    <div className="relative">
      <label className="block font-medium">Search Symbol...</label>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        className="border p-2 rounded w-full"
        placeholder={`Search ${selectedAssetType || "Asset"}...`}
      />

      {filteredTickers.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-md mt-1 max-h-52 overflow-auto">
          {filteredTickers.map((item, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
              onClick={() => handleSelect(item)}
            >
              <div>
                <span className="font-bold">{item.Ticker}</span> - {item.Name}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TickerSearch;
