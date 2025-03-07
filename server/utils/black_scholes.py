from math import log, sqrt, exp
from scipy.stats import norm


def black_scholes(
    S: float, K: float, T: float, r: float, sigma: float, option_type: str = "call"
) -> float:
    """
    Computes the Black-Scholes price for a European option.

    Parameters:
    - S (float): Current stock price
    - K (float): Strike price
    - T (float): Time to expiration (in years)
    - r (float): Risk-free interest rate (decimal form, e.g., 0.02 for 2%)
    - sigma (float): Volatility of the stock (standard deviation of returns)
    - option_type (str): "call" or "put"

    Returns:
    - float: Theoretical Black-Scholes option price
    """
    if T <= 0:
        return max(0, S - K) if option_type == "call" else max(0, K - S)

    d1 = (log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * sqrt(T))
    d2 = d1 - sigma * sqrt(T)

    if option_type == "call":
        price = S * norm.cdf(d1) - K * exp(-r * T) * norm.cdf(d2)
    else:
        price = K * exp(-r * T) * norm.cdf(-d2) - S * norm.cdf(-d1)

    return round(price, 4)
