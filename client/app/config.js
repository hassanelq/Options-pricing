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
          name: "Heston Characteristic Function",
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
    // {
    //   label: "Ornstein-Uhlenbeck (OU)",
    //   value: "ou",
    //   solutions: [
    //     {
    //       name: "Analytical Solution via Fokker-Planck Equation",
    //       value: "fokkerPlanck",
    //       desc: "(Fast, Exact for Simple Cases)",
    //     },
    //     {
    //       name: "Fast Fourier Transform (FFT)",
    //       value: "fft",
    //       desc: "(Fast, Spectral Approach)",
    //     },
    //     {
    //       name: "Monte Carlo Simulation",
    //       value: "monteCarlo",
    //       desc: "(Slow, Useful for Stochastic Interest Rate Models)",
    //     },
    //   ],
    // },
  ],
  // American: [],
};

export const ASSET_TYPES_MAP = {
  blackScholes: ["Stocks", "Indices", "ETFs"],
  heston: ["Stocks", "Commodities", "FX"],
  ou: ["Indices", "Interest Rates", "Commodities", "Energy Prices"],
};
