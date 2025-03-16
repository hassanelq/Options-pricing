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
        start_time = time.time()  # Measure start time

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
        rho = (
            K * T * exp(-r * T) * norm.cdf(d2) / 100
            if option_type == "call"
            else -K * T * exp(-r * T) * norm.cdf(-d2) / 100
        )  # Rho per 1% change in interest rate

        elapsed_time = time.time() - start_time  # Measure execution time

        # Ensure elapsed_time is never zero to avoid display issues
        if elapsed_time < 0.000001:
            elapsed_time = 0.000001

        return {
            "price": price,
            "methodology": "Black-Scholes Closed-Form",
            "calculation_time": round(elapsed_time * 1000, 3),
            "d1": round(d1, 4),
            "d2": round(d2, 4),
            "delta": round(delta, 4),
            "gamma": round(gamma, 4),
            "theta": round(theta, 4),
            "vega": round(vega, 4),
            "rho": round(rho, 4),
        }

    @staticmethod
    def fourier_transform(
        option_type: str, S: float, K: float, T: float, r: float, sigma: float
    ) -> dict:
        """Carr-Madan Fourier transform implementation for option pricing"""
        import scipy.integrate as integrate

        start_time = time.time()

        # Handle edge case of zero time to expiration
        if T <= 0:
            return {
                "price": max(0, S - K) if option_type == "call" else max(0, K - S),
                "methodology": "Fourier Transform",
                "calculation_time": 0.001,
                "note": "Zero time to expiration",
            }

        # Damping factor to improve numerical stability
        # Adjust alpha based on option parameters to prevent numerical issues
        alpha = 1.5
        if K > 3 * S:  # Far out-of-the-money
            alpha = 2.5
        elif K < S / 3:  # Deep in-the-money
            alpha = 0.75

        # Characteristic function of log asset price
        def characteristic_function(u):
            iu = 1j * u
            return exp(
                iu * (log(S) + (r - 0.5 * sigma**2) * T) - 0.5 * sigma**2 * T * u**2
            )

        # Define integrand for call option
        def call_integrand(u):
            if u == 0:
                return 0.0  # Handle singularity at u=0
            iu = 1j * u
            denominator = alpha**2 + alpha - u**2 + 1j * (2 * alpha + 1) * u
            if abs(denominator) < 1e-10:  # Avoid division by very small numbers
                return 0.0
            return (
                exp(-iu * log(K))
                * characteristic_function(u - (alpha + 1) * 1j)
                / denominator
            ).real

        # Define integrand for put option
        def put_integrand(u):
            if u == 0:
                return 0.0  # Handle singularity at u=0
            iu = 1j * u
            denominator = alpha**2 - u**2 + 1j * (2 * alpha) * u
            if abs(denominator) < 1e-10:  # Avoid division by very small numbers
                return 0.0
            return (
                exp(-iu * log(K))
                * characteristic_function(u - alpha * 1j)
                / denominator
            ).real

        # Choose the appropriate integrand
        integrand = call_integrand if option_type.lower() == "call" else put_integrand

        # Set integration limits based on volatility and time to expiration
        # Higher volatility or longer time horizons need wider integration range
        integration_upper_limit = min(100, max(50, 20 / (sigma * sqrt(T))))

        try:
            # Perform numerical integration with adaptive algorithm and error control
            integral, error = integrate.quad(
                integrand,
                0,
                integration_upper_limit,
                limit=1000,
                epsabs=1e-8,
                epsrel=1e-8,
            )

            # Compute final price
            if option_type.lower() == "call":
                price = exp(-alpha * log(K)) * S * exp(-r * T) * integral / np.pi
            else:  # put
                price = exp(-alpha * log(K)) * S * exp(-r * T) * integral / np.pi + max(
                    K - S, 0
                )

            # Sanity check - if price is unreasonably high or negative, fall back to BS
            if price > 3 * S or price < 0:
                bs_result = BlackScholes.closed_form(option_type, S, K, T, r, sigma)
                price = bs_result["price"]
                error = 0.0
                note = "Fourier result out of bounds, using Black-Scholes instead"
            else:
                note = "Carr-Madan Fourier Transform"

        except Exception as e:
            # Fall back to Black-Scholes if integration fails
            bs_result = BlackScholes.closed_form(option_type, S, K, T, r, sigma)
            price = bs_result["price"]
            error = 0.0
            note = f"Integration failed: {str(e)[:50]}. Using Black-Scholes instead."

        # Perform closed-form calculation for comparison
        bs_result = BlackScholes.closed_form(option_type, S, K, T, r, sigma)

        elapsed_time = time.time() - start_time
        # Ensure elapsed_time is never zero to avoid display issues
        if elapsed_time < 0.000001:
            elapsed_time = 0.000001

        return {
            "price": price,
            "methodology": "Fourier Transform",
            "calculation_time": round(elapsed_time * 1000, 3),
            "integration_error": round(error, 8),
            "bs_difference": round(price - bs_result["price"], 6),
            "damping_factor": alpha,
            "note": note,
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
        antithetic: bool = True,
        control_variate: bool = True,
    ) -> dict:
        """Monte Carlo simulation with variance reduction techniques"""
        if num_simulations <= 0:
            raise ValueError("num_simulations must be greater than zero")

        if T <= 0:
            return {
                "price": max(0, S - K) if option_type == "call" else max(0, K - S),
                "methodology": "Monte Carlo",
                "calculation_time": 0.001,
                "note": "Zero time to expiration",
            }

        start_time = time.time()

        # Generate random standard normal variables
        Z = np.random.standard_normal(size=num_simulations)

        # Apply antithetic variates technique to reduce variance if enabled
        if antithetic:
            Z = np.concatenate([Z, -Z])  # Mirror the random draws

        # Compute analytical price for control variate if enabled
        analytical_price = 0
        if control_variate:
            bs_result = BlackScholes.closed_form(option_type, S, K, T, r, sigma)
            analytical_price = bs_result["price"]

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

        # Apply control variate technique if enabled
        if control_variate and analytical_price > 0:
            expected_ST = S * np.exp(r * T)  # Expected future stock price
            cv = ST - expected_ST  # Control variate
            beta = -1.0  # Optimal beta can be estimated but -1 is a good approximation
            payoff = payoff + beta * cv  # Adjust payoff using control variate

        # Compute Monte Carlo estimate and standard error
        discounted_payoff = exp(-r * T) * payoff
        price = np.mean(discounted_payoff)
        std_error = np.std(discounted_payoff) / sqrt(num_simulations)
        conf_interval = 1.96 * std_error  # 95% confidence interval

        # If control variate was used, adjust the final price
        if control_variate and analytical_price > 0:
            price = price - beta * (np.mean(ST) * exp(-r * T) - S)

        elapsed_time = time.time() - start_time

        # Ensure elapsed_time is never zero to avoid display issues
        if elapsed_time < 0.000001:
            elapsed_time = 0.000001

        # Perform closed-form calculation for comparison
        bs_result = BlackScholes.closed_form(option_type, S, K, T, r, sigma)

        return {
            "price": price,
            "methodology": "Monte Carlo",
            "calculation_time": round(elapsed_time * 1000, 3),
            "num_simulations": num_simulations,
            "standard_error": round(std_error, 6),
            "confidence_interval": round(conf_interval, 6),
            "antithetic_variates": antithetic,
            "control_variates": control_variate,
            "bs_difference": round(price - bs_result["price"], 6),
        }
