import yfinance as yf
import numpy as np
import pandas as pd
from typing import Dict, Tuple, Optional, Any, Union, List
from scipy.optimize import minimize
import datetime


def get_market_data(
    symbol: str,
    spot_price: float,
    min_volume: int = 10,
    max_spread_pct: float = 8.0,
    moneyness_range: Tuple[float, float] = (0.85, 1.15),
) -> List[Tuple[float, float, float, float, float, float]]:
    try:
        ticker = yf.Ticker(symbol)
        expirations = ticker.options
        result = []

        for expiration in expirations:
            calls = ticker.option_chain(expiration).calls

            calls = calls[
                ["strike", "bid", "ask", "volume", "openInterest", "impliedVolatility"]
            ].dropna()

            calls["spread"] = calls["ask"] - calls["bid"]
            calls["spreadPct"] = (
                calls["spread"] / ((calls["bid"] + calls["ask"]) / 2)
            ) * 100

            calls = calls[
                (calls["bid"] > 0)
                & (calls["ask"] > 0)
                & (calls["volume"] >= min_volume)
                & (calls["openInterest"] > 0)
                & (calls["spreadPct"] <= max_spread_pct)
            ]

            moneyness = calls["strike"] / spot_price
            calls = calls[
                (moneyness >= moneyness_range[0]) & (moneyness <= moneyness_range[1])
            ]

            # Calculate maturity
            today = datetime.today().date()
            expiration_date = pd.to_datetime(expiration).date()
            maturity = (expiration_date - today).days / 365.0

            for _, row in calls.iterrows():
                mid = (row["bid"] + row["ask"]) / 2
                result.append(
                    (
                        mid,
                        row["ask"],
                        maturity,
                        row["strike"],
                        row["impliedVolatility"],
                        row["volume"],
                    )
                )

        return result

    except Exception as e:
        raise RuntimeError(f"Failed to fetch market data: {str(e)}")


def HestonCF(S, T, r, phi, kappa, rho, volvol, theta, var0, div, P1P2):
    """Characteristic function for Heston model with dividend"""
    x = np.log(S)
    a = kappa * theta
    u = np.array([0.5, -0.5])[P1P2 - 1]
    b = np.array([kappa - rho * volvol, kappa])[P1P2 - 1]
    rvpj = rho * volvol * phi * 1j
    daux = np.power(rvpj - b, 2) - (volvol**2) * (2 * u * phi * 1j - (phi**2))
    d = np.sqrt(daux)
    g = (b - rvpj + d) / (b - rvpj - d)
    # Avoid division by zero
    epsilon = 1e-10
    g_exp_dT = g * np.exp(d * T)
    # Safe computation for D
    if abs(1 - g_exp_dT) < epsilon:
        # Handle the case where denominator is close to zero
        D = ((b - rvpj + d) / (volvol**2)) * T
    else:
        D = ((b - rvpj + d) / (volvol**2)) * ((1 - np.exp(d * T)) / (1 - g_exp_dT))

    # Safe computation for C
    if abs(1 - g) < epsilon:
        log_term = d * T
    else:
        log_term = np.log((1 - g_exp_dT) / (1 - g))

    C = (r - div) * phi * T * 1j + (a / (volvol**2)) * (
        (b - rvpj + d) * T - 2 * log_term
    )
    CF = np.exp(x * phi * 1j + C + D * var0)
    return CF


def IntFuncHeston(S, K, T, r, phi, kappa, rho, volvol, theta, var0, div, P1P2):
    """Integrand function for Heston model"""
    if abs(phi) < 1e-10:  # Avoid division by zero
        return 0

    CF = HestonCF(S, T, r, phi, kappa, rho, volvol, theta, var0, div, P1P2)
    Output = np.real((np.exp(-phi * np.log(K) * 1j) * CF) / (phi * 1j))
    return Output


def NumIntegration(
    Function, aLim, bLim, nDiv, S, K, T, r, kappa, rho, volvol, theta, var0, div, P1P2
):
    """numerical integration using Simpson's rule"""
    if nDiv % 2 != 0:  # ensure nDiv is even
        nDiv += 1

    Delta = (bLim - aLim) / nDiv
    EveryX = np.linspace(aLim, bLim, nDiv + 1)

    # Calculate function values
    EveryY = np.zeros(nDiv + 1)
    for i, phi in enumerate(EveryX):
        try:
            EveryY[i] = Function(
                S, K, T, r, phi, kappa, rho, volvol, theta, var0, div, P1P2
            )
        except Exception:
            # Handle computational errors by using previous value
            EveryY[i] = EveryY[i - 1] if i > 0 else 0

    # Check for NaN or inf values
    EveryY = np.nan_to_num(EveryY, nan=0.0, posinf=0.0, neginf=0.0)

    # Simpson's rule integration
    Integral = Delta / 3 * np.sum(EveryY[0:-1:2] + 4 * EveryY[1::2] + EveryY[2::2])

    return Integral


def P1P2Heston(S, K, T, r, kappa, rho, volvol, theta, var0, div, P1P2):
    """P1 and P2 calculation"""
    NumInt = NumIntegration(
        IntFuncHeston,
        1e-6,
        500,
        1000,
        S,
        K,
        T,
        r,
        kappa,
        rho,
        volvol,
        theta,
        var0,
        div,
        P1P2,
    )
    PP = 0.5 + (1 / np.pi) * NumInt
    PP = np.clip(PP, 0, 1)  # Ensure probability is between 0 and 1
    return PP


def CallHestonCForm(S, K, T, r, kappa, rho, volvol, theta, var0, div):
    """Heston call option pricing with dividend"""
    P1 = P1P2Heston(S, K, T, r, kappa, rho, volvol, theta, var0, div, 1)
    P2 = P1P2Heston(S, K, T, r, kappa, rho, volvol, theta, var0, div, 2)
    CallValue = S * np.exp(-div * T) * P1 - K * np.exp(-r * T) * P2
    return CallValue


def PutHestonCForm(S, K, T, r, kappa, rho, volvol, theta, var0, div):
    """put option pricing function using put-call parity"""
    CallValue = CallHestonCForm(S, K, T, r, kappa, rho, volvol, theta, var0, div)
    PutValue = CallValue - S * np.exp(-div * T) + K * np.exp(-r * T)
    return PutValue


def OptFunctionClosedF(params, Spots, Maturities, Rates, Strikes, MarketP):
    """Optimization function for parameter calibration"""
    kappa, rho, volvol, theta, var0 = params
    div = 0  # Assuming zero dividend

    # Apply parameter constraints within the function
    kappa = max(0.001, kappa)
    volvol = max(0.001, volvol)
    theta = max(0.0001, theta)
    var0 = max(0.0001, var0)
    rho = max(-0.999, min(0.999, rho))

    n = len(Spots)
    ModelP = np.zeros(n)

    for i in range(n):
        try:
            ModelP[i] = CallHestonCForm(
                Spots[i],
                Strikes[i],
                Maturities[i],
                Rates[i],
                kappa,
                rho,
                volvol,
                theta,
                var0,
                div,
            )
        except Exception:
            # Return a high error value if calculation fails
            return 1e10

    error = np.sum(np.power((ModelP - MarketP), 2))

    return error


def calibrate_heston(
    symbol: str,
    underlying_price: float,
    risk_free_rate: float,
    initial_guess: Dict[str, float] = None,
    bounds: Dict[str, Tuple[float, float]] = None,
    min_volume: int = 5,
    max_spread_pct: float = 10.0,
    moneyness_range: Tuple[float, float] = (0.7, 1.3),
):
    try:
        market_raw = get_market_data(
            symbol,
            underlying_price,
            min_volume,
            max_spread_pct,
            moneyness_range,
        )

        if len(market_raw) == 0:
            raise ValueError("No valid market data available for calibration")

        market_data = pd.DataFrame(
            market_raw,
            columns=["mid", "ask", "maturity", "strike", "impliedVolatility", "volume"],
        )

        Strikes = market_data["strike"].values
        Maturities = market_data["maturity"].values
        Rates = np.full_like(Maturities, risk_free_rate)
        Spots = np.full_like(Maturities, underlying_price)

        MarketP = market_data["ask"].values

        if initial_guess is None:
            initial_guess = {
                "kappa": 1.5,
                "theta": 0.03,
                "xi": 0.6,
                "rho": -0.4,
                "v0": 0.05,
            }

        if bounds is None:
            bounds = {
                "kappa": (0.05, 10.0),
                "theta": (0.001, 0.25),
                "xi": (0.001, 2.0),
                "rho": (-0.95, 0.95),
                "v0": (0.001, 0.5),
            }

        param_keys = ["kappa", "rho", "xi", "theta", "v0"]
        x0 = [initial_guess[k] for k in param_keys]
        param_bounds = [bounds[k] for k in param_keys]

        result = minimize(
            OptFunctionClosedF,
            x0,
            method="SLSQP",
            bounds=param_bounds,
            args=(Spots, Maturities, Rates, Strikes, MarketP),
            options={"maxiter": 100, "disp": False, "ftol": 1e-6},
        )

        calibrated_params = {param_keys[i]: result.x[i] for i in range(len(param_keys))}

        model_prices = np.array(
            [
                CallHestonCForm(
                    Spots[i],
                    Strikes[i],
                    Maturities[i],
                    Rates[i],
                    calibrated_params["kappa"],
                    calibrated_params["rho"],
                    calibrated_params["xi"],
                    calibrated_params["theta"],
                    calibrated_params["v0"],
                    0,
                )
                for i in range(len(Spots))
            ]
        )

        errors = model_prices - MarketP
        mse = np.mean(errors**2)
        rmse = np.sqrt(mse)
        mae = np.mean(np.abs(errors))

        return {
            "success": result.success,
            "kappa": float(calibrated_params["kappa"]),
            "theta": float(calibrated_params["theta"]),
            "xi": float(calibrated_params["xi"]),
            "rho": float(calibrated_params["rho"]),
            "v0": float(calibrated_params["v0"]),
            "calibration_metrics": {
                "MSE": mse,
                "RMSE": rmse,
                "MAE": mae,
                "max_error": np.max(np.abs(errors)),
                "mean_rel_error": np.mean(np.abs(errors) / MarketP * 100),
                "n_iterations": result.nfev,
                "status": result.status,
                "message": result.message,
                "success": result.success,
            },
            "market_data": market_data.to_dict(orient="records"),
        }

    except Exception as e:
        import traceback

        return {
            "success": False,
            "error": str(e),
            "error_details": traceback.format_exc(),
            "kappa": 0.0,
            "theta": 0.0,
            "xi": 0.0,
            "rho": 0.0,
            "v0": 0.0,
        }
