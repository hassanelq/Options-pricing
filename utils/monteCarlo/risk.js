// Utility: Generate a random draw from the standard normal distribution
function randomNormal() {
  // Box-Muller transform
  const u = 1 - Math.random();
  const v = 1 - Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function mean(array) {
  return array.reduce((a, b) => a + b, 0) / array.length;
}

export default function monteCarloRisk(inputs) {
  const {
    portfolioValue,
    expectedReturn, // in %
    volatility, // in %
    timeHorizon, // in years
    numSimulations = 1000,
  } = inputs;

  const losses = [];

  for (let i = 0; i < numSimulations; i++) {
    // Standard GBM approach:
    // ln(S(t)/S(0)) ~ Normal((μ - σ^2/2)*t, σ^2 * t)
    // Here, μ = expectedReturn/100, σ = volatility/100
    const z = randomNormal();
    const drift =
      (expectedReturn / 100 - 0.5 * (volatility / 100) ** 2) * timeHorizon;
    const shock = (volatility / 100) * Math.sqrt(timeHorizon) * z;

    const endingValue = portfolioValue * Math.exp(drift + shock);
    const loss = portfolioValue - endingValue; // positive if a loss
    losses.push(loss);
  }

  // Sort ascending (smallest to largest)
  losses.sort((a, b) => a - b);

  // For VaR at 95%, want the 95th percentile of losses
  const index95 = Math.floor(0.95 * losses.length);
  const index99 = Math.floor(0.99 * losses.length);

  const var95 = losses[index95];
  const var99 = losses[index99];

  return {
    summary: {
      "Mean Loss": mean(losses).toFixed(2),
      "VaR 95%": var95.toFixed(2),
      "VaR 99%": var99.toFixed(2),
    },
    distribution: losses,
  };
}
