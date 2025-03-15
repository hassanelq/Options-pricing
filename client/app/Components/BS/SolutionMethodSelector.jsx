import React from "react";
import { motion } from "framer-motion";
import { PRICING_CONFIG } from "../../config";

const SolutionMethodSelector = ({
  selectedSolution,
  setSelectedSolution,
  approach,
  parameters,
  setParameters,
}) => {
  const approachData = PRICING_CONFIG["European"].find(
    (a) => a.value === approach
  );

  // Get current solution type from selected solution name
  const solutionType = approachData?.solutions.find(
    (s) => s.name === selectedSolution
  )?.value;
  const renderAdditionalParams = () => {
    const inputStyle =
      "w-full px-3 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all duration-200";
    const labelStyle = "block mb-1 font-medium text-teal-800";

    // Monte Carlo Parameters
    if (approach === "blackScholes" && selectedSolution === "monteCarlo") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-8 space-y-4 p-4 bg-indigo-50 rounded-xl"
        >
          <h3 className="text-lg font-semibold text-teal-800">
            Simulation Settings
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className={labelStyle}>Number of Simulations</label>
              <input
                type="number"
                value={parameters.monte_carlo_simulations || 10000}
                onChange={(e) =>
                  setParameters({
                    ...parameters,
                    monte_carlo_simulations: parseInt(e.target.value),
                  })
                }
                className={inputStyle}
                min="1000"
                step="1000"
              />
            </div>
          </div>
        </motion.div>
      );
    }

    // Heston Model Parameters
    if (approach === "heston") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-8 space-y-4 p-4 bg-indigo-50 rounded-xl"
        >
          <h3 className="text-lg font-semibold text-teal-800">
            Heston Model Parameters
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Mean Reversion (κ)", key: "kappa", step: 0.1 },
              { label: "Long-term Variance (θ)", key: "theta", step: 0.01 },
              { label: "Vol of Vol (ξ)", key: "xi", step: 0.1 },
              {
                label: "Correlation (ρ)",
                key: "rho",
                step: 0.1,
                min: -1,
                max: 1,
              },
              { label: "Initial Variance (v₀)", key: "v0", step: 0.01 },
            ].map((param, index) => (
              <motion.div
                key={param.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <label className={labelStyle}>{param.label}</label>
                <input
                  type="number"
                  value={parameters[param.key] || ""}
                  onChange={(e) =>
                    setParameters({
                      ...parameters,
                      [param.key]: parseFloat(e.target.value),
                    })
                  }
                  className={inputStyle}
                  step={param.step}
                  min={param.min}
                  max={param.max}
                />
              </motion.div>
            ))}
            {selectedSolution === "monteCarlo" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className={labelStyle}>Simulations</label>
                <input
                  type="number"
                  value={parameters.monte_carlo_simulations || 10000}
                  onChange={(e) =>
                    setParameters({
                      ...parameters,
                      monte_carlo_simulations: parseInt(e.target.value),
                    })
                  }
                  className={inputStyle}
                  min="1000"
                  step="1000"
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      );
    }

    // OU Model Parameters
    if (approach === "ou") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-8 space-y-4 p-4 bg-indigo-50 rounded-xl"
        >
          <h3 className="text-lg font-semibold text-teal-800">
            OU Process Parameters
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Mean Reversion (κ)", key: "kappa_ou", step: 0.1 },
              { label: "Long-term Mean (θ)", key: "theta_ou", step: 0.1 },
              { label: "Volatility (ξ)", key: "xi_ou", step: 0.1 },
            ].map((param, index) => (
              <motion.div
                key={param.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <label className={labelStyle}>{param.label}</label>
                <input
                  type="number"
                  value={parameters[param.key] || ""}
                  onChange={(e) =>
                    setParameters({
                      ...parameters,
                      [param.key]: parseFloat(e.target.value),
                    })
                  }
                  className={inputStyle}
                  step={param.step}
                />
              </motion.div>
            ))}
            {selectedSolution === "monteCarlo" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className={labelStyle}>Simulations</label>
                <input
                  type="number"
                  value={parameters.monte_carlo_simulations || 10000}
                  onChange={(e) =>
                    setParameters({
                      ...parameters,
                      monte_carlo_simulations: parseInt(e.target.value),
                    })
                  }
                  className={inputStyle}
                  min="1000"
                  step="1000"
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      );
    }

    return null;
  };

  return (
    <motion.div
      className="my-8 bg-white p-6 rounded-xl shadow-sm border border-indigo-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold mr-3 shadow-md">
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-teal-800">
          Choose Solution Method
        </h2>
      </div>

      <div className="flex flex-wrap gap-3 ml-11">
        {approachData?.solutions.map((method, index) => (
          <motion.div
            key={method.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
          >
            <motion.label
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-5 py-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-3
                ${
                  selectedSolution === method.value
                    ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                }
              `}
            >
              <input
                type="radio"
                name="solutionMethod"
                value={method.value}
                checked={selectedSolution === method.value}
                onChange={(e) => setSelectedSolution(e.target.value)}
                className="hidden"
              />
              <div className="flex flex-col">
                <span className="font-medium text-base">{method.name}</span>
                <span className="text-xs font-light">{method.desc}</span>
              </div>
              {selectedSolution === method.name && (
                <motion.svg
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="w-5 h-5 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              )}
            </motion.label>
          </motion.div>
        ))}
      </div>
      {/* Additional parameters section */}
      {renderAdditionalParams()}
    </motion.div>
  );
};

export default SolutionMethodSelector;
