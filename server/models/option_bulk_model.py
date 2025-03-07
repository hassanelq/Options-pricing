from pydantic import BaseModel
from typing import List


class OptionBulkRequest(BaseModel):
    symbols: List[str]  # List of stock symbols
    expiration: str  #  expiration date (YYYY-MM-DD)
    min_strike: float  # Minimum strike price
    max_strike: float  # Maximum strike price
    option_type: str  # "call", "put", or "both"
    total_results: int  # Maximum total number of results to return


class OptionBulkResponse(BaseModel):
    symbol: str
    stock_price: float
    expiration: str
    strike_price: float
    option_type: str
    market_price: float
    implied_volatility: float
