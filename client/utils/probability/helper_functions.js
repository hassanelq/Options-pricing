export function processContinuousData(data, description) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const binCount = 50;
  const totalRange = max - min;
  const step = totalRange / binCount;

  const frequencies = Array(binCount).fill(0);

  data.forEach((value) => {
    const bin = Math.floor((value - min) / step);
    if (bin >= 0 && bin < binCount) frequencies[bin]++;
  });

  const labels = Array.from({ length: binCount }, (_, i) =>
    (min + (i + 0.5) * step).toFixed(2)
  );

  return {
    description,
    statistics: {
      Mean: mean(data).toFixed(4),
      Median: median(data).toFixed(4),
      // "Std Dev": sampleStandardDeviation(data).toFixed(4),
      Skewness: skewness(data).toFixed(4),
      Kurtosis: kurtosis(data).toFixed(4),
    },
    data: {
      labels,
      frequencies,
      meta: {
        binCount,
        totalRange,
        min,
        max,
      },
    },
  };
}

export function processDiscreteData(data, description) {
  const frequencies = data.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(frequencies).sort((a, b) => a - b);
  const frequenciesArray = labels.map((key) => frequencies[key]);

  return {
    description,
    statistics: {
      Mean: mean(data).toFixed(4),
      Median: median(data).toFixed(4),
      // "Std Dev": sampleStandardDeviation(data).toFixed(4),
      Skewness: skewness(data).toFixed(4),
      Kurtosis: kurtosis(data).toFixed(4),
    },
    data: { labels, frequencies: frequenciesArray },
  };
}

export function mean(data) {
  return data.reduce((sum, value) => sum + value, 0) / data.length;
}

export function median(data) {
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function skewness(data) {
  const avg = mean(data);
  const std = sampleStandardDeviation(data);
  const n = data.length;
  return (
    (data.reduce((sum, value) => sum + ((value - avg) / std) ** 3, 0) * n) /
    ((n - 1) * (n - 2))
  );
}

export function kurtosis(data) {
  const avg = mean(data);
  const stddev = standardDeviation(data);
  const n = data.length;
  return (
    ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) *
      data.reduce((sum, value) => sum + ((value - avg) / stddev) ** 4, 0) -
    (3 * (n - 1) ** 2) / ((n - 2) * (n - 3))
  );
}

export function standardDeviation(data) {
  const avg = mean(data);
  const variance =
    data.reduce((sum, value) => sum + (value - avg) ** 2, 0) / data.length;
  return Math.sqrt(variance);
}

export function sampleStandardDeviation(arr) {
  const m = mean(arr);
  return Math.sqrt(
    arr.reduce((acc, x) => acc + (x - m) ** 2, 0) / (arr.length - 1)
  );
}

export function sampleGamma(k, theta) {
  if (k < 1) {
    const u = Math.random();
    return sampleGamma(1 + k, theta) * Math.pow(u, 1 / k);
  }

  const d = k - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);

  while (true) {
    let x, v;
    do {
      x = normalSample();
      v = 1 + c * x;
    } while (v <= 0);

    v = v ** 3;
    const u = Math.random();
    if (
      u < 1 - 0.0331 * x ** 4 ||
      Math.log(u) < 0.5 * x ** 2 + d * (1 - v + Math.log(v))
    ) {
      return d * v * theta;
    }
  }
}
