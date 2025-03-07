import { processDiscreteData } from "./helper_functions";

export default function simulateBinomial({ n, p, N }) {
  if (p < 0 || p > 1) throw new Error("Probability p must be between 0 and 1");
  if (n <= 0 || !Number.isInteger(n))
    throw new Error("Number of trials must be a positive integer");
  if (N <= 0) throw new Error("Number of simulations must be positive");

  const rawData = Array.from({ length: N }, () =>
    Array.from({ length: n }, () => (Math.random() < p ? 1 : 0)).reduce(
      (a, b) => a + b,
      0
    )
  );

  const result = processDiscreteData(rawData, `Binomial (n=${n}, p=${p})`);

  // binomial-specific statistics
  result.statistics = {
    ...result.statistics,
    "Number of Trials": n,
    "Success Probability": p.toFixed(4),
    "Theoretical Mean": (n * p).toFixed(4),
    "Theoretical Variance": (n * p * (1 - p)).toFixed(4),
  };

  return result;
}
