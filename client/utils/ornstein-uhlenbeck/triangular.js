import { processContinuousData } from "./helper_functions";

export default function simulateTriangular({ a, b, c, N }) {
  if (a >= b) throw new Error("Minimum (a) must be less than maximum (b)");
  if (c < a || c > b) throw new Error("Mode (c) must be between a and b");
  if (N <= 0) throw new Error("Number of simulations must be positive");

  const rawData = Array.from({ length: N }, () => {
    const u = Math.random();
    const F = (c - a) / (b - a);
    return u <= F
      ? a + Math.sqrt(u * (b - a) * (c - a))
      : b - Math.sqrt((1 - u) * (b - a) * (b - c));
  });

  const result = processContinuousData(
    rawData,
    `Triangular (a=${a}, b=${b}, c=${c})`
  );

  result.statistics = {
    ...result.statistics,
    "Theoretical Mean": ((a + b + c) / 3).toFixed(4),
    "Theoretical Variance": (
      (a ** 2 + b ** 2 + c ** 2 - a * b - a * c - b * c) /
      18
    ).toFixed(4),
  };

  return result;
}
