from pydantic import BaseModel
from datetime import datetime


class MarketDataRequest(BaseModel):
    symbol: str
    total_results: int = 10


class PricingRequest(BaseModel):
    option_type: str
    underlying_price: float
    strike_price: float
    expiration: datetime
    risk_free_rate: float
    volatility: float
    model_type: str = "black_scholes"
    # Add other parameters as needed


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
