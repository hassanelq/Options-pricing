from pydantic import BaseModel
from datetime import datetime
from typing import Literal


class MarketDataRequest(BaseModel):
    symbol: str
    total_results: int = 12


class PricingRequest(BaseModel):
    model_type: Literal["black_scholes", "heston", "ou"] = "black_scholes"
    solution_type: str  # "closed_form", "fourier", "monte_carlo", etc.
    option_type: str
    underlying_price: float
    strike_price: float
    expiration: datetime
    risk_free_rate: float
    volatility: float


class OptionData(BaseModel):
    symbol: str
    stock_price: float
    expiration: str
    strike_price: float
    option_type: str
    market_price: float
    implied_volatility: float


class PricingResult(BaseModel):
    price: float
    delta: float
    gamma: float
    vega: float
    theta: float
