import { useEffect, useState } from "react";
import { fetchRiskFreeRate } from "../api/riskFreeRate";

const ParametersInput = ({ parameters, setParameters }) => {
  const [timeToExpiration, setTimeToExpiration] = useState(0);
  const [isFetchingRate, setIsFetchingRate] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [rateType, setRateType] = useState("N/A");

  // Function to determine the correct Treasury rate
  const getRateType = (years) => {
    const numYears = parseFloat(years); // Ensure it's a number

    if (isNaN(numYears) || numYears < 0) return "Invalid Expiration Date";
    if (numYears < 1) return "3-month T-Bill";
    if (numYears < 5) return "5-year Treasury Note";
    return "10-year Treasury Note";
  };

  // Function to handle expiration date change
  const handleExpirationChange = () => {
    const selectedDate = new Date(parameters.expiration);
    const today = new Date();

    if (isNaN(selectedDate.getTime())) {
      return; // Prevent errors if no valid date is selected
    }

    const yearsRemaining =
      (selectedDate - today) / (1000 * 60 * 60 * 24 * 365.25); // Adjusted for leap years

    setTimeToExpiration(yearsRemaining.toFixed(2));
  };

  const fetchRiskFreeRateData = async () => {
    try {
      setIsFetchingRate(true);
      const latestRate = await fetchRiskFreeRate(timeToExpiration);
      setParameters((prev) => ({ ...prev, riskFreeRate: latestRate }));
      setRateType(getRateType(parseFloat(timeToExpiration))); // Ensure it's a number
    } catch (error) {
      setFetchError(error.message);
    } finally {
      setIsFetchingRate(false);
    }
  };

  // Automatically run handleExpirationChange if expiration date changes
  useEffect(() => {
    if (parameters.expiration) {
      handleExpirationChange();
    }
  }, [parameters.expiration]);
  return (
    <div className="grid md:grid-cols-2 gap-4 mt-8">
      {[
        { label: "Underlying Price ($)", key: "underlyingPrice", step: "1" },
        { label: "Strike Price ($)", key: "strikePrice", step: "1" },
        {
          label: "Volatility (%)",
          key: "volatility",
          step: "0.5",
          isPercentage: true,
        },
      ].map(({ label, key, step, isPercentage }) => (
        <div key={key}>
          <label className="block mb-1 font-medium text-gray-700">
            {label}
          </label>
          <input
            type="number"
            step={step}
            value={
              isPercentage
                ? (parameters[key] * 100).toFixed(2)
                : parameters[key].toFixed(2)
            }
            onChange={(e) =>
              setParameters((prev) => ({
                ...prev,
                [key]: isPercentage
                  ? parseFloat(e.target.value) / 100
                  : parseFloat(e.target.value) || 0,
              }))
            }
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
          />
        </div>
      ))}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Expiration Date
        </label>
        <input
          type="date"
          value={parameters.expiration}
          // Sets the minimum date to tomorrow
          min={
            new Date(new Date().setDate(new Date().getDate() + 1))
              .toISOString()
              .split("T")[0]
          }
          onChange={(e) =>
            setParameters((prev) => ({ ...prev, expiration: e.target.value }))
          }
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Time to Expiration (Years)
        </label>
        <input
          type="text"
          value={timeToExpiration}
          readOnly
          className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 focus:outline-none"
        />
      </div>

      {/* Risk-Free Rate Input with Fetch Button */}
      <div className="relative">
        <label className="block mb-1 font-medium text-gray-700">
          Risk-Free Rate (%)
        </label>
        <div className="flex">
          <input
            type="number"
            step="0.5"
            value={parameters.riskFreeRate.toFixed(2)}
            onChange={(e) =>
              setParameters((prev) => ({
                ...prev,
                riskFreeRate: parseFloat(e.target.value) || 0,
              }))
            }
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
          />
          <button
            onClick={fetchRiskFreeRateData}
            className="ml-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Fetch
          </button>
        </div>
        {isFetchingRate && (
          <div className="text-right text-teal-600 font-semibold mt-1">
            Fetching risk-free rate...
          </div>
        )}
        {fetchError && (
          <div className="text-right text-red-500 font-semibold mt-1">
            {fetchError}
          </div>
        )}
        <p className="text-sm text-gray-500 mt-1">
          {rateType !== "N/A" ? `Using ${rateType}` : ""}
        </p>
      </div>
    </div>
  );
};

export default ParametersInput;
