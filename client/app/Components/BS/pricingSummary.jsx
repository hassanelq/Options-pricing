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
      <h3 className="text-lg font-semibold text-teal-800 mb-3">
        Pricing Configuration Summary
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                : selectedApproach === "binomialTree"
                ? "Binomial Tree"
                : selectedApproach === "monteCarlo"
                ? "Monte Carlo"
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
            {parameters.v0 && (
              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-gray-700">Initial Variance (v₀):</span>
                <span className="text-teal-700">
                  {parameters.v0.toFixed(4)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Show OU parameters if they exist */}
        {selectedApproach === "ou" && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-teal-800 mb-2">
              OU Process Parameters
            </h4>
            {parameters.kappa_ou && (
              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-gray-700">Mean Reversion (κ):</span>
                <span className="text-teal-700">
                  {parameters.kappa_ou.toFixed(2)}
                </span>
              </div>
            )}
            {parameters.theta_ou && (
              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-gray-700">Long-term Mean (θ):</span>
                <span className="text-teal-700">
                  {parameters.theta_ou.toFixed(2)}
                </span>
              </div>
            )}
            {parameters.xi_ou && (
              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-gray-700">Volatility (ξ):</span>
                <span className="text-teal-700">
                  {parameters.xi_ou.toFixed(3)}
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
