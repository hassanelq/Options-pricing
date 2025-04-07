import yfinance as yf
import numpy as np
import pandas as pd
from typing import Dict, Any
from scipy.optimize import minimize
from math import exp, log, pi
from scipy.integrate import quad
from numba import jit
from numpy.lib.scimath import sqrt as csqrt  # use complex-safe sqrt


# ---- Get Options Market Data ----
def get_market_data(
    symbol: str, option_type: str, K: float, expiration: str
) -> pd.DataFrame:
    ticker = yf.Ticker(symbol)
    options_data = ticker.option_chain(expiration)

    if option_type == "put":
        data = options_data.puts
    elif option_type == "call":
        data = options_data.calls
    else:
        raise ValueError("Invalid option type. Choose 'put' or 'call'.")

    # Keep relevant columns and drop missing
    data = data[
        ["strike", "bid", "ask", "volume", "openInterest", "lastPrice"]
    ].dropna()

    # Filter for liquidity
    data = data[
        (data["bid"] > 0)
        & (data["ask"] > 0)
        & (data["openInterest"] > 0)
        & (data["volume"] > 0)
    ]

    # Moneyness filter
    if option_type == "put":
        data = data[data["strike"] < (K * 1.5)]
    else:
        data = data[data["strike"] > (K * 0.5)]

    # Compute mid price
    data["mid_price"] = (data["bid"] + data["ask"]) / 2.0

    # Sort by volume descending and keep top 20
    data = data.sort_values(by="volume", ascending=False).head(15).copy()

    # Compute weights based on volume
    total_volume = data["volume"].sum()
    if total_volume > 0:
        data["volume_weight"] = data["volume"] / total_volume
    else:
        data["volume_weight"] = 1 / len(data)

    return data[["strike", "mid_price", "volume_weight"]].reset_index(drop=True)


# ---- Heston Characteristic Function ----
def heston_cf(u, S, K, T, r, v0, kappa, theta, xi, rho):
    """
    Lewis (2001) version of the Heston characteristic function.
    v0 is the initial variance, xi is the vol-of-vol.
    """
    i = 1j
    # Compute d
    d = np.sqrt((kappa - rho * xi * i * u) ** 2 + xi**2 * (u**2 + i * u))

    # g function
    g = (kappa - rho * xi * i * u - d) / (kappa - rho * xi * i * u + d)

    # Exponential of -dT; handle big real parts carefully if needed
    exp_dt = np.exp(-d * T)

    # C part
    C = r * i * u * T + (kappa * theta / (xi**2)) * (
        (kappa - rho * xi * i * u - d) * T
        - 2.0 * np.log((1.0 - g * exp_dt) / (1.0 - g))
    )

    # D part
    D = (kappa - rho * xi * i * u - d) / (xi**2) * ((1.0 - exp_dt) / (1.0 - g * exp_dt))

    # Final characteristic function
    return np.exp(C + D * v0 + i * u * np.log(S / K))


# ---- Heston Model Price ----
def heston_price_fast(S, K, T, r, v0, kappa, theta, xi, rho, N=100, U_max=100.0):
    """
    Heston price for a European call (Lewis 2001 formula).
    Integrates once from 0 to U_max, returns the call price.
    """
    i = 1j
    du = U_max / N
    # We'll integrate at midpoints:  du/2, 3du/2, 5du/2, ...
    u_values = np.arange(du / 2.0, U_max + du / 2.0, du)

    # integrand in the real integral
    def integrand(u_val):
        phi = heston_cf(u_val, S, K, T, r, v0, kappa, theta, xi, rho)
        return np.real(np.exp(-i * u_val * np.log(K)) * phi / (i * u_val))

    # Numerically integrate
    vals = np.array([integrand(u_val) for u_val in u_values])
    integral = np.trapz(vals, dx=du)  # or do your own loop-sum
    integral /= np.pi

    # Lewis (2001) final call formula:
    #   Call = S - (K e^{-rT}/2) + K e^{-rT} * integral
    call_price = S - 0.5 * K * np.exp(-r * T) + K * np.exp(-r * T) * integral

    return call_price


# ---- Heston Calibration ----
def Calibrate(
    symbol: str,
    option_type: str,
    K: float,
    expiration: str,
    S: float,
    T: float,
    r: float,
    v0: float,
) -> Dict[str, Any]:
    """
    Example calibration that uses the new heston_price_fast
    and the single-integral approach from Lewis (2001).
    """
    data = get_market_data(symbol, option_type, K, expiration)
    print("data shape:", data.shape)

    def objective(params):
        kappa, theta, xi, rho = params
        error = 0.0
        # Evaluate MSE (or weighted SSE) across your market data
        for _, row in data.iterrows():
            call_price = heston_price_fast(
                S=S,
                K=row["strike"],
                T=T,
                r=r,
                v0=v0,
                kappa=kappa,
                theta=theta,
                xi=xi,
                rho=rho,
                # Possibly pass N=100, U_max=100, etc.
            )
            if option_type == "call":
                model_price = call_price
            else:
                model_price = call_price - S + row["strike"] * np.exp(-r * T)

            diff = model_price - row["mid_price"]
            error += row["volume_weight"] * (diff**2)
        return error

    # Initial guess + param bounds
    x0 = [1.0, 0.04, 0.5, -0.5]
    bounds = [(0.01, 5.0), (0.001, 1.0), (0.01, 2.0), (-0.99, 0.99)]

    try:
        result = minimize(
            objective, x0, method="Powell", bounds=bounds, options={"maxiter": 100}
        )
        if result.success:
            kappa, theta, xi, rho = result.x
            return {
                "kappa": kappa,
                "theta": theta,
                "xi": xi,
                "rho": rho,
            }
        else:
            print("⚠️ Optimization failed:")
            print("Message:", result.message)
            print("Function Value:", result.fun)
            print("Tried Parameters:", result.x)
            raise RuntimeError("Calibration failed.")
    except Exception as e:
        print("❌ Calibration crashed:", str(e))
        raise RuntimeError("Calibration failed due to internal error.")
