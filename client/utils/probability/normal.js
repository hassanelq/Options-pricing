import { processContinuousData } from "./helper_functions";

export default function simulateNormal({ mu, sigma, N }) {
  if (sigma <= 0) throw new Error("Sigma must be positive");
  if (N <= 0) throw new Error("Number of simulations must be positive");

  const rawData = Array.from({ length: N }, () => mu + sigma * normalSample());

  return processContinuousData(rawData, `Normal (μ=${mu}, σ=${sigma})`);
}

function normalSample() {
  return (
    Math.sqrt(-2 * Math.log(Math.random())) *
    Math.cos(2 * Math.PI * Math.random())
  );
}
