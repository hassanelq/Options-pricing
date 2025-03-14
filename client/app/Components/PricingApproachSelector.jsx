import React from "react";
import { PRICING_CONFIG } from "../config";

const PricingApproachSelector = ({ selectedApproach, setSelectedApproach }) => {
  const availableApproaches = PRICING_CONFIG["European"] || [];

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3 text-teal-800">
        Step 2: Pricing Approach
      </h2>
      <div className="flex flex-wrap gap-4">
        {availableApproaches.map((approach) => (
          <label
            key={approach.value}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              name="pricingApproach"
              value={approach.value}
              checked={selectedApproach === approach.value}
              onChange={(e) => setSelectedApproach(e.target.value)}
            />
            {approach.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default PricingApproachSelector;
