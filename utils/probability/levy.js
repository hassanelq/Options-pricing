import { processContinuousData } from "./helper_functions";

export default function simulateLevy({ alpha, gamma, N }) {
  if (alpha <= 0 || alpha > 2)
    throw new Error("Stability parameter α must be in (0, 2]");
  if (gamma <= 0) throw new Error("Scale parameter γ must be > 0");
  if (N <= 0) throw new Error("Number of simulations must be positive");

  const rawData = Array.from({ length: N }, () => {
    const u = Math.PI * (Math.random() - 0.5);
    const v = -Math.log(Math.random());
    const t = gamma / Math.cos(u / alpha) ** (1 / alpha);
    return (t * Math.sin(alpha * u)) / v ** ((1 - alpha) / alpha);
  }).filter((value) => Math.abs(value) < 1e6);

  const result = processContinuousData(
    rawData,
    `Lévy (α=${alpha}, γ=${gamma})`
  );

  result.statistics = {
    ...result.statistics,
    "Stability Parameter (α)": alpha.toFixed(4),
    "Scale Parameter (γ)": gamma.toFixed(4),
  };

  return result;
}
