import React from "react";
import { ASSET_TYPES_MAP } from "../config";

const AssetTypeSelector = ({
  selectedAssetType,
  setSelectedAssetType,
  approach,
}) => {
  const possibleAssetTypes = ASSET_TYPES_MAP[approach] || [];

  return (
    possibleAssetTypes.length > 0 && (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3 text-teal-800">
          Step 3: Choose Asset Type
        </h2>
        <div className="flex flex-wrap gap-4">
          {possibleAssetTypes.map((asset) => (
            <label
              key={asset}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="assetType"
                value={asset}
                checked={selectedAssetType === asset}
                onChange={(e) => setSelectedAssetType(e.target.value)}
              />
              {asset}
            </label>
          ))}
        </div>
      </div>
    )
  );
};

export default AssetTypeSelector;
