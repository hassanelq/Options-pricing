import numpy as np
from typing import Dict, Any
from utils.calibrateHeston import heston_call_price, heston_put_price
import time


class Heston:

    @staticmethod
    def characteristic_function(
        option_type: str,
        S: float,
        K: float,
        T: float,
        r: float,
        sigma: float,
        **heston_params,
    ) -> dict:
        """
        Calculate Heston price for European call option using Lewis (2001) formulation
        which addresses numerical stability issues.
        """

        kappa = heston_params.get("kappa")
        theta = heston_params.get("theta")
        v0 = heston_params.get("v0")
        rho = heston_params.get("rho")
        xi = heston_params.get("xi")

        if option_type.lower() == "call":
            price = heston_put_price(S, K, T, r, kappa, rho, xi, theta, v0, 0)
        else:
            price = heston_put_price(S, K, T, r, kappa, rho, xi, theta, v0, 0)

        return {
            "price": price,
            "methodology": "Heston Characteristic Function (Heston 1993)",
        }

    @staticmethod
    def monte_carlo(
        option_type: str,
        S: float,
        K: float,
        T: float,
        r: float,
        sigma: float,
        num_simulations: int = 100000,
        **heston_params,
    ) -> Dict[str, Any]:
        """
        Heston Monte Carlo pricing using Euler discretization with full truncation.
        """

        # Validate Heston parameters
        required_params = ["kappa", "theta", "rho", "xi", "v0"]
        for p in required_params:
            if p not in heston_params:
                raise ValueError(f"Missing required parameter: {p}")

        kappa = heston_params["kappa"]
        theta = heston_params["theta"]
        rho = heston_params["rho"]
        volvol = heston_params["xi"]
        var0 = heston_params["v0"]
        steps = 500

        start_time = time.perf_counter()
        # Calculate number of time steps
        timesteps = int(T * steps)
        dt = T / timesteps

        # Initialize arrays for stock prices and variances
        S_current = np.full(num_simulations, S, dtype=np.float32)
        V_current = np.full(num_simulations, var0, dtype=np.float32)

        # Generate correlated standard normal random variables
        Z_half = np.random.multivariate_normal(
            mean=[0, 0],
            cov=[[1, rho], [rho, 1]],
            size=(num_simulations // 2, timesteps),
        ).astype(np.float32)
        Z = np.concatenate([Z_half, -Z_half], axis=0)

        # Simulation loop
        for t in range(timesteps):
            Z_S = Z[:, t, 0]
            Z_V = Z[:, t, 1]

            V_prev = np.maximum(V_current, 0)
            sqrt_V = np.sqrt(V_prev)

            # Update variance
            V_current += (
                kappa * (theta - V_prev) * dt + volvol * sqrt_V * np.sqrt(dt) * Z_V
            )
            V_current = np.maximum(V_current, 0)

            # Update stock using V_prev
            drift = (r - 0.5 * V_prev) * dt
            diffusion = sqrt_V * np.sqrt(dt) * Z_S
            S_current *= np.exp(drift + diffusion)

        # Calculate payoffs
        if option_type.lower() == "call":
            payoffs = np.maximum(S_current - K, 0)
        elif option_type.lower() == "put":
            payoffs = np.maximum(K - S_current, 0)
        else:
            raise ValueError("option_type must be 'call' or 'put'")

        # Discount and compute statistics
        discount_factor = np.exp(-r * T)
        price = discount_factor * np.mean(payoffs)
        stderr = discount_factor * np.std(payoffs) / np.sqrt(num_simulations)

        elapsed_time = time.perf_counter() - start_time
        # Ensure elapsed_time is never zero to avoid display issues
        if elapsed_time < 0.00000001:
            elapsed_time = 0.00000001
        return {
            "price": float(price),
            "standard_error": float(stderr),
            "calculation_time": round(elapsed_time * 1000, 5),
            "num_simulations": num_simulations,
            "methodology": "Heston Monte Carlo (Euler with Full Truncation)",
        }
