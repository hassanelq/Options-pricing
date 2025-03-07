// Utility: Generate a random draw from the standard normal distribution
function randomNormal() {
  const u = 1 - Math.random();
  const v = 1 - Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function mean(array) {
  return array.reduce((a, b) => a + b, 0) / array.length;
}

export default function monteCarloInvestment(inputs) {
  const {
    initialInvestment,
    annualReturn, // in %
    annualVolatility, // in %
    timeHorizon, // integer years
    annualContribution,
    investmentGoal,
    numSimulations = 1000,
  } = inputs;

  const trajectories = [];
  const finalValues = [];

  for (let i = 0; i < numSimulations; i++) {
    let portfolio = initialInvestment;
    const trajectory = [portfolio];

    for (let year = 1; year <= timeHorizon; year++) {
      const z = randomNormal();
      const shock = (annualVolatility / 100) * z;
      portfolio *= 1 + (annualReturn / 100 + shock);
      portfolio += annualContribution;
      trajectory.push(portfolio);
    }

    trajectories.push(trajectory);
    finalValues.push(portfolio);
  }

  const probabilityToReachGoal =
    (finalValues.filter((value) => value >= investmentGoal).length /
      numSimulations) *
    100;

  return {
    summary: {
      "Average Final Value": mean(finalValues).toFixed(2),
      "Probability to Reach Target": `${probabilityToReachGoal.toFixed(2)}%`,
    },
    graph: {
      labels: Array.from({ length: timeHorizon + 1 }, (_, i) => i),
      datasets: trajectories.slice(0, 15).map((data, idx) => ({
        label: `Simulation ${idx + 1}`,
        data,
        borderColor: `rgba(0, 123, 255, ${0.5 + idx / 20})`,
        fill: false,
      })),
    },
    distribution: finalValues,
  };
}
