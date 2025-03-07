import { processContinuousData } from "./helper_functions";

export default function simulateExponential({ lambda, N }) {
  // Parameter validation
  if (lambda <= 0) throw new Error("Lambda must be positive");
  if (N <= 0) throw new Error("Number of simulations must be positive");

  const rawData = Array.from(
    { length: N },
    () => -Math.log(Math.random()) / lambda
  );

  const result = processContinuousData(rawData, `Exponential (λ=${lambda})`);

  // exponential-specific statistics
  result.statistics = {
    ...result.statistics,
    "Rate Parameter (λ)": lambda.toFixed(4),
    "Theoretical Mean": (1 / lambda).toFixed(4),
    "Theoretical Variance": (1 / lambda ** 2).toFixed(4),
  };

  return result;
}
