import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";

const OptionPayoffGraphs = ({ parameters, priceResult }) => {
  const [graphData, setGraphData] = useState([]);
  const [range, setRange] = useState({ min: 0, max: 0 });

  useEffect(() => {
    if (!parameters) return;

    // Extract needed parameters
    const {
      option_type,
      underlyingPrice,
      strikePrice,
      volatility,
      market_price,
    } = parameters;

    // Use actual premium if available, otherwise estimate it
    const premium =
      market_price ||
      priceResult ||
      (option_type === "call"
        ? Math.max(2, underlyingPrice * volatility * 0.4)
        : Math.max(2, underlyingPrice * volatility * 0.4));

    // Set price range to display on graph (50% below and 50% above the underlying price)
    const priceDelta = underlyingPrice * 0.5;
    const minPrice = Math.max(1, underlyingPrice - priceDelta);
    const maxPrice = underlyingPrice + priceDelta;

    // Generate data points - reduced number of steps for cleaner x-axis
    const data = [];
    const steps = 20; // Reduced from 40 to show fewer x-axis points
    const stepSize = (maxPrice - minPrice) / steps;

    for (let i = 0; i <= steps; i++) {
      const spotPrice = minPrice + stepSize * i;

      // Calculate payoffs
      let longPayoff, shortPayoff;

      if (option_type === "call") {
        longPayoff = Math.max(0, spotPrice - strikePrice);
        shortPayoff = -longPayoff;
      } else {
        // put
        longPayoff = Math.max(0, strikePrice - spotPrice);
        shortPayoff = -longPayoff;
      }

      // Calculate profits (payoff - premium)
      const longProfit = longPayoff - premium;
      const shortProfit = shortPayoff + premium;

      data.push({
        spotPrice: Number(spotPrice.toFixed(2)),
        longPayoff: Number(longPayoff.toFixed(2)),
        longProfit: Number(longProfit.toFixed(2)),
        shortPayoff: Number(shortPayoff.toFixed(2)),
        shortProfit: Number(shortProfit.toFixed(2)),
        premium: Number(premium.toFixed(2)),
      });
    }

    setGraphData(data);
    setRange({ min: minPrice, max: maxPrice });
  }, [parameters]);

  if (!parameters || graphData.length === 0) {
    return <div className="p-4 text-center">Loading graph data...</div>;
  }

  // Custom formatter for tooltip and axis values
  const numberFormatter = (value) => Number(value).toFixed(2);

  // Format the option type for display
  const formatOptionType = (type) =>
    type.charAt(0).toUpperCase() + type.slice(1);

  // Calculate a reasonable tick count based on range
  const calculateTickCount = () => {
    const range = Math.abs(parameters.underlyingPrice * 0.5);
    return Math.min(10, Math.max(5, Math.floor(range / 20)));
  };

  return (
    <div className="flex flex-col w-full">
      <h3 className="text-2xl font-bold text-slate-800 py-6">
        {formatOptionType(parameters.option_type)} Option Payoff & Profit
        Diagrams
      </h3>

      {/* Long Position Graph - Increased height from 300 to 400 */}
      <div className="mb-10 bg-white p-6 rounded-lg shadow-md">
        <h4 className="text-lg font-semibold mb-4 text-blue-600">
          Long {formatOptionType(parameters.option_type)}
        </h4>
        <ComposedChart
          width={800}
          height={400}
          data={graphData}
          margin={{ top: 20, right: 40, left: 40, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="spotPrice"
            tickFormatter={numberFormatter}
            label={{
              value: "Spot Price",
              position: "insideBottom",
              offset: -20,
            }}
            domain={[range.min, range.max]}
            tickCount={calculateTickCount()}
          />
          <YAxis
            tickFormatter={numberFormatter}
            label={{
              value: "Profit/Loss",
              angle: -90,
              position: "insideLeft",
              offset: -20,
            }}
          />
          <Tooltip
            formatter={(value) => [`$${numberFormatter(value)}`, "Value"]}
            labelFormatter={(value) => `Spot Price: $${value}`}
          />
          <Legend verticalAlign="top" height={50} />
          <ReferenceLine y={0} stroke="#000" strokeWidth={1} />
          <ReferenceLine
            x={parameters.strikePrice}
            stroke="#0088FE"
            strokeDasharray="3 3"
            label={{
              value: `Strike: $${numberFormatter(parameters.strikePrice)}`,
              position: "top",
              fill: "#0088FE",
              fontSize: 12,
            }}
          />
          <ReferenceLine
            x={parameters.underlyingPrice}
            stroke="#00C49F"
            strokeDasharray="3 3"
            label={{
              value: `Spot: $${numberFormatter(parameters.underlyingPrice)}`,
              position: "insideTopRight",
              fill: "#00C49F",
              fontSize: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="longPayoff"
            stroke="#0088FE"
            name="Payoff"
            dot={false}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="longProfit"
            stroke="#00C49F"
            name="Profit"
            dot={false}
            strokeWidth={2}
          />
          <ReferenceLine
            y={-graphData[0].premium}
            stroke="#8884d8"
            strokeDasharray="3 3"
            label={{
              value: `Premium: $${numberFormatter(graphData[0].premium)}`,
              position: "insideLeft",
              fontSize: 12,
            }}
          />

          {/* Profit & Loss Areas */}
          <Area
            type="monotone"
            dataKey="longProfit"
            fill="#00C49F"
            stroke="none"
            fillOpacity={0.3}
            activeDot={false}
          />
        </ComposedChart>
      </div>

      {/* Short Position Graph - Increased height from 300 to 400 */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
        <h4 className="text-lg font-semibold mb-4 text-red-600">
          Short {formatOptionType(parameters.option_type)}
        </h4>
        <ComposedChart
          width={800}
          height={400}
          data={graphData}
          margin={{ top: 20, right: 40, left: 40, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="spotPrice"
            tickFormatter={numberFormatter}
            label={{
              value: "Spot Price",
              position: "insideBottom",
              offset: -20,
            }}
            domain={[range.min, range.max]}
            tickCount={calculateTickCount()}
          />
          <YAxis
            tickFormatter={numberFormatter}
            label={{
              value: "Profit/Loss",
              angle: -90,
              position: "insideLeft",
              offset: -20,
            }}
          />
          <Tooltip
            formatter={(value) => [`$${numberFormatter(value)}`, "Value"]}
            labelFormatter={(value) => `Spot Price: $${value}`}
          />
          <Legend verticalAlign="top" height={36} />
          <ReferenceLine y={0} stroke="#000" strokeWidth={1} />
          <ReferenceLine
            x={parameters.strikePrice}
            stroke="#FF8042"
            strokeDasharray="3 3"
            label={{
              value: `Strike: $${numberFormatter(parameters.strikePrice)}`,
              position: "top",
              fill: "#FF8042",
              fontSize: 12,
            }}
          />
          <ReferenceLine
            x={parameters.underlyingPrice}
            stroke="#FF8042"
            strokeDasharray="3 3"
            label={{
              value: `Spot: $${numberFormatter(parameters.underlyingPrice)}`,
              position: "insideBottomRight",
              fill: "#FF8042",
              fontSize: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="shortPayoff"
            stroke="#FF8042"
            name="Payoff"
            dot={false}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="shortProfit"
            stroke="#FF0000"
            name="Profit"
            dot={false}
            strokeWidth={2}
          />
          <ReferenceLine
            y={graphData[0].premium}
            stroke="#8884d8"
            strokeDasharray="3 3"
            label={{
              value: `Premium: $${numberFormatter(graphData[0].premium)}`,
              position: "insideRight",
              fontSize: 12,
            }}
          />

          {/* Profit & Loss Areas */}
          <Area
            type="monotone"
            dataKey="shortProfit"
            fill="#FF0000"
            stroke="none"
            fillOpacity={0.3}
            activeDot={false}
          />
        </ComposedChart>
      </div>

      <div className="mt-4 px-6 py-4 bg-gray-100 rounded-lg">
        <h5 className="font-medium text-base mb-2">Parameters:</h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-base">
          <div className="font-medium">
            Underlying:{" "}
            <span className="font-bold">
              ${numberFormatter(parameters.underlyingPrice)}
            </span>
          </div>
          <div className="font-medium">
            Strike:{" "}
            <span className="font-bold">
              ${numberFormatter(parameters.strikePrice)}
            </span>
          </div>
          <div className="font-medium">
            Volatility:{" "}
            <span className="font-bold">
              {(parameters.volatility * 100).toFixed(1)}%
            </span>
          </div>
          <div className="font-medium">
            Premium:{" "}
            <span className="font-bold">
              ${numberFormatter(graphData[0].premium)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionPayoffGraphs;
