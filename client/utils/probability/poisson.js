import { processDiscreteData } from "./helper_functions";

export default function simulatePoisson({ lambda, N }) {
  if (lambda <= 0) throw new Error("Rate parameter λ must be > 0");
  if (N <= 0) throw new Error("Number of simulations must be positive");

  const rawData = Array.from({ length: N }, () => {
    let k = 0;
    let p = 1;
    const L = Math.exp(-lambda);

    while (p > L) {
      k++;
      p *= Math.random();
    }
    return k - 1;
  });

  const result = processDiscreteData(rawData, `Poisson (λ=${lambda})`);

  result.statistics = {
    ...result.statistics,
    "Rate Parameter (λ)": lambda.toFixed(4),
    "Theoretical Mean": lambda.toFixed(4),
    "Theoretical Variance": lambda.toFixed(4),
  };

  return result;
}
