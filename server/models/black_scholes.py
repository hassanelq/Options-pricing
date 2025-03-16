from datetime import datetime
import numpy as np
from numpy import exp, log, sqrt
from scipy.stats import norm


class BlackScholes:
    @staticmethod
    def closed_form(
        option_type: str,
        S: float,
        K: float,
        T: float,
        r: float,
        sigma: float,
    ) -> dict:
        """Closed-form solution implementation"""
        d1 = (log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * sqrt(T))
        d2 = d1 - sigma * sqrt(T)

        if option_type == "call":  # Calculate call option price
            price = S * norm.cdf(d1) - K * exp(-r * T) * norm.cdf(d2)
        elif option_type == "put":  # Calculate put option price
            price = K * exp(-r * T) * norm.cdf(-d2) - S * norm.cdf(-d1)

        return {"price": price, "methodology": "Black-Scholes Closed-Form Solution"}

    @staticmethod
    def fourier_transform(
        option_type: str,
        S: float,
        K: float,
        T: float,
        r: float,
        sigma: float,
    ) -> dict:
        import scipy.integrate as integrate

        """Carr-Madan Fourier transform implementation"""

        # Define the characteristic function
        def characteristic_function(u):
            iu = 1j * u
            return exp(
                iu * (log(S) + (r - 0.5 * sigma**2) * T) - 0.5 * sigma**2 * T * u**2
            )

        # Define the integrand with numerical stabilization
        def integrand(u):
            iu = 1j * u
            return (
                exp(-iu * log(K))
                * characteristic_function(u - 0.5 * 1j)
                / (iu * (iu + 1))
            ).real  # Take only the real part for stability

        # Perform integration over a wider range for accuracy
        integral, _ = integrate.quad(integrand, 1e-6, 100, limit=500)

        # Compute final price
        if option_type == "call":
            price = (S - K * exp(-r * T) * 0.5) - (1 / np.pi) * integral
        elif option_type == "put":
            price = (K * exp(-r * T) * 0.5) - (1 / np.pi) * integral

        return {"price": price, "methodology": "Black-Scholes Fourier Transform"}

    @staticmethod
    def monte_carlo(
        option_type: str,
        S: float,
        K: float,
        T: float,
        r: float,
        sigma: float,
        num_simulations: int = 10000,  # Default 10,000
    ) -> dict:
        """Monte Carlo simulation implementation"""

        if num_simulations <= 0:
            raise ValueError("num_simulations must be greater than zero")

        print(
            f"🔍 [DEBUG] Running Monte Carlo with {num_simulations} simulations"
        )  # Debug log

        # Generate random standard normal variables
        Z = np.random.standard_normal(size=num_simulations)

        # Simulate asset prices
        ST = S * np.exp((r - 0.5 * sigma**2) * T + sigma * sqrt(T) * Z)

        # Compute payoffs
        if option_type == "call":
            payoff = np.maximum(ST - K, 0)
        elif option_type == "put":
            payoff = np.maximum(K - ST, 0)

        # Compute Monte Carlo estimate
        price = exp(-r * T) * np.mean(payoff)

        return {"price": price, "methodology": "Monte Carlo Simulation"}
