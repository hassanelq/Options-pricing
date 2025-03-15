from pydantic import BaseModel
from datetime import datetime
from typing import Literal
from typing import Optional


class MarketDataRequest(BaseModel):
    symbol: str
    total_results: int = 12


class PricingRequest(BaseModel):
    # Common parameters
    model_type: str
    solution_type: str
    option_type: str
    underlying_price: float
    strike_price: float
    yearsToExpiration: float
    risk_free_rate: float
    volatility: float

    # Heston parameters
    kappa: Optional[float] = None  # Mean reversion rate
    theta: Optional[float] = None  # Long-term variance
    xi: Optional[float] = None  # Vol of vol
    rho: Optional[float] = None  # Correlation
    v0: Optional[float] = None  # Initial variance

    # OU parameters
    theta_ou: Optional[float] = None  # Long-term mean
    kappa_ou: Optional[float] = None  # Mean reversion rate
    xi_ou: Optional[float] = None  # Volatility

    # Monte Carlo parameters
    monte_carlo_simulations: Optional[int] = None


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
