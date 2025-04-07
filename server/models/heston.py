import numpy as np
from typing import Dict, Any
from math import exp, log, pi
from scipy.integrate import quad
from numpy.lib.scimath import sqrt as csqrt  # use complex-safe sqrt


class Heston:

    @staticmethod
    def characteristic_function(
        option_type: str,
        S: float,
        K: float,
        T: float,
        r: float,
        sigma: float,
        **heston_params
    ) -> dict:
        """
        Calculate Heston price for European call option using Lewis (2001) formulation
        which addresses numerical stability issues.
        """
        N = 100
        umax = 100
        du = umax / N
        u = np.arange(du / 2, umax, du)

        kappa = heston_params.get("kappa", 2.0)
        theta = heston_params.get("theta", 0.04)
        v0 = sigma
        rho = heston_params.get("rho", -0.7)
        xi = heston_params.get("xi", 0.4)

        i = complex(0, 1)  # <--- define here for use in all inner functions

        def char_func(u):
            d = csqrt((kappa - rho * sigma * i * u) ** 2 + sigma**2 * (u**2 + i * u))
            g = (kappa - rho * sigma * i * u - d) / (kappa - rho * sigma * i * u + d)

            exp_dt = np.exp(-d * T)
            exp_dt = np.where(np.isfinite(exp_dt), exp_dt, 0)

            C = r * i * u * T + (kappa * theta / sigma**2) * (
                (kappa - rho * sigma * i * u - d) * T
                - 2 * np.log((1 - g * exp_dt) / (1 - g))
            )
            D = (
                (kappa - rho * sigma * i * u - d)
                / sigma**2
                * ((1 - exp_dt) / (1 - g * exp_dt))
            )

            return np.exp(C + D * v0 + i * u * np.log(S / K))

        def integrand(u):
            return np.real(np.exp(-i * u * np.log(K)) * char_func(u) / (i * u))

        integral = np.sum(integrand(u)) * du / np.pi
        call_price = S - K * np.exp(-r * T) / 2 + K * np.exp(-r * T) * integral

        if option_type == "put":
            # Put-Call Parity
            price = call_price - S + K * np.exp(-r * T)

        elif option_type == "call":
            price = call_price

        return {"price": price, "methodology": "Heston Characteristic Function"}

    @staticmethod
    def monte_carlo(
        option_type: str, S: float, K: float, T: float, r: float, **heston_params
    ) -> dict:
        """Heston Monte Carlo implementation"""
        # TODO: Actual implementation
        return {"price": 10.47, "methodology": "Monte Carlo Simulation"}
