// config.js

export const PRICING_CONFIG = {
  European: [
    {
      label: "Black-Scholes (Vanilla)",
      value: "blackScholes",
      solutions: [
        { name: "Black-Scholes Closed-Form Solution", desc: "(Fast, Exact)" },
        {
          name: "Fourier Transform via Carr-Madan",
          desc: "(Fast, Suitable for Characteristic Functions)",
        },
        {
          name: "Monte Carlo Simulation",
          desc: "(Slow, Flexible for Path-Dependent Options)",
        },
      ],
    },
    {
      label: "Heston (Stochastic Vol)",
      value: "heston",
      solutions: [
        {
          name: "Heston Characteristic Function",
          desc: "(Very Fast, Exact in Fourier Space)",
        },
        {
          name: "Fourier Transform via Carr-Madan",
          desc: "(Fast, Works Well for European Options)",
        },
        {
          name: "Monte Carlo Simulation",
          desc: "(Slow, Suitable for Complex Payoffs)",
        },
      ],
    },
    {
      label: "Ornstein-Uhlenbeck (OU)",
      value: "ou",
      solutions: [
        {
          name: "Analytical Solution via Fokker-Planck Equation",
          desc: "(Fast, Exact for Simple Cases)",
        },
        {
          name: "Fast Fourier Transform (FFT)",
          desc: "(Fast, Spectral Approach)",
        },
        {
          name: "Monte Carlo Simulation",
          desc: "(Slow, Useful for Stochastic Interest Rate Models)",
        },
      ],
    },
  ],
};

export const ASSET_TYPES_MAP = {
  blackScholes: ["Stocks", "Indices", "FX", "ETFs"],
  heston: ["Stocks", "Commodities", "FX"],
  ou: ["Interest Rates", "Commodities", "Energy Prices"],
};
