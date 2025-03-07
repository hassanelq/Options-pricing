import yfinance as yf
import numpy as np
import pandas as pd
from datetime import datetime


def fetch_options_data(
    symbols: list,
    expiration: str,
    min_strike: float,
    max_strike: float,
    option_type: str = "both",
    total_results: int = 10,
):
    """
    Fetches stock price and selects the best available option chain data for multiple symbols.

    Parameters:
    - symbols (list): List of stock ticker symbols (e.g., ["AAPL", "TSLA"]).
    - expiration (str): The expiration date in YYYY-MM-DD format.
    - min_strike (float): Minimum strike price.
    - max_strike (float): Maximum strike price.
    - option_type (str): "call", "put", or "both".
    - total_results (int): Maximum total number of results to return.

    Returns:
    - list: Contains the best matching options for each symbol, distributed equally.
    """
    try:
        results = []
        num_per_symbol = max(
            1, total_results // len(symbols)
        )  # Even distribution per symbol

        for symbol in symbols:
            stock = yf.Ticker(symbol)

            # Get real-time stock price
            history = stock.history(period="1d")
            if history.empty:
                continue
            stock_price = history["Close"].iloc[-1]

            # Check if expiration date exists for this stock
            if expiration not in stock.options:
                continue

            # Fetch the option chain for the specific expiration date
            options = stock.option_chain(expiration)

            # Select calls or puts or both
            calls = options.calls if option_type in ["call", "both"] else pd.DataFrame()
            puts = options.puts if option_type in ["put", "both"] else pd.DataFrame()

            # Combine calls & puts if needed
            option_table = pd.concat([calls, puts], ignore_index=True)

            # Filter by strike price range
            filtered_options = option_table[
                (option_table["strike"] >= min_strike)
                & (option_table["strike"] <= max_strike)
            ]

            # Select the "best" options: prioritize by open interest & volume
            if not filtered_options.empty:
                filtered_options = filtered_options.sort_values(
                    by=["openInterest", "volume"], ascending=False
                )

                selected_options = filtered_options.head(
                    num_per_symbol
                )  # Pick top results

                # Extract relevant data
                for _, row in selected_options.iterrows():
                    option_category = (
                        "call" if row["strike"] in calls["strike"].values else "put"
                    )

                    results.append(
                        {
                            "symbol": symbol,
                            "stock_price": stock_price,
                            "expiration": expiration,
                            "strike_price": row["strike"],
                            "option_type": option_category,
                            "market_price": row["lastPrice"],
                            "implied_volatility": row["impliedVolatility"],
                            "open_interest": row["openInterest"],
                            "volume": row["volume"],
                        }
                    )

        return results if results else {"error": "No options found matching criteria"}

    except Exception as e:
        return {"error": str(e)}


# Example Test
# print(fetch_best_options(["AAPL", "TSLA"], "2025-04-17", 100, 200, "both"))
