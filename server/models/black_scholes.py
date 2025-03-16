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
                1j * u * log(S)
                + (r - 0.5 * sigma**2) * T * iu
                - 0.5 * sigma**2 * T * u**2
            )

        # Define the integrand
        def integrand(u):
            iu = 1j * u
            return (
                exp(-1j * u * log(K))
                * characteristic_function(u - 0.5 * 1j)
                / (iu * (iu + 1))
            )

        # Calculate the price
        if option_type == "call":
            price = (
                S
                - K * exp(-r * T) * 0.5
                - (1 / np.pi) * integrate.quad(integrand, 0, np.inf)[0]
            )
        elif option_type == "put":
            price = (
                K * exp(-r * T) * 0.5
                - (1 / np.pi) * integrate.quad(integrand, 0, np.inf)[0]
            )

        return {"price": price, "methodology": "Black-Scholes Fourier Transform"}

    @staticmethod
    def monte_carlo(
        option_type: str,
        S: float,
        K: float,
        T: float,
        r: float,
        sigma: float,
        num_simulations: int = 10000,
    ) -> dict:
        """Monte Carlo simulation implementation"""

        # Simulation des prix futurs du sous-jacent
        Z = np.random.standard_normal(size=num_simulations)
        ST = S * np.exp(
            (r - 0.5 * sigma**2) * T + sigma * sqrt(T) * Z
        )  # Évolution du sous-jacent

        if option_type == "call":
            payoff = np.maximum(ST - K, 0)
        elif option_type == "put":
            payoff = np.maximum(K - ST, 0)

        price = exp(-r * T) * np.mean(payoff)

        return {"price": price, "methodology": "Monte Carlo Simulation"}
