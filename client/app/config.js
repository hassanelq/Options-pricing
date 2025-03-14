// config.js

export const PRICING_CONFIG = {
  European: [
    {
      label: "Black-Scholes (Vanilla)",
      value: "blackScholes",
      solutions: ["Direct Formula", "Monte Carlo", "Euler Approximation"],
    },
    {
      label: "Heston (Stochastic Vol)",
      value: "heston",
      solutions: ["Fourier Transform", "Monte Carlo", "Finite Difference"],
    },
    {
      label: "Ornstein-Uhlenbeck (OU)",
      value: "ou",
      solutions: ["Direct Formula", "Monte Carlo", "Finite Difference"],
    },
  ],
};

export const ASSET_TYPES_MAP = {
  blackScholes: ["Stocks", "Indices", "FX", "ETFs"],
  heston: ["Equities", "Commodities", "FX"],
  ou: ["Interest Rates", "Commodities", "Energy Prices"],
};
