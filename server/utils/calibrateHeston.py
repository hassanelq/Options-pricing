import yfinance as yf
import numpy as np
import pandas as pd
from typing import Dict, Tuple, Optional, Any, Union, List
from scipy.optimize import least_squares
import matplotlib.pyplot as plt


def get_market_data(
    symbol: str,
    option_type: str,
    K: float,
    expiration: str,
) -> pd.DataFrame:
    """
    Returns DataFrame with option market data after filtering for liquidity and moneyness.

    Parameters:
    -----------
    symbol : str
        Ticker symbol
    option_type : str
        'put' or 'call'
    K : float
        Reference strike price (usually spot price or ATM strike)
    expiration : str
        Option expiration date in 'YYYY-MM-DD' format

    Returns:
    --------
    pd.DataFrame
        DataFrame with columns: strike, mid_price, volume_weight
    """
    try:
        ticker = yf.Ticker(symbol)
        options_data = ticker.option_chain(expiration)

        if option_type.lower() == "put":
            data = options_data.puts
        elif option_type.lower() == "call":
            data = options_data.calls
        else:
            raise ValueError("option_type must be 'put' or 'call'")

        # Basic data cleaning
        data = data[
            ["strike", "bid", "ask", "volume", "openInterest", "lastPrice"]
        ].dropna()

        # Liquidity filters
        data = data[
            (data["bid"] > 0)
            & (data["ask"] > 0)
            & (data["volume"] > 0)
            & (data["openInterest"] > 0)
        ]

        if len(data) == 0:
            raise ValueError("No liquid options found after filtering")

        # Moneyness filter
        moneyness = data["strike"] / K
        moneyness_range: Tuple[float, float] = (
            0.8,
            1.2,
        )  #  Min and max moneyness to consider (strike/K)
        data = data[
            (moneyness >= moneyness_range[0]) & (moneyness <= moneyness_range[1])
        ]

        if len(data) == 0:
            raise ValueError("No options in specified moneyness range")

        # Compute mid prices and weights
        data["mid_price"] = (data["bid"] + data["ask"]) / 2

        # Volume-based weights for calibration
        data["volume_weight"] = data["volume"] / data["volume"].sum()

        return data[["strike", "mid_price", "volume_weight"]].copy()

    except Exception as e:
        raise RuntimeError(f"Failed to fetch market data: {str(e)}")


def _heston_cf(
    u: np.ndarray,
    T: float,
    r: float,
    v0: float,
    kappa: float,
    theta: float,
    xi: float,
    rho: float,
) -> np.ndarray:
    """
    Heston characteristic function for log-stock price.
    Implements the closed-form solution of Heston's characteristic function.

    Parameters:
    -----------
    u : np.ndarray
        Array of complex frequencies
    T : float
        Time to maturity in years
    r : float
        Risk-free interest rate
    v0 : float
        Initial variance
    kappa : float
        Mean reversion speed
    theta : float
        Long-term variance
    xi : float
        Volatility of variance
    rho : float
        Correlation between stock and variance processes

    Returns:
    --------
    np.ndarray
        Complex array of characteristic function values
    """
    # Use vectorized operations for efficiency
    d = np.sqrt((kappa - 1j * rho * xi * u) ** 2 + xi**2 * (u**2 + 1j * u))
    g = (kappa - 1j * rho * xi * u - d) / (kappa - 1j * rho * xi * u + d)

    exp_dt = np.exp(-d * T)
    term1 = (1 - g * exp_dt) / (1 - g)

    D = (kappa - 1j * rho * xi * u - d) / xi**2 * ((1 - exp_dt) / (1 - g * exp_dt))
    C = (
        kappa
        * theta
        / xi**2
        * ((kappa - 1j * rho * xi * u - d) * T - 2 * np.log(term1))
    )

    return np.exp(C + D * v0 + 1j * u * r * T)


def fft_option_price(
    S: float,
    K: Union[float, np.ndarray],
    T: float,
    r: float,
    v0: float,
    kappa: float,
    theta: float,
    xi: float,
    rho: float,
    option_type: str = "call",
    N: int = 2**14,  # Increased precision
    alpha: float = 1.5,
) -> Union[float, np.ndarray]:
    """
    Carr-Madan FFT pricing method for European options under Heston model.

    Parameters:
    -----------
    S : float
        Spot price
    K : float or np.ndarray
        Strike price(s)
    T : float
        Time to maturity in years
    r : float
        Risk-free interest rate
    v0, kappa, theta, xi, rho : float
        Heston model parameters
    option_type : str
        'call' or 'put'
    N : int
        Number of FFT grid points (power of 2)
    alpha : float
        Damping factor

    Returns:
    --------
    float or np.ndarray
        Option price(s) in currency units
    """
    # FFT parameters
    eta = 0.1  # Smaller step size for better accuracy
    lambda_ = 2 * np.pi / (N * eta)
    beta = -lambda_ * N / 2

    # Create grid for integration
    u = np.arange(N)
    ku = beta + lambda_ * u
    v = eta * u

    # Damping factor adjustment
    v_adj = v - (alpha + 1) * 1j

    # Compute characteristic function values
    cf_values = _heston_cf(v_adj, T, r, v0, kappa, theta, xi, rho)

    # Carr-Madan adjustment
    psi = (
        np.exp(-r * T)
        * cf_values
        / (alpha**2 + alpha - v**2 + 1j * (2 * alpha + 1) * v)
    )

    # FFT computation
    fft_input = eta * np.exp(1j * beta * v) * psi
    fft_output = np.fft.fft(fft_input)
    prices = np.exp(-alpha * ku) * np.real(fft_output) / np.pi

    # Handle scalar or array of strikes
    if isinstance(K, (float, int)):
        # Interpolation for a single strike
        log_k = np.log(K / S)
        price = np.interp(log_k, ku, prices)

        # Put-Call parity adjustment
        if option_type.lower() == "put":
            price += K * np.exp(-r * T) - S

        return price
    else:
        # Vectorized interpolation for multiple strikes
        log_k = np.log(K / S)
        prices_interp = np.interp(log_k, ku, prices)

        # Put-Call parity adjustment
        if option_type.lower() == "put":
            prices_interp += K * np.exp(-r * T) - S

        return prices_interp


def calibrate_heston(
    symbol: str,
    option_type: str,
    expiration: str,
    T: float,
    S: float,
    r: float,
    v0: float,
    use_lm: bool = True,
    verbose: bool = False,
) -> Dict[str, Any]:
    """
    Calibrates Heston parameters to market data using optimization.

    Parameters:
    -----------
    symbol : str
        Ticker symbol
    option_type : str
        'put' or 'call'
    expiration : str
        Option expiration date in 'YYYY-MM-DD' format
    S : float
        Current spot price
    T : float
        Time to maturity in years
    r : float
        Risk-free interest rate
    use_lm : bool
        Whether to use Levenberg-Marquardt algorithm (no bounds supported)
    verbose : bool
        Whether to print progress information

    Returns:
    --------
    Dict[str, Any]
        Dictionary with calibration results and metrics
    """
    try:
        # Load market data
        market_data = get_market_data(
            symbol=symbol,
            option_type=option_type,
            K=S,
            expiration=expiration,
        )
        strikes = market_data["strike"].values
        market_prices = market_data["mid_price"].values
        weights = market_data["volume_weight"].values

        # Default parameter setup
        default_params = {
            "v0": 0.04,  # Initial variance
            "kappa": 1.5,  # Mean reversion speed
            "theta": 0.04,  # Long-term variance
            "xi": 0.3,  # Volatility of variance
            "rho": -0.7,  # Correlation
        }
        params = default_params
        param_order = ["v0", "kappa", "theta", "xi", "rho"]
        x0 = np.array([params[p] for p in param_order])

        # Default parameter bounds
        default_bounds = (
            [0.001, 0.1, 0.001, 0.01, -0.99],  # Lower bounds
            [0.5, 10.0, 0.5, 2.0, 0.99],  # Upper bounds
        )
        bounds = default_bounds

        # Objective function for optimization
        def objective(x):
            v0, kappa, theta, xi, rho = x
            # Calculate model prices for all strikes at once
            model_prices = fft_option_price(
                S, strikes, T, r, v0, kappa, theta, xi, rho, option_type
            )
            # Weight residuals by option volume
            residuals = (model_prices - market_prices) * weights
            return residuals

        if verbose:
            print(f"Starting calibration with initial parameters: {params}")
            print(
                f"Using {'Levenberg-Marquardt' if use_lm else 'Trust Region Reflective'} algorithm"
            )

        # Perform optimization
        if use_lm:
            # Levenberg-Marquardt (no bounds support)
            result = least_squares(
                objective, x0, method="lm", verbose=2 if verbose else 0
            )
        else:
            # Trust Region Reflective (with bounds)
            result = least_squares(
                objective,
                x0,
                bounds=bounds,
                method="trf",
                verbose=2 if verbose else 0,
                ftol=1e-8,
                xtol=1e-8,
                gtol=1e-8,
                max_nfev=100,
            )

        # Extract calibrated parameters
        calibrated_params = dict(zip(param_order, result.x))

        # Calculate model prices with final parameters
        model_prices = fft_option_price(
            S,
            strikes,
            T,
            r,
            calibrated_params["v0"],
            calibrated_params["kappa"],
            calibrated_params["theta"],
            calibrated_params["xi"],
            calibrated_params["rho"],
            option_type=option_type,
        )

        # Calculate errors
        errors = model_prices - market_prices
        mse = np.mean(errors**2)
        rmse = np.sqrt(mse)
        mae = np.mean(np.abs(errors))

        # Add data to market_data for visualization
        market_data["model_price"] = model_prices
        market_data["error"] = errors
        market_data["abs_error"] = np.abs(errors)
        market_data["rel_error"] = (
            np.abs(errors) / market_prices * 100
        )  # percentage error

        if verbose:
            print(f"Calibration completed with RMSE: {rmse:.6f}")
            print(f"Calibrated parameters: {calibrated_params}")

        return {
            "success": True,
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
                "mean_rel_error": np.mean(
                    np.abs(errors) / market_prices * 100
                ),  # Average percentage error
                "n_iterations": result.nfev,
                "status": result.status,
                "message": result.message,
                "success": result.success,
            },
            "market_data": market_data,
        }

    except Exception as e:
        import traceback

        error_details = traceback.format_exc()
        return {
            "success": False,
            "error": str(e),
            "error_details": error_details,
            "market_data": None,
            "calibration_metrics": None,
            "kappa": None,
            "theta": None,
            "xi": None,
            "rho": None,
            "v0": None,
        }


def plot_calibration_results(
    result: Dict[str, Any], title: str = "Heston Model Calibration Results"
):
    """
    Plots the calibration results for visual inspection.

    Parameters:
    -----------
    result : Dict[str, Any]
        Calibration result dictionary from calibrate_heston
    title : str
        Plot title
    """
    if not result["success"]:
        print(f"Calibration failed: {result['error']}")
        return

    market_data = result["market_data"]

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))

    # Price comparison plot
    ax1.plot(
        market_data["strike"], market_data["mid_price"], "o", label="Market Prices"
    )
    ax1.plot(
        market_data["strike"], market_data["model_price"], "-", label="Model Prices"
    )
    ax1.set_xlabel("Strike Price")
    ax1.set_ylabel("Option Price")
    ax1.set_title("Market vs Model Prices")
    ax1.legend()
    ax1.grid(True)

    # Error plot
    ax2.bar(market_data["strike"], market_data["rel_error"], width=2.0)
    ax2.set_xlabel("Strike Price")
    ax2.set_ylabel("Relative Error (%)")
    ax2.set_title(
        f"Calibration Errors (RMSE: {result['calibration_metrics']['RMSE']:.6f})"
    )
    ax2.grid(True)

    plt.suptitle(title)
    plt.tight_layout()

    # Print calibrated parameters
    metrics = result["calibration_metrics"]

    print("\nCalibrated Heston Parameters:")
    print(f"v0 (Initial variance): {result['v0']:.6f}")
    print(f"kappa (Mean reversion): {result['kappa']:.6f}")
    print(f"theta (Long-term variance): {result['theta']:.6f}")
    print(f"xi (Vol of vol): {result['xi']:.6f}")
    print(f"rho (Correlation): {result['rho']:.6f}")

    print("\nCalibration Metrics:")
    print(f"RMSE: {metrics['RMSE']:.6f}")
    print(f"MAE: {metrics['MAE']:.6f}")
    print(f"Mean Relative Error: {metrics['mean_rel_error']:.2f}%")
    print(f"Function Evaluations: {metrics['n_iterations']}")

    plt.show()


# Example usage
if __name__ == "__main__":
    # Example parameters
    symbol = "AAPL"
    option_type = "call"
    expiration = "2026-06-18"  # Format: YYYY-MM-DD
    S = 172.42  # Current spot price
    T = 1.19  # Time to maturity in years
    r = 0.0382  # Risk-free rate

    # Run calibration
    result = calibrate_heston(
        symbol=symbol,
        option_type=option_type,
        expiration=expiration,
        S=S,
        T=T,
        r=r,
        v0=0.04,  # Initial variance
        use_lm=False,  # Set to True to use Levenberg-Marquardt
        verbose=True,
    )

    # Plot results
    if result["success"]:
        plot_calibration_results(
            result, f"Heston Calibration for {symbol} {option_type.capitalize()}s"
        )
    else:
        print(f"Calibration failed: {result['error']}")
