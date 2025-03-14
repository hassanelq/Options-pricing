import yfinance as yf
import numpy as np
import pandas as pd
from datetime import datetime, timedelta


def fetch_options_data(
    symbol: str,
    total_results: int = 10,
):
    """
    Fetches stock price and selects the best available option chain data for a symbol,
    ensuring half are calls and half are puts with evenly spaced expiration dates.

    Parameters:
    - symbol (str): Stock symbol, e.g., "AAPL".
    - total_results (int): Total number of options to return (half calls, half puts).

    Returns:
    - list: Contains options distributed by type and expiration date.
    """
    try:
        results = []
        stock = yf.Ticker(symbol)

        # Get real-time stock price
        history = stock.history(period="1d")
        stock_price = history["Close"].iloc[-1]

        # Available expiration dates sorted
        expiration_dates = sorted(
            stock.options, key=lambda x: datetime.strptime(x, "%Y-%m-%d")
        )

        if len(expiration_dates) < 2:
            return {"error": "Not enough expiration dates available."}

        num_calls = total_results // 2
        num_puts = total_results - num_calls

        # Select evenly spaced expiration dates
        call_expirations = np.linspace(
            0, len(expiration_dates) - 1, num_calls, dtype=int
        )
        put_expirations = np.linspace(0, len(expiration_dates) - 1, num_puts, dtype=int)

        # Fetch options and organize them
        def fetch_options(expirations, option_type):
            opt_results = []
            for i in expirations:
                exp_date = expiration_dates[i]
                options = stock.option_chain(exp_date)
                option_table = options.calls if option_type == "call" else options.puts

                if not option_table.empty:
                    best_option = option_table.sort_values(
                        by=["openInterest", "volume"], ascending=False
                    ).head(1)
                    if not best_option.empty:
                        row = best_option.iloc[0]
                        opt_results.append(
                            {
                                "symbol": symbol,
                                "stock_price": stock_price,
                                "expiration": exp_date,
                                "strike_price": row["strike"],
                                "option_type": option_type,
                                "market_price": row["lastPrice"],
                                "implied_volatility": row["impliedVolatility"],
                                "open_interest": row["openInterest"],
                                "volume": row["volume"],
                            }
                        )
            return opt_results

        # Get calls and puts
        results.extend(fetch_options(call_expirations, "call"))
        results.extend(fetch_options(put_expirations, "put"))

        return results if results else {"error": "No options found matching criteria."}

    except Exception as e:
        return {"error": str(e)}


# Example Test
# print(fetch_options_data("AAPL", 10))
