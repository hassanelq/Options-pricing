import yfinance as yf
import pandas as pd
from typing import Dict, Any, List
import numpy as np
from datetime import datetime, timezone


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
        if len(exp_dates) >= 6:
            # Calculate the stride to get maximum separation
            total_dates_needed = 6  # We want 6 different expiration buckets
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


import yfinance as yf
from math import exp
import requests

FRED_API_KEY = ""
FRED_SERIES = {
    "1M": "DGS1MO",
    "3M": "DGS3MO",
    "6M": "DGS6MO",
    "1Y": "DGS1",
    "2Y": "DGS2",
}


def fetch_fred_rates():
    rates = {}
    for label, sid in FRED_SERIES.items():
        url = f"https://api.stlouisfed.org/fred/series/observations?series_id={sid}&api_key=0de8b88e8310c6ebbd66c2eaa2ccb03f&file_type=json&sort_order=desc&limit=1"
        try:
            val = requests.get(url).json()["observations"][0]["value"]
            if val != ".":
                rates[label] = float(val) / 100
        except:
            continue
    return rates


def get_rate_key(T):
    return (
        "1M"
        if T <= 1 / 12
        else "3M" if T <= 0.25 else "6M" if T <= 0.5 else "1Y" if T <= 1 else "2Y"
    )


def get_option_calibration_data(
    symbol, target_expiration_str, max_main=20, max_side=15, nside=4
):
    tk = yf.Ticker(symbol)
    expirations = pd.to_datetime(tk.options).date
    target_exp = pd.to_datetime(target_expiration_str).date()
    if target_exp not in expirations:
        raise ValueError("Target expiration not available.")

    idx = np.where(expirations == target_exp)[0][0]
    selected_dates = [
        expirations[i]
        for i in range(idx - nside - 1, idx + nside)
        if 0 <= i < len(expirations)
    ]

    spot = tk.history(period="1d")["Close"].iloc[-1]
    rates = fetch_fred_rates()
    today = datetime.today().date()
    data = []

    for expiry in selected_dates:
        try:
            df = tk.option_chain(expiry.isoformat()).calls
            df = df.dropna(
                subset=["bid", "ask", "impliedVolatility", "volume", "openInterest"]
            )
            df = df[(df.bid > 0) & (df.ask > 0)].copy()
            df["midPrice"] = (df.bid + df.ask) / 2

            T = (expiry - today).days / 365
            rate = rates.get(get_rate_key(T), 0.0)
            F = spot * exp(rate * T)

            atm_strike = df.loc[(df.strike - F).abs().idxmin(), "strike"]
            df["moneyness"] = (df.strike - atm_strike).abs()
            n = max_main if expiry == target_exp else max_side

            selected = df.nsmallest(n, "moneyness").copy()
            selected["maturityDate"] = expiry
            selected["maturity"] = T
            selected["rate"] = rate
            selected["forward"] = F
            data.append(
                selected[
                    [
                        "maturityDate",
                        "maturity",
                        "strike",
                        "midPrice",
                        "impliedVolatility",
                        "forward",
                        "rate",
                    ]
                ]
            )
        except:
            continue

    return pd.concat(data).reset_index(drop=True) if data else pd.DataFrame()
