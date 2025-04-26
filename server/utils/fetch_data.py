import yfinance as yf
import pandas as pd
from typing import Dict, Tuple, Any, List
from datetime import datetime
import bisect


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


def get_data_Calibration(
    symbol: str,
    target_expiration: str,  # Format 'YYYY-MM-DD'
    underlying_price: float,
) -> pd.DataFrame:
    try:
        # Fixed tuple definitions - remove the trailing commas
        min_volume: int = 5
        max_spread_pct: float = 10.0
        moneyness_range: Tuple[float, float] = (0.85, 1.15)
        num_expirations: int = 5  # Number of expirations we want on each side

        ticker = yf.Ticker(symbol)
        all_expirations = ticker.options
        result = []

        # Convert all expirations to datetime for comparison
        expiration_dates = [pd.to_datetime(exp).date() for exp in all_expirations]
        target_date = pd.to_datetime(target_expiration).date()

        # Find the index of the closest expiration to the target date
        closest_idx = bisect.bisect_left(expiration_dates, target_date)
        if closest_idx >= len(expiration_dates):
            closest_idx = len(expiration_dates) - 1

        # If the closest date is after the target, look one before
        if closest_idx > 0 and (
            abs((expiration_dates[closest_idx - 1] - target_date).days)
            < abs((expiration_dates[closest_idx] - target_date).days)
        ):
            closest_idx -= 1

        # Calculate how many dates we can get before the target
        available_before = closest_idx
        # Calculate how many dates we can get after the target (including the closest)
        available_after = len(expiration_dates) - closest_idx

        # Calculate how many we should get from each side
        to_take_before = min(available_before, num_expirations)
        to_take_after = min(available_after, num_expirations)

        # If we can't get enough from one side, get more from the other side
        extra_before = 0
        extra_after = 0

        if to_take_before < num_expirations:
            # We need to get extra from after side
            extra_after = min(
                available_after - to_take_after, num_expirations - to_take_before
            )

        if to_take_after < num_expirations:
            # We need to get extra from before side
            extra_before = min(
                available_before - to_take_before, num_expirations - to_take_after
            )

        # Calculate final indices
        start_idx = max(0, closest_idx - to_take_before - extra_before)
        end_idx = min(len(expiration_dates), closest_idx + to_take_after + extra_after)

        # Get the selected expirations
        selected_expirations = all_expirations[start_idx:end_idx]

        for expiration in selected_expirations:

            options = ticker.option_chain(expiration).calls

            options = options[
                ["strike", "bid", "ask", "volume", "openInterest", "impliedVolatility"]
            ].dropna()

            options["spread"] = options["ask"] - options["bid"]
            options["spreadPct"] = (
                options["spread"] / ((options["bid"] + options["ask"]) / 2)
            ) * 100

            options = options[
                (options["bid"] > 0)
                & (options["ask"] > 0)
                & (options["volume"] >= min_volume)
                & (options["openInterest"] > 0)
                & (options["spreadPct"] <= max_spread_pct)
            ]

            moneyness = options["strike"] / underlying_price
            options = options[
                (moneyness >= moneyness_range[0]) & (moneyness <= moneyness_range[1])
            ]

            options = options[
                (options["impliedVolatility"] > 0.01)
                & (options["impliedVolatility"] < 3)
            ]

            # Calculate maturity
            today = datetime.today().date()
            expiration_date = pd.to_datetime(expiration).date()
            maturity = (expiration_date - today).days / 365.25

            for _, row in options.iterrows():
                mid = (row["bid"] + row["ask"]) / 2
                result.append(
                    {
                        "mid_price": mid,
                        "ask_price": row["ask"],
                        "maturity": maturity,
                        "strike": row["strike"],
                        "implied_volatility": row["impliedVolatility"],
                        "volume": row["volume"],
                        "expiration": expiration_date,
                        "moneyness": row["strike"] / underlying_price,
                    }
                )

        # Convert the list of dictionaries to a DataFrame
        df = pd.DataFrame(result)

        # Sort by expiration and strike
        if not df.empty:
            df = df.sort_values(["expiration", "strike"])

        return df

    except Exception as e:
        raise RuntimeError(f"Failed to fetch market data: {str(e)}")
