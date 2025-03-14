import React from "react";
import TickerSearch from "./BS/searchTicker";

const KeyParametersInput = ({
  selectedAssetType,
  parameters,
  setParameters,
  fetchMarketData,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3 text-teal-800">
        Step 4: Input Key Parameters
      </h2>
      <div className="mb-4">
        <TickerSearch
          onSelect={(selectedTicker) =>
            setParameters({ ...parameters, symbol: selectedTicker })
          }
          selectedAssetType={selectedAssetType}
        />
        <button
          onClick={fetchMarketData}
          className="mt-2 px-3 py-1.5 bg-cyan-600 text-white rounded hover:bg-cyan-700"
        >
          Fetch Options Data
        </button>
      </div>
    </div>
  );
};

export default KeyParametersInput;
