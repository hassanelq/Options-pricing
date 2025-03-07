// simulateWithDrift.js - Improved simulation logic
function randomNormal() {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export default function simulateWithDrift({
  steps,
  particles,
  timeStep,
  drift,
  volatility,
  initialValue,
}) {
  const trajectories = [];
  const sqrtTimeStep = Math.sqrt(timeStep);

  for (let p = 0; p < particles; p++) {
    const trajectory = [initialValue];
    let currentValue = initialValue;

    for (let i = 1; i <= steps; i++) {
      const increment =
        drift * timeStep + volatility * sqrtTimeStep * randomNormal();
      currentValue += increment;
      trajectory.push(currentValue);
    }

    trajectories.push(trajectory);
  }

  return trajectories;
}

// BrownianLineChart.jsx - Improved chart with better visualization
const BrownianLineChart = ({ trajectories, timeSteps }) => {
  // Limit number of visible paths for better performance
  const maxVisiblePaths = 20;
  const visibleTrajectories = trajectories.slice(0, maxVisiblePaths);

  const datasets = visibleTrajectories.map((trajectory, idx) => ({
    label: `Path ${idx + 1}`,
    data: trajectory,
    borderColor: `hsl(${(idx * 360) / maxVisiblePaths}, 70%, 50%)`,
    borderWidth: 1, // Thinner lines
    pointRadius: 0,
    tension: 0.1,
    fill: false,
  }));

  const chartData = {
    labels: Array.from({ length: timeSteps + 1 }, (_, i) => i),
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: {
          boxWidth: 12,
          font: {
            size: 10,
          },
        },
      },
      title: {
        display: true,
        text: "Brownian Motion Simulation (1D)",
        font: { size: 16 },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time Steps",
          font: { weight: "bold" },
        },
        grid: { display: false },
      },
      y: {
        title: {
          display: true,
          text: "Position",
          font: { weight: "bold" },
        },
        grid: { color: "#e5e7eb" },
      },
    },
    animation: {
      duration: 0, // Disable animation for better performance
    },
    elements: {
      line: {
        borderWidth: 1,
      },
    },
  };

  return (
    <div className="w-full h-[500px] relative">
      <div className="absolute top-2 left-2 text-sm text-gray-600">
        Showing {Math.min(trajectories.length, maxVisiblePaths)} of{" "}
        {trajectories.length} paths
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
};
