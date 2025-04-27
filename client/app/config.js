// config.js

export const PRICING_CONFIG = {
  European: [
    {
      label: "Black-Scholes (Vanilla)",
      value: "blackScholes",
      solutions: [
        {
          name: "Black-Scholes Closed-Form Solution",
          value: "closedForm",
          desc: "(Fast, Exact)",
        },
        {
          name: "Monte Carlo Simulation",
          value: "monteCarlo",
          desc: "(Slow, Flexible for Path-Dependent Options)",
        },
      ],
    },
    {
      label: "Heston (Stochastic Vol)",
      value: "heston",
      solutions: [
        {
          name: "Heston semi-closed form solution",
          value: "characteristicFunction",
          desc: "(Very Fast, Exact in Fourier Space)",
        },
        {
          name: "Monte Carlo Simulation",
          value: "monteCarlo",
          desc: "(Slow, Suitable for Complex Payoffs)",
        },
      ],
    },
  ],
  // American: [],
};

export const ASSET_TYPES_MAP = {
  blackScholes: ["ETFs", "Indices", "Stocks"],
  heston: ["ETFs", "Indices", "Stocks", "Commodities", "FX"],
};
