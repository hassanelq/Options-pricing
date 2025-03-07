import { processContinuousData } from "./helper_functions";

export default function simulateWeibull({ lambda, k, N }) {
  if (lambda <= 0) throw new Error("Scale parameter λ must be > 0");
  if (k <= 0) throw new Error("Shape parameter k must be > 0");
  if (N <= 0) throw new Error("Number of simulations must be positive");

  const rawData = Array.from(
    { length: N },
    () => lambda * (-Math.log(1 - Math.random())) ** (1 / k)
  );

  const result = processContinuousData(
    rawData,
    `Weibull (λ=${lambda}, k=${k})`
  );

  result.statistics = {
    ...result.statistics,
    "Scale Parameter (λ)": lambda.toFixed(2),
    "Shape Parameter (k)": k.toFixed(2),
  };

  return result;
}
