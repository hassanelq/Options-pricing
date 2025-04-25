from typing import Optional
from pydantic import BaseModel, ConfigDict


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

    # Monte Carlo parameters
    monte_carlo_simulations: Optional[int] = None

    # Disable protected namespaces to avoid conflicts
    model_config = ConfigDict(protected_namespaces=())


class OptionData(BaseModel):
    symbol: str
    stock_price: float
    expiration: str
    strike_price: float
    option_type: str
    market_price: float
    implied_volatility: float
    volume: int


class PricingResult(BaseModel):
    price: float
    model_config = ConfigDict(extra="allow")  # Allow extra fields if needed


class CalibrationRequest(BaseModel):
    symbol: str
    option_type: str
    underlying_price: float
    expiration: str
    YearsToExpiration: float
    risk_free_rate: float
    volatility: float


class CalibrationResult(BaseModel):
    kappa: float
    theta: float
    xi: float
    rho: float
    v0: float
    model_config = ConfigDict(extra="allow")  # Allow extra fields if needed
