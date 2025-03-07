function randomNormal() {
  const u = 1 - Math.random();
  const v = 1 - Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * Ornstein-Uhlenbeck process simulation.
 * @param {Object} inputs
 * @param {number} inputs.steps
 * @param {number} inputs.particles
 * @param {number} inputs.timeStep
 * @param {number} inputs.theta
 * @param {number} inputs.mean
 * @param {number} inputs.volatility
 * @param {number} inputs.initialValue
 * @returns {Array<Array<number>>}
 */
export default function simulateOrnsteinUhlenbeck({
  steps,
  particles,
  timeStep,
  theta,
  mean,
  volatility,
  initialValue,
}) {
  const trajectories = [];

  for (let p = 0; p < particles; p++) {
    let x = initialValue;
    const singleTrajectory = [x];

    for (let i = 1; i <= steps; i++) {
      const z = randomNormal();

      // Euler discretization for OU: dX = theta*(mean - X)*dt + sigma*dW
      x += theta * (mean - x) * timeStep + volatility * Math.sqrt(timeStep) * z;
      singleTrajectory.push(x);
    }

    trajectories.push(singleTrajectory);
  }

  return trajectories;
}
