from pydantic import BaseModel


class OptionBulkRequest(BaseModel):
    symbol: str  # List of stock symbols
    total_results: int  # Maximum total number of results to return


class OptionBulkResponse(BaseModel):
    symbol: str
    stock_price: float
    expiration: str
    strike_price: float
    option_type: str
    market_price: float
    implied_volatility: float
