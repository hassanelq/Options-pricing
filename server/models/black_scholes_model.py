from pydantic import BaseModel


class BlackScholesRequest(BaseModel):
    stock_price: float
    strike_price: float
    expiration: str
    risk_free_rate: float
    implied_volatility: float
    option_type: str
    market_price: float


class BlackScholesResponse(BaseModel):
    black_scholes_price: float
    market_price: float
    mispricing: float
