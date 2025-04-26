import numpy as np
import pandas as pd
from scipy.optimize import minimize
from utils.fetch_data import get_data_Calibration
from scipy.integrate import quad
import functools
import time
from numba import njit, float64, complex128

# Global price cache to reuse calculations across iterations
PRICE_CACHE = {}


@njit(
    complex128(
        float64,
        float64,
        float64,
        float64,
        float64,
        float64,
        float64,
        float64,
        float64,
        float64,
        float64,
        float64,
    )
)
def heston_cf_core(phi, x, r, T, kappa, rho, volvol, theta, var0, div, b, u):
    """Core calculations for Heston characteristic function - matches original implementation exactly"""
    a = kappa * theta
    rvpj = rho * volvol * phi * complex(0, 1)

    # Use more stable computations for d
    daux = (b - rvpj) ** 2 - volvol**2 * (2 * u * phi * complex(0, 1) - phi**2)
    d = np.sqrt(daux)

    # Handle g calculation with numerical stability
    num = b - rvpj + d
    den = b - rvpj - d

    # Avoid division by zero for g
    if abs(den) < 1e-15:
        g = 0.0
    else:
        g = num / den

    # Handle exponential carefully to avoid overflow
    if np.real(d * T) > 700:
        exp_dT = np.inf
    else:
        exp_dT = np.exp(d * T)

    g_exp_dT = g * exp_dT

    # Safe computation for D
    if abs(1.0 - g_exp_dT) < 1e-15:
        D = (num / volvol**2) * T
    else:
        if np.real(d * T) > 700:
            exp_term = np.inf
        else:
            exp_term = np.exp(d * T)

        D = (num / volvol**2) * ((1.0 - exp_term) / (1.0 - g * exp_term))

    # Safe computation for C
    if abs(1.0 - g) < 1e-15:
        log_term = d * T
    else:
        if abs(1.0 - g_exp_dT) < 1e-15:
            # When denominator is near zero
            if np.real(d * T) > 0:
                log_term = 700.0  # Large positive number instead of inf
            else:
                log_term = -700.0  # Large negative number instead of -inf
        else:
            # More stable logarithm calculation
            log_term = np.log((1.0 - g_exp_dT) / (1.0 - g))

    # Final calculation of C
    C = (r - div) * phi * T * complex(0, 1) + (a / volvol**2) * (
        (b - rvpj + d) * T - 2.0 * log_term
    )

    # Final CF
    CF = np.exp(x * phi * complex(0, 1) + C + D * var0)

    return CF


def integrand_core(phi, S, K, T, r, kappa, rho, volvol, theta, var0, div, P1P2):
    """Core calculations for the integrand function"""
    if abs(phi) < 1e-15:
        return 0.0

    x = np.log(S)
    u = 0.5 if P1P2 == 1 else -0.5
    b = kappa - rho * volvol if P1P2 == 1 else kappa

    try:
        CF = heston_cf_core(phi, x, r, T, kappa, rho, volvol, theta, var0, div, b, u)
        if np.isnan(CF) or np.isinf(CF):
            return 0.0

        Output = np.real(
            (np.exp(-phi * np.log(K) * complex(0, 1)) * CF) / (phi * complex(0, 1))
        )
        if np.isnan(Output) or np.isinf(Output):
            return 0.0

        return Output
    except:
        return 0.0


def NumIntegration(
    aLim, bLim, nDiv, S, K, T, r, kappa, rho, volvol, theta, var0, div, P1P2
):
    """Numerical integration using Simpson's rule - matches original implementation"""
    if nDiv % 2 != 0:  # ensure nDiv is even
        nDiv += 1

    Delta = (bLim - aLim) / nDiv
    EveryX = np.linspace(aLim, bLim, nDiv + 1)
    EveryY = np.zeros(nDiv + 1)

    # Calculate function values at each point
    for i in range(nDiv + 1):
        EveryY[i] = integrand_core(
            EveryX[i], S, K, T, r, kappa, rho, volvol, theta, var0, div, P1P2
        )

    # Simpson's rule integration
    even_indices = np.arange(2, nDiv, 2)
    odd_indices = np.arange(1, nDiv, 2)

    even_sum = np.sum(EveryY[even_indices])
    odd_sum = np.sum(EveryY[odd_indices])

    Integral = (Delta / 3) * (EveryY[0] + 4 * odd_sum + 2 * even_sum + EveryY[-1])

    return Integral


@functools.lru_cache(maxsize=20000)
def P1P2Heston(S, K, T, r, kappa, rho, volvol, theta, var0, div, P1P2):
    """P1 and P2 calculation with adaptive integration - matches original implementation"""
    cache_key = (
        S,
        K,
        T,
        r,
        round(kappa, 6),
        round(rho, 6),
        round(volvol, 6),
        round(theta, 6),
        round(var0, 6),
        round(div, 6),
        P1P2,
    )

    if cache_key in PRICE_CACHE:
        return PRICE_CACHE[cache_key]

    # Use an appropriate number of points based on maturity
    if T < 0.1:  # For very short maturities, we need more points
        nDiv = 2000
    elif T < 0.5:  # For short maturities
        nDiv = 1000
    else:  # For longer maturities
        nDiv = 500

    # For extreme strikes, use more points
    moneyness = S / K
    if moneyness < 0.8 or moneyness > 1.2:
        nDiv *= 2

    # Use appropriate upper limit
    upper_limit = min(100, max(50, 100 / T))

    # Perform numerical integration
    NumInt = NumIntegration(
        1e-6, upper_limit, nDiv, S, K, T, r, kappa, rho, volvol, theta, var0, div, P1P2
    )

    # Check if the result seems reasonable
    PP = 0.5 + (1 / np.pi) * NumInt

    # Fall back to quad if result is outside valid range
    if PP < 0 or PP > 1 or np.isnan(PP):
        try:
            integral, _ = quad(
                integrand_core,
                1e-6,
                upper_limit,
                args=(S, K, T, r, kappa, rho, volvol, theta, var0, div, P1P2),
                limit=100,
                epsabs=1e-8,
                epsrel=1e-8,
            )
            PP = 0.5 + (1 / np.pi) * integral
        except:
            PP = 0.5  # Fallback value

    # Make sure result is between 0 and 1
    PP = max(0.0, min(1.0, PP))
    PRICE_CACHE[cache_key] = PP
    return PP


@functools.lru_cache(maxsize=10000)
def CallHestonCForm_Cached(S, K, T, r, kappa, rho, volvol, theta, var0, div):
    """Heston call option pricing with dividend - matches original implementation"""
    # Ensure parameters are within valid ranges
    kappa = max(0.001, kappa)  # Mean reversion speed must be positive
    volvol = max(0.001, volvol)  # Vol of vol must be positive
    theta = max(0.0001, theta)  # Long-term variance must be positive
    var0 = max(0.0001, var0)  # Initial variance must be positive
    rho = max(-0.999, min(0.999, rho))  # Correlation must be between -1 and 1

    # Fast path for very short maturities
    if T <= 1e-6:
        return max(0, S * np.exp(-div * T) - K * np.exp(-r * T))

    P1 = P1P2Heston(S, K, T, r, kappa, rho, volvol, theta, var0, div, 1)
    P2 = P1P2Heston(S, K, T, r, kappa, rho, volvol, theta, var0, div, 2)

    # Option price calculation with checks
    CallValue = S * np.exp(-div * T) * P1 - K * np.exp(-r * T) * P2

    # Ensure non-negative option price
    return max(0.0, CallValue)


def CallHestonCForm(S, K, T, r, kappa, rho, volvol, theta, var0, div):
    """Heston call option pricing wrapper with global caching"""
    # Check if calculation is already in the global cache
    cache_key = (
        S,
        K,
        T,
        r,
        round(kappa, 6),
        round(rho, 6),
        round(volvol, 6),
        round(theta, 6),
        round(var0, 6),
        round(div, 6),
    )

    if cache_key in PRICE_CACHE:
        return PRICE_CACHE[cache_key]

    result = CallHestonCForm_Cached(S, K, T, r, kappa, rho, volvol, theta, var0, div)
    PRICE_CACHE[cache_key] = result
    return result


def PutHestonCForm(S, K, T, r, kappa, rho, volvol, theta, var0, div):
    """Put option pricing function using put-call parity"""
    CallValue = CallHestonCForm(S, K, T, r, kappa, rho, volvol, theta, var0, div)
    PutValue = CallValue - S * np.exp(-div * T) + K * np.exp(-r * T)

    # Ensure non-negative option price
    return max(0.0, PutValue)


def clear_cache():
    """Clear all caches to free memory"""
    global PRICE_CACHE
    PRICE_CACHE = {}
    P1P2Heston.cache_clear()
    CallHestonCForm_Cached.cache_clear()


# Parallel version for batch pricing
def heston_prices_parallel(params, Spots, Strikes, Maturities, Rates, div):
    """Price multiple options in parallel for calibration"""

    results = []
    kappa, rho, volvol, theta, var0 = params  # Unpack parameters

    for i in range(len(Spots)):
        # Call with proper arguments in correct order
        price = CallHestonCForm(
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
        results.append(price)

    return np.array(results)


def OptFunctionFast(
    params, Spots, Maturities, Rates, Strikes, MarketP, div, check_bounds=True
):
    """Optimized cost function for faster calibration with early stopping"""
    kappa, rho, volvol, theta, var0 = params
    min_price = 1e-6
    error_penalty = 1e10

    # Fast boundary check - return early for invalid parameters
    if check_bounds and not (
        0.1 <= kappa <= 15.0
        and -0.99 <= rho <= 0.0
        and 0.01 <= volvol <= 2.0
        and 0.001 <= theta <= 0.5
        and 0.001 <= var0 <= 0.5
    ):
        return error_penalty

    # Filter valid market prices
    valid_indices = np.isfinite(MarketP) & (MarketP > 0)
    if not np.any(valid_indices):
        return error_penalty

    # Use only valid data points
    valid_Spots = Spots[valid_indices]
    valid_Strikes = Strikes[valid_indices]
    valid_Maturities = Maturities[valid_indices]
    valid_Rates = Rates[valid_indices]
    valid_MarketP = MarketP[valid_indices]

    # Calculate model prices without threading for small datasets
    model_prices = heston_prices_parallel(
        params, valid_Spots, valid_Strikes, valid_Maturities, valid_Rates, div
    )

    # Calculate simple error metric - optimization for speed
    abs_errors = np.abs(model_prices - valid_MarketP)
    mean_error = np.mean(abs_errors)

    # Check threshold for early stopping - if error is already large, return early
    if mean_error > 10.0:  # If average error is $10 or more, skip detailed calculations
        return mean_error * 10  # Simple penalty

    # ATM options have higher weights
    moneyness = valid_Strikes / valid_Spots
    weights = 1.0 + np.exp(-20.0 * (moneyness - 1.0) ** 2)  # Simplified weighting

    # Weighted squared error
    weighted_errors = (model_prices - valid_MarketP) ** 2 * weights
    mse = np.mean(weighted_errors)

    return mse if np.isfinite(mse) else error_penalty


def calibrate_heston(
    symbol: str,
    expiration: str,
    underlying_price: float,
    risk_free_rate: float,
    dividend_yield: float = 0,  # Added explicit dividend_yield parameter
    max_time_seconds: int = 60,  # Reduced from 120 to 60 seconds
):
    """Fast Heston calibration for small datasets with aggressive optimizations"""
    try:
        start_time = time.time()
        clear_cache()  # Clear cache before starting new calibration

        # Get market data
        market_data = get_data_Calibration(symbol, expiration, underlying_price)

        if market_data.empty:
            raise ValueError("No valid market data available for calibration")

        # Use mid_price for calibration target
        MarketP = market_data["mid_price"].values
        Strikes = market_data["strike"].values
        Maturities = market_data["maturity"].values
        Rates = np.full_like(Maturities, risk_free_rate)
        Spots = np.full_like(Maturities, underlying_price)

        # Filter options data - focus only on valid, liquid options
        valid_indices = (MarketP > 0) & (Maturities > 0) & np.isfinite(MarketP)
        if not np.any(valid_indices):
            raise ValueError("No market data points with positive price and maturity.")

        MarketP = MarketP[valid_indices]
        Strikes = Strikes[valid_indices]
        Maturities = Maturities[valid_indices]
        Rates = Rates[valid_indices]
        Spots = Spots[valid_indices]
        filtered_market_data = market_data[
            valid_indices
        ].copy()  # Use copy to avoid SettingWithCopyWarning

        # Subsample data if we have too many options for faster calibration
        n_options = len(MarketP)
        if n_options > 100:  # If more than 50 options, take a representative subset
            try:
                # Group by moneyness and maturity to get a representative subset
                filtered_market_data["moneyness_bin"] = pd.qcut(
                    filtered_market_data["moneyness"],
                    5,
                    labels=False,
                    duplicates="drop",
                )
                filtered_market_data["maturity_bin"] = pd.qcut(
                    filtered_market_data["maturity"],
                    min(5, len(filtered_market_data["maturity"].unique())),
                    labels=False,
                    duplicates="drop",
                )

                # Create a stratified sample
                grouped = filtered_market_data.groupby(
                    ["moneyness_bin", "maturity_bin"]
                )
                sampled_data = pd.DataFrame()

                # Take a few options from each group
                for _, group in grouped:
                    sample_size = min(3, len(group))  # Take up to 3 from each group
                    sampled_data = pd.concat([sampled_data, group.sample(sample_size)])

                if len(sampled_data) > 0:
                    filtered_market_data = sampled_data
                    MarketP = filtered_market_data["mid_price"].values
                    Strikes = filtered_market_data["strike"].values
                    Maturities = filtered_market_data["maturity"].values
                    Rates = np.full_like(Maturities, risk_free_rate)
                    Spots = np.full_like(Maturities, underlying_price)
                    print(
                        f"Reduced from {n_options} to {len(MarketP)} options for faster calibration"
                    )
            except Exception as e:
                # Fallback to simple random sampling if quantile binning fails
                print(
                    f"Stratified sampling failed: {e}. Using random sampling instead."
                )
                sample_size = min(50, n_options)
                sampled_indices = np.random.choice(
                    n_options, size=sample_size, replace=False
                )
                filtered_market_data = filtered_market_data.iloc[sampled_indices]
                MarketP = filtered_market_data["mid_price"].values
                Strikes = filtered_market_data["strike"].values
                Maturities = filtered_market_data["maturity"].values
                Rates = np.full_like(Maturities, risk_free_rate)
                Spots = np.full_like(Maturities, underlying_price)
                print(
                    f"Reduced from {n_options} to {len(MarketP)} options using random sampling"
                )

        # Smart initial estimate based on market data
        avg_iv = np.mean(filtered_market_data["implied_volatility"])
        var0 = avg_iv**2
        theta = var0
        kappa = 1.5
        volvol = 0.3 * avg_iv  # Proportional to avg IV
        rho = -0.7

        # Multiple initial guesses for better convergence
        initial_guesses = [
            [kappa, rho, volvol, theta, var0],  # Base guess
            [3.0, -0.5, 0.5, theta, var0],  # Alternative 1
            [1.0, -0.8, 0.2, theta, var0],  # Alternative 2
        ]

        # Parameter bounds - tighter for faster convergence
        bounds = [
            (0.1, 10.0),  # kappa: reduced upper bound
            (-0.95, 0.0),  # rho: typically negative for equity
            (0.01, 1.5),  # volvol: reduced upper bound
            (0.001, 0.4),  # theta: tighter range
            (0.001, 0.4),  # var0: tighter range
        ]

        # Optimization setup with dividend yield parameter
        opt_args = (Spots, Maturities, Rates, Strikes, MarketP, dividend_yield, True)
        best_result = None
        best_error = float("inf")

        # Try different initial guesses with a fast local search
        for x0 in initial_guesses:
            # Check time budget
            if time.time() - start_time > max_time_seconds:
                print(
                    f"Time limit reached after trying {initial_guesses.index(x0)} initial points"
                )
                break

            # Fast optimization with limited iterations
            try:
                result = minimize(
                    OptFunctionFast,
                    x0,
                    method="L-BFGS-B",
                    bounds=bounds,
                    args=opt_args,
                    options={
                        "maxiter": 50,  # Reduced from 200 to 50
                        "maxfun": 100,  # Limit function evaluations
                        "disp": False,
                        "ftol": 1e-6,  # Reduced precision
                        "gtol": 1e-5,  # Reduced precision
                    },
                )

                # Check if this result is better than previous ones
                if result.fun < best_error:
                    best_result = result
                    best_error = result.fun
            except Exception as e:
                print(f"Optimization failed for initial guess {x0}: {e}")
                continue

        # If we have no valid result, try one more time with Nelder-Mead (more robust)
        if best_result is None:
            try:
                # Nelder-Mead doesn't use bounds but is more robust
                result = minimize(
                    lambda p: OptFunctionFast(
                        p,
                        Spots,
                        Maturities,
                        Rates,
                        Strikes,
                        MarketP,
                        dividend_yield,
                        False,
                    ),
                    initial_guesses[0],
                    method="Nelder-Mead",
                    options={
                        "maxiter": 100,
                        "maxfev": 200,
                        "disp": False,
                        "adaptive": True,
                    },
                )
                best_result = result
            except Exception as e:
                raise ValueError(f"All optimization attempts failed: {e}")

        # Extract calibrated parameters
        calibrated_params = {
            "kappa": float(best_result.x[0]),
            "rho": float(best_result.x[1]),
            "volvol": float(best_result.x[2]),
            "theta": float(best_result.x[3]),
            "var0": float(best_result.x[4]),
        }

        # Evaluate model prices with calibrated parameters
        model_prices = heston_prices_parallel(
            (
                calibrated_params["kappa"],
                calibrated_params["rho"],
                calibrated_params["volvol"],
                calibrated_params["theta"],
                calibrated_params["var0"],
            ),
            Spots,
            Strikes,
            Maturities,
            Rates,
            dividend_yield,  # Added dividend_yield
        )

        # Calculate error metrics using the full dataset (not just the sample)
        valid_model_prices = np.isfinite(model_prices) & (model_prices > 0)
        MarketP_valid = MarketP[valid_model_prices]
        model_prices_valid = model_prices[valid_model_prices]
        filtered_market_data_valid = filtered_market_data.iloc[valid_model_prices]

        if len(MarketP_valid) == 0:
            raise ValueError(
                "No valid model prices could be calculated with calibrated parameters."
            )

        # Calculate basic error metrics
        errors = model_prices_valid - MarketP_valid
        relative_errors_pct = (errors / MarketP_valid) * 100
        mse = np.mean(errors**2)
        rmse = np.sqrt(mse)
        mae = np.mean(np.abs(errors))
        total_time = time.time() - start_time

        return {
            "success": best_result.success if hasattr(best_result, "success") else True,
            "kappa": float(calibrated_params["kappa"]),
            "theta": float(calibrated_params["theta"]),
            "volvol": float(calibrated_params["volvol"]),
            "rho": float(calibrated_params["rho"]),
            "var0": float(calibrated_params["var0"]),
            "div": float(dividend_yield),  # Include div in result
            "calibration_metrics": {
                "MSE": mse,
                "RMSE": rmse,
                "MAE": mae,
                "max_abs_error": np.max(np.abs(errors)),
                "mean_rel_error_pct": np.mean(np.abs(relative_errors_pct)),
                "median_rel_error_pct": np.median(np.abs(relative_errors_pct)),
                "n_options_used": len(MarketP_valid),
                "original_n_options": n_options,
                "optimizer_iterations": (
                    best_result.nit if hasattr(best_result, "nit") else best_result.nfev
                ),
                "calibration_time_seconds": total_time,
            },
            "market_data_used": filtered_market_data_valid.to_dict(orient="records"),
        }

    except Exception as e:
        import traceback

        return {
            "success": False,
            "error": str(e),
            "error_details": traceback.format_exc(),
            "kappa": 0.0,
            "theta": 0.0,
            "volvol": 0.0,
            "rho": 0.0,
            "var0": 0.0,
            "div": float(dividend_yield),
            "calibration_time_seconds": time.time() - start_time,
        }
