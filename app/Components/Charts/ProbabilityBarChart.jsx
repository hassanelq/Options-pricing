"use client";

import React, { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
  ssr: false,
});

const ProbabilityBarChart = ({
  data,
  labels,
  distributionType,
  params,
  isDiscrete = false,
}) => {
  const chartRef = useRef(null);

  // Register Chart.js and plugins on the client side
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    const loadChart = async () => {
      const {
        Chart: ChartJS,
        LinearScale,
        CategoryScale,
        BarController,
        BarElement,
        LineController,
        LineElement,
        PointElement,
        Title,
        Tooltip,
        Legend,
      } = await import("chart.js");

      const zoom = await import("chartjs-plugin-zoom");
      const annotation = await import("chartjs-plugin-annotation");

      ChartJS.register(
        LinearScale,
        CategoryScale,
        BarController,
        BarElement,
        LineController,
        LineElement,
        PointElement,
        Title,
        Tooltip,
        Legend,
        zoom.default,
        annotation.default
      );

      setChartReady(true);
    };

    loadChart();
  }, []);

  // Color scheme based on distribution type
  const colorMap = {
    normal: { bg: "rgba(54, 162, 235, 0.5)", border: "rgba(54, 162, 235, 1)" },
    uniform: { bg: "rgba(255, 159, 64, 0.5)", border: "rgba(255, 159, 64, 1)" },
    exponential: {
      bg: "rgba(75, 192, 192, 0.5)",
      border: "rgba(75, 192, 192, 1)",
    },
    poisson: {
      bg: "rgba(153, 102, 255, 0.5)",
      border: "rgba(153, 102, 255, 1)",
    },
    binomial: {
      bg: "rgba(255, 99, 132, 0.5)",
      border: "rgba(255, 99, 132, 1)",
    },
    lognormal: {
      bg: "rgba(255, 206, 86, 0.5)",
      border: "rgba(255, 206, 86, 1)",
    },
    studentt: {
      bg: "rgba(75, 192, 192, 0.5)",
      border: "rgba(75, 192, 192, 1)",
    },
    cauchy: {
      bg: "rgba(153, 102, 255, 0.5)",
      border: "rgba(153, 102, 255, 1)",
    },
    beta: { bg: "rgba(255, 159, 64, 0.5)", border: "rgba(255, 159, 64, 1)" },
    gamma: { bg: "rgba(54, 162, 235, 0.5)", border: "rgba(54, 162, 235, 1)" },
    levy: { bg: "rgba(255, 99, 132, 0.5)", border: "rgba(255, 99, 132, 1)" },
    pareto: { bg: "rgba(75, 192, 192, 0.5)", border: "rgba(75, 192, 192, 1)" },
    hypergeometric: {
      bg: "rgba(153, 102, 255, 0.5)",
      border: "rgba(153, 102, 255, 1)",
    },
    weibull: { bg: "rgba(255, 159, 64, 0.5)", border: "rgba(255, 159, 64, 1)" },
    triangular: {
      bg: "rgba(54, 162, 235, 0.5)",
      border: "rgba(54, 162, 235, 1)",
    },
    default: { bg: "rgba(255, 159, 64, 0.5)", border: "rgba(255, 159, 64, 1)" },
  };

  const { bg, border } = colorMap[distributionType] || colorMap.default;

  // Define binomialCoefficient
  const binomialCoefficient = (n, k) => {
    if (k === 0 || k === n) return 1;
    if (k === 1) return n;
    return binomialCoefficient(n - 1, k - 1) + binomialCoefficient(n - 1, k);
  };

  // Define gamma
  const gamma = (n) => {
    if (n === 1) return 1;
    if (n === 0.5) return Math.sqrt(Math.PI);
    return (n - 1) * gamma(n - 1);
  };

  // Theoretical PDF/PMF calculation
  const theoreticalPDF = labels.map((label) => {
    const x = parseFloat(label);
    switch (distributionType) {
      case "normal":
        return (
          (1 / (params.sigma * Math.sqrt(2 * Math.PI))) *
          Math.exp(-0.5 * ((x - params.mu) / params.sigma) ** 2)
        );
      case "lognormal":
        return (
          (1 / (x * params.sigma * Math.sqrt(2 * Math.PI))) *
          Math.exp(-0.5 * ((Math.log(x) - params.mu) / params.sigma) ** 2)
        );
      case "uniform":
        return 1 / (params.b - params.a);
      case "exponential":
        return params.lambda * Math.exp(-params.lambda * x);
      case "poisson":
        return (
          (Math.pow(params.lambda, x) * Math.exp(-params.lambda)) / factorial(x)
        );
      case "binomial":
        return (
          binomialCoefficient(params.n, x) *
          Math.pow(params.p, x) *
          Math.pow(1 - params.p, params.n - x)
        );
      case "gamma":
        return (
          (Math.pow(x, params.k - 1) * Math.exp(-x / params.theta)) /
          (Math.pow(params.theta, params.k) * gamma(params.k))
        );

      case "pareto":
        return (
          (params.alpha * Math.pow(params.xm, params.alpha)) /
          Math.pow(x, params.alpha + 1)
        );

      case "poisson":
        return (
          (Math.pow(params.lambda, x) * Math.exp(-params.lambda)) / factorial(x)
        );
      default:
        return null;
    }
  });

  // Calculate bin width for continuous distributions
  const binWidth = isDiscrete
    ? 1 // Discrete distributions have integer bins
    : parseFloat(labels[1]) - parseFloat(labels[0]); // Continuous distributions

  const chartData = {
    labels,
    datasets: [
      {
        label: isDiscrete ? "Probability Mass" : "Frequency Density",
        data: isDiscrete
          ? data // For discrete distributions, use raw counts
          : data.map((val) => val / binWidth), // For continuous, normalize to density
        backgroundColor: bg,
        borderColor: border,
        borderWidth: 1,
        barPercentage: isDiscrete ? 0.9 : 1.0,
        categoryPercentage: isDiscrete ? 0.8 : 1.0,
      },
      ...(theoreticalPDF[0]
        ? [
            {
              label: "Theoretical PDF",
              data: theoreticalPDF,
              type: "line",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.1,
            },
          ]
        : []),
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `${distributionType} Distribution` },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            if (context.datasetIndex === 0) {
              return `${label}: ${context.parsed.y.toFixed(2)}`;
            }
            return `${label}: ${context.parsed.y.toExponential(2)}`;
          },
        },
      },
      zoom: {
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "xy",
        },
        pan: {
          enabled: true,
          mode: "xy",
        },
      },
      annotation: {
        annotations: {
          meanLine: {
            type: "line",
            yMin: 0,
            yMax: 0,
            borderColor: "rgba(0, 0, 0, 0.7)",
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              content: "Mean",
              position: "end",
            },
          },
        },
      },
      id: "distributionChart",
    },
    scales: {
      x: {
        title: {
          display: true,
          text: isDiscrete ? "Outcome" : "Value Range",
        },
        type: isDiscrete ? "category" : "linear",
        grid: { display: false },
        ...(!isDiscrete && {
          offset: true,
          bounds: "ticks",
        }),
      },
      y: {
        title: {
          display: true,
          text: isDiscrete ? "Probability" : "Density",
        },
        beginAtZero: true,
        ...(!isDiscrete && {
          type: "linear",
          min: 0,
        }),
      },
    },
    interaction: {
      mode: "nearest",
      intersect: false,
    },
  };

  const handleResetZoom = () => {
    const chart = chartRef.current;
    if (chart) {
      chart.resetZoom();
    }
  };

  return (
    <div className="w-full h-[32rem] relative">
      {chartReady && (
        <Bar
          ref={chartRef}
          data={chartData}
          options={options}
          datasetIdKey="distributionChart"
        />
      )}
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          className="px-2 py-1 bg-white shadow rounded text-sm"
          onClick={handleResetZoom}
        >
          Reset Zoom
        </button>
      </div>
    </div>
  );
};

export default ProbabilityBarChart;
