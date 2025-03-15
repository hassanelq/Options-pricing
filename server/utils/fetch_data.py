import yfinance as yf
import numpy as np
from concurrent.futures import ThreadPoolExecutor
from typing import List, Dict, Any


def get_market_data(symbol: str, total_results: int = 12) -> List[Dict[str, Any]]:
    try:
        stock = yf.Ticker(symbol)
        hist = stock.history(period="1d")
        stock_price = hist["Close"].iloc[-1]
        exp_dates = stock.options

        if not exp_dates:
            return {"error": "No expiration dates available"}

        # Ensure maximum spacing between selected expiration dates
        selected_exp_dates = []
        if len(exp_dates) >= 5:
            # Calculate the stride to get maximum separation
            total_dates_needed = 5  # We want 5 different expiration buckets
            stride = max(1, (len(exp_dates) - 1) // (total_dates_needed - 1))

            # Select dates with maximum gaps
            indices = [
                i * stride
                for i in range(total_dates_needed)
                if i * stride < len(exp_dates)
            ]
            if (
                len(indices) < total_dates_needed
                and len(exp_dates) > total_dates_needed
            ):
                # Make sure we include the last date if we have enough dates
                if indices[-1] != len(exp_dates) - 1:
                    indices[-1] = len(exp_dates) - 1

            selected_exp_dates = [exp_dates[i] for i in indices]
            print(
                f"Selected expiration dates with maximum spacing: {selected_exp_dates}"
            )
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

        # Process calls - take the highest volume calls from each expiration date
        for exp_date, data in all_options_data.items():
            calls = data["calls"]
            if not calls.empty:
                best_calls = calls.nlargest(
                    1, "volume"
                )  # Take only 1 per date to maximize spread
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

        # Process puts - take the highest volume puts from each expiration date
        for exp_date, data in all_options_data.items():
            puts = data["puts"]
            if not puts.empty:
                best_puts = puts.nlargest(
                    1, "volume"
                )  # Take only 1 per date to maximize spread
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

        # If we don't have enough options, try to get more from the available dates
        if len(call_results) < num_calls or len(put_results) < num_puts:
            for exp_date, data in all_options_data.items():
                # Get more calls if needed
                if len(call_results) < num_calls:
                    calls = data["calls"]
                    if not calls.empty:
                        # Skip options we've already selected
                        already_selected_strikes = [
                            r["strike_price"]
                            for r in call_results
                            if r["expiration"] == exp_date
                        ]
                        calls = calls[~calls["strike"].isin(already_selected_strikes)]
                        if not calls.empty:
                            best_calls = calls.nlargest(1, "volume")
                            for _, option in best_calls.iterrows():
                                call_results.append(
                                    {
                                        "symbol": symbol,
                                        "stock_price": stock_price,
                                        "expiration": exp_date,
                                        "strike_price": option["strike"],
                                        "option_type": "call",
                                        "market_price": option["lastPrice"],
                                        "implied_volatility": option[
                                            "impliedVolatility"
                                        ],
                                        "volume": option["volume"],
                                    }
                                )
                                if len(call_results) >= num_calls:
                                    break

                # Get more puts if needed
                if len(put_results) < num_puts:
                    puts = data["puts"]
                    if not puts.empty:
                        # Skip options we've already selected
                        already_selected_strikes = [
                            r["strike_price"]
                            for r in put_results
                            if r["expiration"] == exp_date
                        ]
                        puts = puts[~puts["strike"].isin(already_selected_strikes)]
                        if not puts.empty:
                            best_puts = puts.nlargest(1, "volume")
                            for _, option in best_puts.iterrows():
                                put_results.append(
                                    {
                                        "symbol": symbol,
                                        "stock_price": stock_price,
                                        "expiration": exp_date,
                                        "strike_price": option["strike"],
                                        "option_type": "put",
                                        "market_price": option["lastPrice"],
                                        "implied_volatility": option[
                                            "impliedVolatility"
                                        ],
                                        "volume": option["volume"],
                                    }
                                )
                                if len(put_results) >= num_puts:
                                    break

                if len(call_results) >= num_calls and len(put_results) >= num_puts:
                    break

        # Combine results
        combined_results = call_results + put_results

        return combined_results[:total_results]
    except Exception as e:
        return {"error": str(e)}
