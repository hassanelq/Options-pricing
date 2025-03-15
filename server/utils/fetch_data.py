import yfinance as yf
import numpy as np
from concurrent.futures import ThreadPoolExecutor
from typing import List, Dict, Any


def get_market_data(symbol: str, total_results: int = 10) -> List[Dict[str, Any]]:
    try:
        stock = yf.Ticker(symbol)
        hist = stock.history(period="1d")
        stock_price = hist["Close"].iloc[-1]
        exp_dates = stock.options

        if not exp_dates:
            return {"error": "No expiration dates available"}

        # Select a diverse range of expiration dates
        if len(exp_dates) > 5:
            # Take dates with a good spread - near, middle, and far expirations
            selected_indices = [
                0,  # Nearest expiration
                len(exp_dates) // 4,  # 25% out
                len(exp_dates) // 2,  # Middle
                3 * len(exp_dates) // 4,  # 75% out
                len(exp_dates) - 1,  # Furthest expiration
            ]
            selected_exp_dates = [exp_dates[i] for i in selected_indices]
        else:
            selected_exp_dates = exp_dates

        num_calls = total_results // 2
        num_puts = total_results - num_calls

        call_results = []
        put_results = []

        # Fetch all options data first
        all_options_data = {}
        for exp_date in selected_exp_dates:
            try:
                option_chain = stock.option_chain(exp_date)
                all_options_data[exp_date] = {
                    "calls": option_chain.calls,
                    "puts": option_chain.puts,
                }
            except Exception as e:
                print(f"Error fetching options for {exp_date}: {str(e)}")

        # Process calls
        for exp_date, data in all_options_data.items():
            calls = data["calls"]
            if not calls.empty:
                best_calls = calls.nlargest(2, "volume")
                for _, option in best_calls.iterrows():
                    call_results.append(
                        {
                            "symbol": symbol,
                            "stock_price": stock_price,
                            "expiration": exp_date,
                            "strike_price": option["strike"],
                            "option_type": "call",
                            "market_price": option["lastPrice"],
                            "implied_volatility": option["impliedVolatility"],
                            "volume": option["volume"],
                        }
                    )
                    if len(call_results) >= num_calls:
                        break
            if len(call_results) >= num_calls:
                break

        # Process puts
        for exp_date, data in all_options_data.items():
            puts = data["puts"]
            if not puts.empty:
                best_puts = puts.nlargest(2, "volume")
                for _, option in best_puts.iterrows():
                    put_results.append(
                        {
                            "symbol": symbol,
                            "stock_price": stock_price,
                            "expiration": exp_date,
                            "strike_price": option["strike"],
                            "option_type": "put",
                            "market_price": option["lastPrice"],
                            "implied_volatility": option["impliedVolatility"],
                            "volume": option["volume"],
                        }
                    )
                    if len(put_results) >= num_puts:
                        break
            if len(put_results) >= num_puts:
                break

        # Combine results
        combined_results = call_results + put_results

        return combined_results[:total_results]
    except Exception as e:
        return {"error": str(e)}
