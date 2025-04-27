import numpy as np
import pandas as pd
import time
from datetime import datetime, timezone
from scipy.optimize import minimize, least_squares
import yfinance as yf
from scipy.integrate import quad

from utils.fetch_data import get_data_Calibration


# --- Heston Pricing Functions ---
def heston_characteristic_function(
    phi, S, K, T, r, kappa, rho, volvol, theta, var0, div, P1P2
):
    x = np.log(S)
    a = kappa * theta
    u = 0.5 if P1P2 == 1 else -0.5
    b = kappa - rho * volvol if P1P2 == 1 else kappa
    d = np.sqrt(
        (rho * volvol * phi * 1j - b) ** 2 - volvol**2 * (2 * u * phi * 1j - phi**2)
    )
    g = (b - rho * volvol * phi * 1j + d) / (b - rho * volvol * phi * 1j - d)
    C = (r - div) * phi * 1j * T + (a / volvol**2) * (
        (b - rho * volvol * phi * 1j + d) * T
        - 2 * np.log((1 - g * np.exp(d * T)) / (1 - g))
    )
    D = (
        (b - rho * volvol * phi * 1j + d)
        / volvol**2
        * (1 - np.exp(d * T))
        / (1 - g * np.exp(d * T))
    )
    return np.exp(C + D * var0 + 1j * phi * x)


def heston_call_price(S, K, T, r, kappa, rho, volvol, theta, var0, div):
    def integrand(phi, P1P2):
        cf = heston_characteristic_function(
            phi, S, K, T, r, kappa, rho, volvol, theta, var0, div, P1P2
        )
        return np.real(np.exp(-1j * phi * np.log(K)) * cf / (1j * phi))

    eps = 1e-6  # lower integration limit (avoids φ = 0)
    integral_P1 = quad(
        lambda phi: integrand(phi, 1), eps, 100, limit=200, epsabs=1e-8, epsrel=1e-8
    )[0]
    integral_P2 = quad(
        lambda phi: integrand(phi, 2), eps, 100, limit=200, epsabs=1e-8, epsrel=1e-8
    )[0]

    P1 = 0.5 + (1 / np.pi) * integral_P1
    P2 = 0.5 + (1 / np.pi) * integral_P2
    return max(0.0, S * np.exp(-div * T) * P1 - K * np.exp(-r * T) * P2)


def heston_put_price(S, K, T, r, kappa, rho, volvol, theta, var0, div):
    """Put option pricing function using put-call parity"""
    CallValue = heston_call_price(S, K, T, r, kappa, rho, volvol, theta, var0, div)
    PutValue = CallValue - S * np.exp(-div * T) + K * np.exp(-r * T)
    return PutValue


def heston_prices_parallel(params, Spots, Strikes, Maturities, Rates, div):
    kappa, rho, volvol, theta, var0 = params
    return np.array(
        [
            heston_call_price(S, K, T, r, kappa, rho, volvol, theta, var0, div)
            for S, K, T, r in zip(Spots, Strikes, Maturities, Rates)
        ]
    )


def OptFunctionFast(
    params, Spots, Maturities, Rates, Strikes, MarketP, div, check_bounds=True
):
    kappa, rho, volvol, theta, var0 = params
    if check_bounds and not (
        0.1 <= kappa <= 15.0
        and -0.99 <= rho <= 0.0
        and 0.01 <= volvol <= 2.0
        and 0.001 <= theta <= 0.5
        and 0.001 <= var0 <= 0.5
    ):
        return 1e10

    valid = np.isfinite(MarketP) & (MarketP > 0)
    if not np.any(valid):
        return 1e10

    Spots, Strikes, Maturities, Rates, MarketP = (
        Spots[valid],
        Strikes[valid],
        Maturities[valid],
        Rates[valid],
        MarketP[valid],
    )
    model_prices = heston_prices_parallel(
        params, Spots, Strikes, Maturities, Rates, div
    )

    abs_errors = np.abs(model_prices - MarketP)
    if np.mean(abs_errors) > 10.0:
        return np.mean(abs_errors) * 10

    moneyness = Strikes / Spots
    weights = 1.0 + np.exp(-20.0 * (moneyness - 1.0) ** 2)
    weighted_errors = (model_prices - MarketP) ** 2 * weights

    return np.mean(weighted_errors) if np.isfinite(np.mean(weighted_errors)) else 1e10


# --- Calibration Function ---
def calibrate_heston(
    symbol: str,
    expiration: str,
    underlying_price: float,
    risk_free_rate: float,
    dividend_yield: float = 0,
    max_options=100,
    max_time=300,
    methods=["LM"],
):

    if methods is None:
        methods = [
            # local gradient-based
            # "L-BFGS-B",
            # constrained gradient
            # "SLSQP",
            # Levenberg-Marquardt (least_squares, NO bounds)
            "LM",
        ]

    start = time.time()

    data = get_data_Calibration(
        symbol, expiration, underlying_price, max_options, min_maturity_days=5
    )

    print(f"Data loaded in {time.time() - start:.2f} seconds")
    print(f"Market data used: {len(data)} options")

    if data.empty:
        return {"success": False, "error": "No data found"}

    Spots = np.full_like(data.maturity.values, underlying_price, dtype=float)
    Strikes = data.strike.values
    Maturities = data.maturity.values
    Rates = np.full_like(data.maturity.values, risk_free_rate, dtype=float)
    MarketP = data.mid.values

    avg_iv = np.mean(data.impliedVolatility)
    init_var = avg_iv**2
    initial_guess = [1.5, -0.7, 0.3 * avg_iv, init_var, init_var]
    bounds = [(0.1, 10.0), (-0.95, 0.0), (0.01, 1.5), (0.001, 0.4), (0.001, 0.4)]

    results = []
    for method in methods:
        if time.time() - start > max_time:
            break
        try:
            t0 = time.time()  # <--- start timing this method
            if method == "LM":

                def residuals(p, Spots, Strikes, Mats, Rates, Market, div):
                    kappa, rho, volvol, theta, var0 = p
                    if not (
                        0.1 <= kappa <= 15.0
                        and -0.99 <= rho <= 0.0
                        and 0.01 <= volvol <= 2.0
                        and 0.001 <= theta <= 0.5
                        and 0.001 <= var0 <= 0.5
                    ):
                        return np.full_like(Market, 1e5)
                    model = heston_prices_parallel(p, Spots, Strikes, Mats, Rates, div)
                    return model - Market

                res = least_squares(
                    residuals,
                    initial_guess,
                    method="lm",
                    args=(Spots, Strikes, Maturities, Rates, MarketP, dividend_yield),
                    xtol=1e-12,
                    ftol=1e-12,
                    gtol=1e-12,
                )
                xopt = res.x
                model_prices = heston_prices_parallel(
                    xopt, Spots, Strikes, Maturities, Rates, dividend_yield
                )

            else:
                res = minimize(
                    OptFunctionFast,
                    initial_guess,
                    method=method,
                    bounds=bounds,
                    args=(
                        Spots,
                        Maturities,
                        Rates,
                        Strikes,
                        MarketP,
                        dividend_yield,
                        True,
                    ),
                    options={"maxiter": 500, "disp": False},
                )
                xopt = res.x
                model_prices = heston_prices_parallel(
                    xopt, Spots, Strikes, Maturities, Rates, dividend_yield
                )

            elapsed = time.time() - t0  # <--- end timing this method
            mse = np.mean((model_prices - MarketP) ** 2)
            results.append((method, mse, xopt, elapsed))
            print(f"Method: {method:11s} | MSE: {mse:.6f} | Time: {elapsed:.2f} s")
        except Exception as err:
            print(f"Method: {method:11s} failed → {err}")
            continue

    if not results:
        return {
            "success": False,
            "kappa": 0.0,
            "theta": 0.0,
            "volvol": 0.0,
            "rho": 0.0,
            "var0": 0.0,
            "error": "All methods failed",
        }

    best_method, best_mse, best_params, best_time = min(results, key=lambda t: t[1])

    return {
        "success": True,
        "kappa": float(best_params[0]),
        "theta": float(best_params[3]),
        "volvol": float(best_params[2]),
        "rho": float(best_params[1]),
        "var0": float(best_params[4]),
        "best_method": best_method,
        "mse": best_mse,
        "calibration_time": time.time() - start,
        "calibration_metrics": [
            {"method": m, "mse": e, "params": p.tolist(), "time": t}
            for m, e, p, t in results
        ],
    }
