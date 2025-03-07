from fastapi import APIRouter, HTTPException
from utils.fetch_data import fetch_option_data
from utils.black_scholes import black_scholes
from models.option_model import OptionRequest, OptionResponse

router = APIRouter()


@router.get("/option-pricing", response_model=OptionResponse)
def get_option_pricing(
    symbol: str,
    expiration: str,
    strike_price: float,
    option_type: str = "call",
    risk_free_rate: float = 0.02,
):
    """
    API endpoint to fetch real-time option data and compute Black-Scholes price.

    Parameters:
    - symbol (str): Stock ticker (e.g., "AAPL")
    - expiration (str): Expiration date in YYYY-MM-DD
    - strike_price (float): Desired strike price
    - option_type (str): "call" or "put"
    - risk_free_rate (float): Risk-free interest rate (default 2%)

    Returns:
    - JSON response containing stock price, closest strike, market price, Black-Scholes price, and implied volatility.
    """
    data = fetch_option_data(symbol, expiration, strike_price, option_type)

    if "error" in data:
        raise HTTPException(status_code=400, detail=data["error"])

    # Calculate time to expiration in years
    from datetime import datetime

    today = datetime.today().date()
    expiration_date = datetime.strptime(expiration, "%Y-%m-%d").date()
    time_to_expiration = (expiration_date - today).days / 365.0

    # Compute Black-Scholes price
    bs_price = black_scholes(
        S=data["stock_price"],
        K=data["strike_price"],
        T=time_to_expiration,
        r=risk_free_rate,
        sigma=data["implied_volatility"],
        option_type=option_type,
    )

    data["black_scholes_price"] = bs_price
    data["mispricing"] = round(data["market_price"] - bs_price, 4)

    return data
