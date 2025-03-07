import yfinance as yf
import numpy as np
import pandas as pd


def fetch_option_data(
    symbol: str, expiration: str, strike_price: float, option_type: str = "call"
):
    """
    Fetches stock price and closest available option chain data for a given symbol and expiration date.

    Parameters:
    - symbol (str): Stock ticker symbol (e.g., "AAPL").
    - expiration (str): Expiration date of the option in YYYY-MM-DD format.
    - strike_price (float): The desired strike price of the option.
    - option_type (str): "call" or "put".

    Returns:
    - dict: Contains stock price, closest available strike price, market option price, implied volatility.
    """
    try:
        # Get stock data
        stock = yf.Ticker(symbol)

        # Ensure stock price data is available
        history = stock.history(period="1d")
        if history.empty:
            return {"error": "No stock price data available"}
        stock_price = history["Close"].iloc[-1]

        # Check if expiration date is valid
        if expiration not in stock.options:
            return {"error": f"Expiration date {expiration} is not available"}

        # Get option chain for the expiration date
        options = stock.option_chain(expiration)

        # Select calls or puts
        option_table = options.calls if option_type.lower() == "call" else options.puts

        # Get the available strike prices
        available_strikes = option_table["strike"].values

        if len(available_strikes) == 0:
            return {"error": "No options available for this expiration date"}

        # Find the closest strike price
        closest_strike = min(available_strikes, key=lambda x: abs(x - strike_price))

        # Retrieve the option data for the closest strike price
        option_data = option_table[option_table["strike"] == closest_strike]

        if option_data.empty:
            return {"error": "Strike price data unavailable"}

        # Extract necessary data
        market_price = option_data["lastPrice"].values[0]
        implied_volatility = option_data["impliedVolatility"].values[0]

        return {
            "stock_price": stock_price,
            "strike_price": closest_strike,
            "expiration": expiration,
            "option_type": option_type,
            "market_price": market_price,
            "implied_volatility": implied_volatility,
        }

    except Exception as e:
        return {"error": str(e)}


# print(fetch_option_data("AAPL", "2025-04-17", 150.0, "call"))
