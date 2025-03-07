import { processDiscreteData } from "./helper_functions";

export default function simulateHypergeometric({
  K,
  N: populationSize,
  n: sampleSize,
  N_simulations,
}) {
  if (K > populationSize)
    throw new Error("Success states (K) cannot exceed population size");
  if (sampleSize > populationSize)
    throw new Error("Sample size cannot exceed population size");
  if (K < 0 || populationSize < 0 || sampleSize < 0)
    throw new Error("Parameters cannot be negative");

  const rawData = Array.from({ length: N_simulations }, () => {
    const population = [
      ...Array(K).fill(1),
      ...Array(populationSize - K).fill(0),
    ];
    let successes = 0;

    for (let i = 0; i < sampleSize; i++) {
      const idx = Math.floor(Math.random() * population.length);
      successes += population.splice(idx, 1)[0];
    }
    return successes;
  });

  const result = processDiscreteData(
    rawData,
    `Hypergeometric (K=${K}, N=${populationSize}, n=${sampleSize})`
  );

  result.statistics = {
    ...result.statistics,
    "Population Successes": K,
    "Population Size": populationSize,
    "Sample Size": sampleSize,
    "Theoretical Mean": ((K * sampleSize) / populationSize).toFixed(4),
  };

  return result;
}
