from fastapi import APIRouter, HTTPException
from models import black_scholes, heston, ornstein_uhlenbeck
from schemas import PricingRequest, PricingResult
import datetime

router = APIRouter()


@router.post("/price", response_model=PricingResult)
async def calculate_price(request: PricingRequest):
    T = (request.expiration - datetime.now()).days / 365
    result = {}

    try:
        if request.model_type == "black_scholes":
            if request.solution_type == "closed_form":
                result = black_scholes.BlackScholes.closed_form(
                    option_type=request.option_type,
                    S=request.underlying_price,
                    K=request.strike_price,
                    T=T,
                    r=request.risk_free_rate,
                    sigma=request.volatility,
                )
            elif request.solution_type == "fourier":
                result = black_scholes.BlackScholes.fourier_transform(...)
            elif request.solution_type == "monte_carlo":
                result = black_scholes.BlackScholes.monte_carlo(...)

        elif request.model_type == "heston":
            if request.solution_type == "characteristic":
                result = heston.Heston.characteristic_function(...)
            # ... other Heston solutions

        elif request.model_type == "ou":
            result = ornstein_uhlenbeck.OrnsteinUhlenbeck.fokker_planck(...)

        else:
            raise HTTPException(status_code=400, detail="Invalid model type")

    except NotImplementedError:
        raise HTTPException(status_code=501, detail="Solution not implemented")

    return PricingResult(
        price=result["price"],
        methodology=result["methodology"],
        # Add greeks here
    )
