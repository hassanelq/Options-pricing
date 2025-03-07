import { processContinuousData } from "./helper_functions";

export default function simulatePareto({ alpha, xm, N }) {
  if (alpha <= 0) throw new Error("Shape parameter α must be > 0");
  if (xm <= 0) throw new Error("Scale parameter xₘ must be > 0");
  if (N <= 0) throw new Error("Number of simulations must be positive");

  const rawData = Array.from(
    { length: N },
    () => xm / Math.random() ** (1 / alpha)
  );

  const result = processContinuousData(
    rawData,
    `Pareto (α=${alpha}, xₘ=${xm})`
  );

  result.statistics = {
    ...result.statistics,
    "Shape Parameter (α)": alpha.toFixed(4),
    "Scale Parameter (xₘ)": xm.toFixed(4),
    "Theoretical Mean": (alpha > 1
      ? (alpha * xm) / (alpha - 1)
      : Infinity
    ).toFixed(4),
  };

  return result;
}
