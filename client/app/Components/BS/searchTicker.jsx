"use client";

import React, { useState } from "react";
import tickerData from "../../../public/data/tickers.json";

const TickerSearch = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTickers, setFilteredTickers] = useState([]);

  const handleSearch = (e) => {
    const query = e.target.value.toUpperCase();
    setSearchTerm(query);

    if (query.length > 0) {
      setFilteredTickers(
        tickerData.filter(
          (item) =>
            item.Ticker.startsWith(query) ||
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
    onSelect(ticker.Ticker, ticker.OptionStyle);
  };

  return (
    <div className="relative">
      <label className="block font-medium">Search Stock/ETF/Index</label>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        className="border p-2 rounded w-full"
        placeholder="Type ticker or name..."
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
              <span className="text-sm text-gray-500">{item.OptionStyle}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TickerSearch;
