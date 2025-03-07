import { sampleGamma, processContinuousData } from "./helper_functions";

export default function simulateGamma({ k, theta, N_simulations }) {
  if (k <= 0) throw new Error("Shape parameter k must be > 0");
  if (theta <= 0) throw new Error("Scale parameter θ must be > 0");
  if (N <= 0) throw new Error("Number of simulations must be positive");

  const rawData = Array.from({ length: N_simulations }, () =>
    sampleGamma(k, theta)
  );

  const result = processContinuousData(rawData, `Gamma (k=${k}, θ=${theta})`);

  result.statistics = {
    ...result.statistics,
    "Shape Parameter (k)": k.toFixed(4),
    "Scale Parameter (θ)": theta.toFixed(4),
    "Theoretical Mean": (k * theta).toFixed(4),
    "Theoretical Variance": (k * theta ** 2).toFixed(4),
  };

  return result;
}
