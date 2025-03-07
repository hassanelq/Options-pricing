import { processContinuousData } from "./helper_functions";

export default function simulateLognormal({ mu, sigma, N }) {
  if (sigma <= 0) throw new Error("σ must be positive");
  if (N <= 0) throw new Error("Number of simulations must be positive");

  const rawData = Array.from({ length: N }, () =>
    Math.exp(mu + sigma * normalSample())
  );

  const result = processContinuousData(
    rawData,
    `Log-Normal (μ=${mu}, σ=${sigma})`
  );

  result.statistics = {
    ...result.statistics,
    "Log-Mean (μ)": mu.toFixed(4),
    "Log-Std Dev (σ)": sigma.toFixed(4),
    "Theoretical Mean": Math.exp(mu + sigma ** 2 / 2).toFixed(4),
    "Theoretical Variance":
      (Math.exp(sigma ** 2) - 1) * Math.exp(2 * mu + sigma ** 2).toFixed(4),
  };

  return result;
}
