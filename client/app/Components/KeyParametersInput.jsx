import React from "react";

const KeyParametersInput = ({ parameters, setParameters, fetchMarketData }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3 text-teal-800">
        Step 4: Input Key Parameters
      </h2>
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">Symbol</label>
        <input
          type="text"
          value={parameters.symbol}
          onChange={(e) =>
            setParameters({ ...parameters, symbol: e.target.value })
          }
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
        />
        <button
          onClick={fetchMarketData}
          className="mt-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
        >
          Auto-Fill from Market
        </button>
      </div>
    </div>
  );
};

export default KeyParametersInput;
