from fastapi import APIRouter, HTTPException
from utils.black_scholes import black_scholes
from models.black_scholes_model import BlackScholesRequest, BlackScholesResponse

router = APIRouter()


@router.post("/black-scholes-pricing", response_model=BlackScholesResponse)
def calculate_black_scholes(request: BlackScholesRequest):
    """
    API endpoint to compute Black-Scholes option pricing for a selected option.

    Parameters:
    - stock_price (float): Current stock price.
    - strike_price (float): Strike price of the option.
    - expiration (str): Expiration date (YYYY-MM-DD).
    - risk_free_rate (float): Risk-free interest rate.
    - implied_volatility (float): Implied volatility of the option.
    - option_type (str): "call" or "put".

    Returns:
    - JSON response containing Black-Scholes price and mispricing.
    """
    from datetime import datetime

    today = datetime.today().date()
    expiration_date = datetime.strptime(request.expiration, "%Y-%m-%d").date()
    time_to_expiration = (expiration_date - today).days / 365.0  # Convert to years

    if time_to_expiration <= 0:
        raise HTTPException(
            status_code=400, detail="Expiration date must be in the future"
        )

    # Compute Black-Scholes price
    bs_price = black_scholes(
        S=request.stock_price,
        K=request.strike_price,
        T=time_to_expiration,
        r=request.risk_free_rate,
        sigma=request.implied_volatility,
        option_type=request.option_type,
    )

    mispricing = round(request.market_price - bs_price, 4)

    return {
        "black_scholes_price": bs_price,
        "market_price": request.market_price,
        "mispricing": mispricing,
    }
