from fastapi import APIRouter, HTTPException
from models import black_scholes, heston, ornstein_uhlenbeck
from schemas import PricingRequest, PricingResult
import datetime
from utils.fetch_data import get_market_data
from schemas import PricingRequest, PricingResult

router = APIRouter()


@router.get("/market-data/{symbol}")
async def get_options(symbol: str, total_results: int = 12):
    data = get_market_data(symbol, total_results)
    if "error" in data:
        raise HTTPException(status_code=400, detail=data["error"])
    return data


@router.post("/price", response_model=PricingResult)
async def calculate_price(request: PricingRequest):
    # Common parameters for all models
    base_params = {
        "option_type": request.option_type,
        "S": request.underlying_price,
        "K": request.strike_price,
        "T": request.yearsToExpiration,
        "r": request.risk_free_rate,
        "sigma": request.volatility,
    }

    result = {}

    try:
        if request.model_type == "blackScholes":
            # Black-Scholes specific parameters
            bs_params = base_params.copy()

            if request.solution_type == "closedForm":
                result = black_scholes.BlackScholes.closed_form(**bs_params)
            elif request.solution_type == "fourier":
                result = black_scholes.BlackScholes.fourier_transform(**bs_params)
            elif request.solution_type == "monteCarlo":
                bs_params["num_simulations"] = request.monte_carlo_simulations or 10000
                result = black_scholes.BlackScholes.monte_carlo(**bs_params)

        elif request.model_type == "heston":
            # Heston-specific parameters
            heston_params = base_params.copy()
            heston_params.update(
                {
                    "kappa": request.kappa,  # Mean reversion rate
                    "theta": request.theta,  # Long-term variance
                    "xi": request.xi,  # Volatility of volatility
                    "rho": request.rho,  # Correlation
                    "v0": request.v0 or 0.04,  # Initial variance
                }
            )

            if request.solution_type == "characteristicFunction":
                result = heston.Heston.characteristic_function(**heston_params)
            elif request.solution_type == "fourier":
                result = heston.Heston.fourier_transform(**heston_params)
            elif request.solution_type == "monteCarlo":
                heston_params["num_simulations"] = (
                    request.monte_carlo_simulations or 10000
                )
                result = heston.Heston.monte_carlo(**heston_params)

        elif request.model_type == "ou":
            # OU-specific parameters
            ou_params = base_params.copy()
            ou_params.update(
                {
                    "theta": request.theta_ou,  # Long-term mean
                    "kappa": request.kappa_ou,  # Mean reversion rate
                    "xi": request.xi_ou,  # Volatility parameter
                }
            )

            if request.solution_type == "fokkerPlanck":
                result = ornstein_uhlenbeck.OrnsteinUhlenbeck.fokker_planck(**ou_params)
            elif request.solution_type == "fft":
                result = ornstein_uhlenbeck.OrnsteinUhlenbeck.fft(**ou_params)
            elif request.solution_type == "monteCarlo":
                ou_params["num_simulations"] = request.monte_carlo_simulations or 10000
                result = ornstein_uhlenbeck.OrnsteinUhlenbeck.monte_carlo(**ou_params)

        else:
            raise HTTPException(status_code=400, detail="Invalid model type")

    except NotImplementedError:
        raise HTTPException(status_code=501, detail="Solution not implemented")
    except TypeError as e:
        raise HTTPException(
            status_code=400, detail=f"Missing required parameter: {str(e)}"
        )

    return PricingResult(
        price=result["price"],
        methodology=result["methodology"],
        delta=result.get("delta", 0),
        gamma=result.get("gamma", 0),
        vega=result.get("vega", 0),
        theta=result.get("theta", 0),
        rho=result.get("rho", 0),
    )
