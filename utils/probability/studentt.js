import { processContinuousData, sampleGamma } from "./helper_functions";

export default function simulateStudentT({ nu, N }) {
  if (nu <= 0) throw new Error("Degrees of freedom ν must be > 0");
  if (N <= 0) throw new Error("Number of simulations must be positive");

  const rawData = Array.from({ length: N }, () => {
    const z = normalSample();
    const chi2 = sampleGamma(nu / 2, 2); // Chi-squared with ν degrees of freedom
    return z / Math.sqrt(chi2 / nu);
  });

  const result = processContinuousData(rawData, `Student's t (ν=${nu})`);

  result.statistics = {
    ...result.statistics,
    "Degrees of Freedom": nu.toFixed(2),
    "Theoretical Mean": (nu > 1 ? 0 : "Undefined").toString(),
    "Theoretical Variance": (nu > 2
      ? (nu / (nu - 2)).toFixed(4)
      : "Undefined"
    ).toString(),
  };

  return result;
}

function normalSample() {
  return (
    Math.sqrt(-2 * Math.log(Math.random())) *
    Math.cos(2 * Math.PI * Math.random())
  );
}
