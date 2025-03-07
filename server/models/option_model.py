from pydantic import BaseModel


class OptionRequest(BaseModel):
    symbol: str
    expiration: str
    strike_price: float
    option_type: str


class OptionResponse(BaseModel):
    stock_price: float
    strike_price: float
    expiration: str
    option_type: str
    market_price: float
    implied_volatility: float
    black_scholes_price: float
    mispricing: float
