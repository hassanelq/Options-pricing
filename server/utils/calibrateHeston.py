import numpy as np
import pandas as pd
import time
from datetime import datetime, timezone
from scipy.optimize import minimize, least_squares
import yfinance as yf
from scipy.integrate import quad

from utils.fetch_data import get_option_calibration_data, get_data_withoutR


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


def OptFunctionFast(
    params, Spots, Maturities, Rates, Strikes, MarketP, div, check_bounds=True
):
    kappa, rho, volvol, theta, var0 = params
    if check_bounds and not (
        0.1 <= kappa <= 15
        and -0.99 <= rho <= 0
        and 0.01 <= volvol <= 2
        and 0.001 <= theta <= 0.5
        and 0.001 <= var0 <= 0.5
    ):
        return 1e10

    mask = np.isfinite(MarketP) & (MarketP > 0)
    if not np.any(mask):
        return 1e10

    S, T, r, K, Pmkt = (
        Spots[mask],
        Maturities[mask],
        Rates[mask],
        Strikes[mask],
        MarketP[mask],
    )
    Pmodel = heston_prices_parallel(params, S, K, T, r, div)

    # Plain Squared Erro
    err = np.mean((Pmodel - Pmkt) ** 2)

    return err if np.isfinite(err) else 1e10


def Feller(x):
    kappa, rho, volvol, theta, var0 = x
    return 2 * kappa * theta - volvol**2


def calibrate_heston(
    symbol: str, expiration: str, underlying_price, risk_free_rate, div=0.0
):
    t0 = time.time()
    data = get_data_withoutR(
        symbol, expiration, underlying_price, max_main=5, max_side=3, nside=2
    )

    if data.empty:
        return {"success": False, "error": "No data found"}

    print(f"Data loaded in {time.time() - t0:.2f} seconds | {len(data)} options used")

    Strikes = data.strike.values
    Maturities = data.maturity.values
    Rates = np.full_like(Maturities, risk_free_rate)
    Spots = np.full_like(Maturities, underlying_price)
    MarketP = data.midPrice.values

    avg_iv = np.mean(data.impliedVolatility)
    var0 = avg_iv**2
    init = [1.5, -0.7, 0.6 * avg_iv, var0, var0]
    bounds = [(0.1, 10), (-0.95, 0.0), (0.01, 1.5), (0.001, 0.4), (0.001, 0.4)]
    cons = {"type": "ineq", "fun": Feller}

    t1 = time.time()
    result = minimize(
        OptFunctionFast,
        init,
        args=(Spots, Maturities, Rates, Strikes, MarketP, div, True),
        method="SLSQP",
        bounds=bounds,
        constraints=cons,
        options={"maxiter": 500, "disp": False},
    )
    elapsed = time.time() - t1

    xopt = result.x
    modelP = heston_prices_parallel(xopt, Spots, Strikes, Maturities, Rates, div)
    mse = np.mean((modelP - MarketP) ** 2)
    rmse = np.sqrt(mse)

    print(result)
    print(f"Calibration time: {elapsed:.2f}s | MSE: {mse:.6f}")
    print(f"Feller condition: {Feller(xopt):.8f} > 0")

    return {
        "result": result,
        "success": result.success,
        "mse": mse,
        "rmse": rmse,
        "kappa": round(xopt[0], 4),
        "rho": round(xopt[1], 4),
        "volvol": round(xopt[2], 4),
        "theta": round(xopt[3], 4),
        "var0": round(xopt[4], 4),
        "optimization_time": elapsed,
    }


# def calibrate_heston(
#     symbol: str, expiration: str, underlying_price, risk_free_rate, div=0.0
# ):
#     t0 = time.time()
#     data = get_option_calibration_data(
#         symbol, expiration, max_main=5, max_side=3, nside=2
#     )

#     if data.empty:
#         return {"success": False, "error": "No data found"}

#     print(f"Data loaded in {time.time() - t0:.2f} seconds | {len(data)} options used")

#     Spots = data.forward.values
#     Strikes = data.strike.values
#     Maturities = data.maturity.values
#     Rates = data.rate.values
#     MarketP = data.midPrice.values

#     avg_iv = np.mean(data.impliedVolatility)
#     var0 = avg_iv**2
#     init = [1.5, -0.7, 0.6 * avg_iv, var0, var0]
#     bounds = [(0.1, 10), (-0.95, 0.0), (0.01, 1.5), (0.001, 0.4), (0.001, 0.4)]
#     cons = {"type": "ineq", "fun": Feller}

#     t1 = time.time()
#     result = minimize(
#         OptFunctionFast,
#         init,
#         args=(Spots, Maturities, Rates, Strikes, MarketP, div, True),
#         method="SLSQP",
#         bounds=bounds,
#         constraints=cons,
#         options={"maxiter": 500, "disp": False},
#     )
#     elapsed = time.time() - t1

#     xopt = result.x
#     modelP = heston_prices_parallel(xopt, Spots, Strikes, Maturities, Rates, div)
#     mse = np.mean((modelP - MarketP) ** 2)
#     rmse = np.sqrt(mse)

#     print(result)
#     print(f"Calibration time: {elapsed:.2f}s | MSE: {mse:.6f}")
#     print(f"Feller condition: {Feller(xopt):.8f} > 0")

#     return {
#         "result": result,
#         "success": result.success,
#         "mse": mse,
#         "rmse": rmse,
#         "kappa": round(xopt[0], 4),
#         "rho": round(xopt[1], 4),
#         "volvol": round(xopt[2], 4),
#         "theta": round(xopt[3], 4),
#         "var0": round(xopt[4], 4),
#         "optimization_time": elapsed,
#     }
