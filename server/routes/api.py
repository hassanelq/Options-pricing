from fastapi import APIRouter, HTTPException
import datetime

from utils.fetch_data import get_market_data
from schemas import PricingRequest, PricingResult, OptionData
from models.option_models import BlackScholes, Heston

router = APIRouter()


@router.get("/market-data/{symbol}")
async def get_options(symbol: str, total_results: int = 10):
    data = get_market_data(symbol, total_results)
    if "error" in data:
        raise HTTPException(status_code=400, detail=data["error"])
    return data


@router.post("/price", response_model=PricingResult)
async def calculate_price(request: PricingRequest):
    # Convert expiration to time-to-maturity
    T = (request.expiration - datetime.now()).days / 365

    if request.model_type == "black_scholes":
        result = BlackScholes.calculate(
            option_type=request.option_type,
            S=request.underlying_price,
            K=request.strike_price,
            T=T,
            r=request.risk_free_rate,
            sigma=request.volatility,
        )
    elif request.model_type == "heston":
        result = Heston.calculate(...)  # Add Heston params
    else:
        raise HTTPException(status_code=400, detail="Invalid model type")

    return PricingResult(**result)
