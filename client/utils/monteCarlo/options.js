// Utility: Generate a random draw from the standard normal distribution
function randomNormal() {
  const u = 1 - Math.random();
  const v = 1 - Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function mean(array) {
  return array.reduce((a, b) => a + b, 0) / array.length;
}
export default function monteCarloOptions(inputs) {
  const {
    stockPrice,
    strikePrice,
    riskFreeRate, // in %
    volatility, // in %
    timeToMaturity, // in years
    dividendYield, // in %
    optionType, // "call" or "put"
    numSimulations = 1000,
  } = inputs;

  const callPayoffs = [];
  const putPayoffs = [];
  const trajectories = [];
  const finalPrices = [];

  for (let i = 0; i < numSimulations; i++) {
    const z = randomNormal();
    const drift =
      (riskFreeRate / 100 -
        dividendYield / 100 -
        0.5 * (volatility / 100) ** 2) *
      timeToMaturity;
    const shock = (volatility / 100) * Math.sqrt(timeToMaturity) * z;

    const endStockPrice = stockPrice * Math.exp(drift + shock);
    finalPrices.push(endStockPrice);

    // Calculate payoffs for call and put options
    const callPayoff = Math.max(endStockPrice - strikePrice, 0);
    const putPayoff = Math.max(strikePrice - endStockPrice, 0);

    callPayoffs.push(callPayoff);
    putPayoffs.push(putPayoff);

    // Store the trajectory (start and end prices)
    trajectories.push([stockPrice, endStockPrice]);
  }

  // Discount the mean payoffs back to present value
  const discountFactor = Math.exp(-1 * (riskFreeRate / 100) * timeToMaturity);
  const callPrice = mean(callPayoffs) * discountFactor;
  const putPrice = mean(putPayoffs) * discountFactor;

  // Calculate the probability of the option being in the money (ITM)
  const inTheMoneyProbability =
    (finalPrices.filter((price) =>
      optionType === "call" ? price > strikePrice : price < strikePrice
    ).length /
      numSimulations) *
    100;

  return {
    callPrice,
    putPrice,
    inTheMoneyProbability: inTheMoneyProbability.toFixed(2),
    pricePaths: {
      labels: ["Start", "End"],
      datasets: trajectories.slice(0, 10).map((data, idx) => ({
        label: `Simulation ${idx + 1}`,
        data,
        borderColor: `rgba(54, 162, 235, ${0.5 + idx / 20})`,
        fill: false,
      })),
    },
    priceDistribution: finalPrices,
  };
}
