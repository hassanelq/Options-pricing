import numpy as np
from typing import Dict, Any
from utils.calibrateHeston import heston_call_price, heston_put_price


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
        required_params = ["kappa", "theta", "rho", "xi"]
        for p in required_params:
            if p not in heston_params:
                raise ValueError(f"Missing required parameter: {p}")
        kappa = heston_params["kappa"]
        theta = heston_params["theta"]
        rho = heston_params["rho"]
        xi = heston_params["xi"]
        n_steps = heston_params.get("n_steps", 100)

        v0 = sigma**2  # Convert volatility to variance
        dt = T / n_steps

        # Initialize arrays for log(S) and variance
        log_S = np.full((num_simulations, n_steps + 1), np.log(S))
        v = np.full((num_simulations, n_steps + 1), v0)

        # Correlated Brownian motion generation
        np.random.seed(42)  # For reproducibility
        for t in range(n_steps):
            # Full truncation: Replace v with max(v, 0) in drift and diffusion
            v_plus = np.maximum(v[:, t], 0)

            # Generate correlated Z1 (asset) and Z2 (variance)
            Z1 = np.random.normal(0, 1, num_simulations)
            Z2 = rho * Z1 + np.sqrt(1 - rho**2) * np.random.normal(
                0, 1, num_simulations
            )

            # Update variance (Euler with full truncation)
            dv = kappa * (theta - v_plus) * dt + xi * np.sqrt(v_plus * dt) * Z2
            v[:, t + 1] = v[:, t] + dv

            # Update log stock price (log-Euler to avoid negative prices)
            d_log_S = (r - 0.5 * v_plus) * dt + np.sqrt(v_plus * dt) * Z1
            log_S[:, t + 1] = log_S[:, t] + d_log_S

        # Compute terminal stock prices and payoffs
        S_T = np.exp(log_S[:, -1])
        if option_type.lower() == "call":
            payoffs = np.maximum(S_T - K, 0.0)
        elif option_type.lower() == "put":
            payoffs = np.maximum(K - S_T, 0.0)
        else:
            raise ValueError("option_type must be 'call' or 'put'")

        # Discount and compute statistics
        discount_factor = np.exp(-r * T)
        price = discount_factor * np.mean(payoffs)
        stderr = discount_factor * np.std(payoffs) / np.sqrt(num_simulations)

        return {
            "price": float(price),
            "stderr": float(stderr),
            "methodology": "Heston Monte Carlo (Euler with Full Truncation)",
        }
