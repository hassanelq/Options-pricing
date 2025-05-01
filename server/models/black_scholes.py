from datetime import datetime
import numpy as np
from numpy import exp, log, sqrt
from scipy.stats import norm
import time


class BlackScholes:
    @staticmethod
    def closed_form(
        option_type: str, S: float, K: float, T: float, r: float, sigma: float
    ) -> dict:
        """Closed-form solution implementation for Black-Scholes option pricing"""
        start_time = time.perf_counter()  # Measure start time

        if T <= 0:
            return {
                "price": max(0, S - K) if option_type == "call" else max(0, K - S),
                "methodology": "Black-Scholes Closed-Form",
                "calculation_time": 0,
                "d1": 0,
                "d2": 0,
                "delta": 1 if option_type == "call" and S > K else 0,
                "gamma": 0,
                "theta": 0,
                "vega": 0,
                "note": "Zero time to expiration",
            }

        d1 = (log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * sqrt(T))
        d2 = d1 - sigma * sqrt(T)

        # Calculate price
        if option_type.lower() == "call":
            price = S * norm.cdf(d1) - K * exp(-r * T) * norm.cdf(d2)
            delta = norm.cdf(d1)
        elif option_type.lower() == "put":
            price = K * exp(-r * T) * norm.cdf(-d2) - S * norm.cdf(-d1)
            delta = norm.cdf(d1) - 1
        else:
            raise ValueError("Option type must be 'call' or 'put'")

        # Calculate Greeks
        gamma = norm.pdf(d1) / (S * sigma * sqrt(T))
        theta = (
            -S * norm.pdf(d1) * sigma / (2 * sqrt(T))
            - r * K * exp(-r * T) * norm.cdf(d2)
            if option_type == "call"
            else -S * norm.pdf(d1) * sigma / (2 * sqrt(T))
            + r * K * exp(-r * T) * norm.cdf(-d2)
        )
        vega = S * sqrt(T) * norm.pdf(d1) * 0.01  # Vega per 1% change in volatility

        elapsed_time = time.perf_counter() - start_time  # Measure execution time

        # Ensure elapsed_time is never zero to avoid display issues
        if elapsed_time < 0.000000001:
            elapsed_time = 0.000000001  # time in

        return {
            "price": price,
            "methodology": "Black-Scholes Closed-Form",
            "calculation_time": round(elapsed_time * 1000, 5),
            "d1": round(d1, 4),
            "d2": round(d2, 4),
            "delta": round(delta, 4),
            "gamma": round(gamma, 4),
            "theta": round(theta, 4),
            "vega": round(vega, 4),
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
    ) -> dict:
        """Monte Carlo simulation with variance reduction techniques"""
        if num_simulations <= 0:
            raise ValueError("num_simulations must be greater than zero")

        if T <= 0:
            return {
                "price": max(0, S - K) if option_type == "call" else max(0, K - S),
                "methodology": "Monte Carlo",
                "calculation_time": 0,
                "note": "Zero time to expiration",
            }

        start_time = time.perf_counter()

        # Generate random standard normal variables
        Z = np.random.standard_normal(size=num_simulations)

        # Apply antithetic variates technique to reduce variance if enabled
        Z = np.concatenate([Z, -Z])  # Mirror the random draws

        # Simulate asset prices
        drift = (r - 0.5 * sigma**2) * T
        diffusion = sigma * sqrt(T)
        ST = S * np.exp(drift + diffusion * Z)

        # Compute payoffs
        if option_type.lower() == "call":
            payoff = np.maximum(ST - K, 0)
        elif option_type.lower() == "put":
            payoff = np.maximum(K - ST, 0)
        else:
            raise ValueError("Option type must be 'call' or 'put'")

        # Compute Monte Carlo estimate and standard error
        discounted_payoff = exp(-r * T) * payoff
        price = np.mean(discounted_payoff)
        std_error = np.std(discounted_payoff) / sqrt(num_simulations)

        elapsed_time = time.perf_counter() - start_time

        # Ensure elapsed_time is never zero to avoid display issues
        if elapsed_time < 0.00000001:
            elapsed_time = 0.00000001

        # Perform closed-form calculation for comparison
        bs_result = BlackScholes.closed_form(option_type, S, K, T, r, sigma)

        return {
            "price": price,
            "methodology": "Monte Carlo",
            "calculation_time": round(elapsed_time * 1000, 5),
            "num_simulations": num_simulations,
            "standard_error": round(std_error, 6),
            "bs_difference": round(price - bs_result["price"], 6),
        }
