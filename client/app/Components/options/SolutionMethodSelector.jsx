import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PRICING_CONFIG } from "../../config";

const SolutionMethodSelector = ({
  selectedStyle,
  selectedSolution,
  setSelectedSolution,
  approach,
  parameters,
  setParameters,
  handleCalibrateHeston,
  isCalibrating,
  calibrationStats,
}) => {
  const [localStats, setLocalStats] = useState(calibrationStats || null);

  useEffect(() => {
    if (calibrationStats) {
      setLocalStats(calibrationStats);
    }
  }, [calibrationStats]);

  const approachData = PRICING_CONFIG[selectedStyle].find(
    (a) => a.value === approach
  );

  useEffect(() => {
    if (
      selectedSolution === "monteCarlo" &&
      !parameters.monte_carlo_simulations
    ) {
      setParameters((prev) => ({
        ...prev,
        monte_carlo_simulations: 10000, // Default Monte Carlo simulations
      }));
    }

    if (approach === "heston") {
      setParameters((prev) => ({
        ...prev,
        kappa: prev.kappa ?? 1.5, // Default Mean Reversion Speed
        theta: prev.theta ?? 0.04, // Default Long-term Variance
        xi: prev.xi ?? 0.3, // Default Volatility of Volatility
        rho: prev.rho ?? -0.7, // Default Correlation
        v0: prev.v0 ?? 0.04, // Default Initial Variance
      }));
    }
  }, [selectedSolution, approach, setParameters]);

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
              { label: "Initial Variance (v0)", key: "v0", step: 0.01 },
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

          {/* Calibrate Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCalibrateHeston}
            disabled={isCalibrating}
            className={`px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-semibold rounded-lg shadow-md hover:from-teal-700 hover:to-emerald-700 transition-all flex items-center gap-2 ${
              isCalibrating ? "opacity-75" : ""
            }`}
          >
            {isCalibrating ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Calibrating...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Calibrate Parameters
              </>
            )}
          </motion.button>
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
      <div className="flex items-center mb-6">
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

      <div className="flex flex-wrap gap-3 md:ml-11 ">
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
      {localStats && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow border border-indigo-100 text-sm text-gray-800">
          <h4 className="text-base font-semibold text-teal-800 mb-2">
            Calibration Metrics
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <span className="font-medium">Optimization Method:</span>{" "}
              Sequential Least Squares Programming (SLSQP)
            </div>
            <div>
              <span className="font-medium">Constraints:</span> Bounded
              parameters + Feller condition for variance positivity
            </div>
            <div>
              <span className="font-medium">Objective:</span> Minimize the Mean
              Squared Error between market and model prices
            </div>
            <div>
              <span className="font-medium">Initial Parameters:</span> Based on
              average implied volatility
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-4">
            {localStats.optimization_time && (
              <div>
                <span className="font-medium">Optimization Time:</span>{" "}
                {localStats.optimization_time} ms
              </div>
            )}
            {localStats.optimization_time && (
              <div>
                <span className="font-medium">MSE:</span> {localStats.mse}
              </div>
            )}
            {localStats.optimization_time && (
              <div>
                <span className="font-medium">RMSE:</span> {localStats.rmse}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SolutionMethodSelector;
