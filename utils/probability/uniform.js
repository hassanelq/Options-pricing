import { processContinuousData } from "./helper_functions";

export default function simulateUniform({ a, b, N }) {
  if (a >= b) throw new Error("Start (a) must be less than end (b)");
  if (N <= 0) throw new Error("Number of simulations must be positive");

  const rawData = Array.from({ length: N }, () => Math.random() * (b - a) + a);
  const result = processContinuousData(rawData, `Uniform (a=${a}, b=${b})`);

  result.statistics = {
    ...result.statistics,
    "Theoretical Mean": ((a + b) / 2).toFixed(2),
    "Theoretical Variance": ((b - a) ** 2 / 12).toFixed(2),
  };

  return result;
}
