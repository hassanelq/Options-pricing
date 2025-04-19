import React from "react";

const PricingSummary = ({
  selectedStyle,
  selectedApproach,
  selectedAssetType,
  selectedSolution,
  parameters,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-indigo-100 shadow-sm mt-8 mb-4">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 flex items-center justify-center text-white font-bold mr-3 shadow-md">
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
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-teal-800">Pricing Summary</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:ml-11">
        <div className="space-y-2">
          <div className="flex justify-between border-b border-gray-200 pb-1">
            <span className="font-medium text-gray-700">Option Style:</span>
            <span className="text-teal-700">{selectedStyle}</span>
          </div>

          <div className="flex justify-between border-b border-gray-200 pb-1">
            <span className="font-medium text-gray-700">Pricing Model:</span>
            <span className="text-teal-700">
              {selectedApproach === "blackScholes"
                ? "Black-Scholes"
                : selectedApproach === "heston"
                ? "Heston"
                : selectedApproach}
            </span>
          </div>

          <div className="flex justify-between border-b border-gray-200 pb-1">
            <span className="font-medium text-gray-700">Asset Type:</span>
            <span className="text-teal-700">{selectedAssetType}</span>
          </div>

          <div className="flex justify-between border-b border-gray-200 pb-1">
            <span className="font-medium text-gray-700">Solution Method:</span>
            <span className="text-teal-700">{selectedSolution}</span>
          </div>

          <div className="flex justify-between border-b border-gray-200 pb-1">
            <span className="font-medium text-gray-700">Symbol:</span>
            <span className="text-teal-700">{parameters.symbol || "N/A"}</span>
          </div>

          <div className="flex justify-between border-b border-gray-200 pb-1">
            <span className="font-medium text-gray-700">Option Type:</span>
            <span className="text-teal-700">
              {parameters.option_type === "call" ? "Call" : "Put"}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {/*  */}

          <div className="flex justify-between border-b border-gray-200 pb-1">
            <span className="font-medium text-gray-700">Underlying Price:</span>
            <span className="text-teal-700">
              ${parameters.underlyingPrice?.toFixed(2) || "N/A"}
            </span>
          </div>

          <div className="flex justify-between border-b border-gray-200 pb-1">
            <span className="font-medium text-gray-700">Strike Price:</span>
            <span className="text-teal-700">
              ${parameters.strikePrice?.toFixed(2) || "N/A"}
            </span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-1">
            <span className="font-medium text-gray-700">
              Time to Expiration:
            </span>
            <span className="text-teal-700">
              {parameters.yearsToExpiration}
            </span>
          </div>

          <div className="flex justify-between border-b border-gray-200 pb-1">
            <span className="font-medium text-gray-700">Risk-Free Rate:</span>
            <span className="text-teal-700">{parameters.riskFreeRate}%</span>
          </div>

          <div className="flex justify-between border-b border-gray-200 pb-1">
            <span className="font-medium text-gray-700">Volatility:</span>
            <span className="text-teal-700">
              {(parameters.volatility * 100).toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-1">
            <span className="font-medium text-gray-700">Market Price:</span>
            <span className="text-teal-700">
              ${parameters.market_price?.toFixed(2) || "N/A"}
            </span>
          </div>
        </div>
        {/* Show Heston parameters if they exist */}
        {selectedApproach === "heston" && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-teal-800 mb-2">
              Heston Parameters
            </h4>
            {parameters.kappa && (
              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-gray-700">Mean Reversion (κ):</span>
                <span className="text-teal-700">
                  {parameters.kappa.toFixed(2)}
                </span>
              </div>
            )}
            {parameters.theta && (
              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-gray-700">Long-term Variance (θ):</span>
                <span className="text-teal-700">
                  {parameters.theta.toFixed(4)}
                </span>
              </div>
            )}
            {parameters.xi && (
              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-gray-700">Vol of Vol (ξ):</span>
                <span className="text-teal-700">
                  {parameters.xi.toFixed(3)}
                </span>
              </div>
            )}
            {parameters.rho && (
              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-gray-700">Correlation (ρ):</span>
                <span className="text-teal-700">
                  {parameters.rho.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Show Monte Carlo simulations if exists */}
        {selectedSolution === "monteCarlo" &&
          parameters.monte_carlo_simulations && (
            <div className="flex justify-between border-b border-gray-200 pb-1">
              <span className="font-medium text-gray-700">Simulations:</span>
              <span className="text-teal-700">
                {parameters.monte_carlo_simulations.toLocaleString()}
              </span>
            </div>
          )}
      </div>
    </div>
  );
};

export default PricingSummary;
