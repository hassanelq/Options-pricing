import { processContinuousData } from "./helper_functions";

export default function simulateCauchy({ x0, gamma, N }) {
  // Parameter validation
  if (typeof gamma !== "number" || gamma <= 0) {
    throw new Error("Scale parameter γ must be a positive number");
  }
  if (typeof N !== "number" || N <= 0) {
    throw new Error("Number of simulations must be a positive integer");
  }

  const rawData = Array.from({ length: N }, () => {
    return x0 + gamma * Math.tan(Math.PI * (Math.random() - 0.5));
  }).filter((value) => Math.abs(value) < 1e6);

  const result = processContinuousData(
    rawData,
    `Cauchy (x₀=${x0}, γ=${gamma})`
  );

  // Cauchy-specific statistics
  result.statistics = {
    ...result.statistics,
    "Location Parameter (x₀)": x0.toFixed(4),
    "Scale Parameter (γ)": gamma.toFixed(4),
  };

  return result;
}
