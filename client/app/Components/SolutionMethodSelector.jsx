import React from "react";
import { PRICING_CONFIG } from "../config";

const SolutionMethodSelector = ({
  selectedSolution,
  setSelectedSolution,
  approach,
}) => {
  const approachData = PRICING_CONFIG["European"].find(
    (a) => a.value === approach
  );

  return (
    <div className="my-6">
      <h2 className="text-xl font-semibold mb-3 text-teal-800">
        Step 5: Solution Method
      </h2>
      <div className="flex flex-wrap gap-4">
        {approachData?.solutions.map((method) => (
          <label
            key={method}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              name="solutionMethod"
              value={method}
              checked={selectedSolution === method}
              onChange={(e) => setSelectedSolution(e.target.value)}
            />
            {method}
          </label>
        ))}
      </div>
    </div>
  );
};

export default SolutionMethodSelector;
