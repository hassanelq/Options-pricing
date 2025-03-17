import yfinance as yf

# List of all tickers provided in different categories
tickers = [
    "AAPL",
    "MSFT",
    # "GOOGL",
    # "AMZN",
    # "TSLA",
    # "NVDA",
    # "META",
    # "NFLX",
    # "BABA",
    # "AMD",  # Stocks
    # "SPX",
    # "NDX",
    # "DJX",
    # "FTSE",
    # "DAX",
    # "CAC",
    # "STOXX50E",
    # "NIKKEI",
    # "HSI",
    # "ASX",  # Indices
    # "SPY",
    # "QQQ",
    # "IWM",
    # "EFA",
    # "EWJ",
    # "XLF",
    # "XLK",
    # "XLE",
    # "VXX",
    # "TLT",  # ETFs
    # "EURIBOR",
    # "LIBOR",
    # "SOFR",
    # "EONIA",
    # "SONIA",
    # "TONAR",
    # "ESTR",
    # "FEDFUNDS",
    # "BOEBASE",
    # "RBAOFFICIAL",  # Interest Rates
    # "GC",
    # "SI",
    # "HG",
    # "ZC",
    # "ZW",
    # "ZS",
    # "CT",
    # "KC",
    # "SB",
    # "CC",  # Commodities
    # "CL",
    # "NG",
    # "HO",
    # "RB",
    # "BRN",  # Energy Prices
    # "EUR/USD",
    # "GBP/USD",
    # "USD/JPY",
    # "USD/CHF",
    # "AUD/USD",
    # "USD/CAD",
    # "NZD/USD",
    # "EUR/GBP",
    # "EUR/JPY",
    # "GBP/JPY",  # FX
]

# Dictionary to store results
options_availability = {}

for ticker in tickers:
    try:
        asset = yf.Ticker(ticker)
        options = asset.options  # Fetch options data
        options_availability[ticker] = bool(
            options
        )  # True if options data is available
    except Exception as e:
        options_availability[ticker] = False

# Filter out tickers that do not have options data available
missing_options_tickers = [
    ticker for ticker, available in options_availability.items() if not available
]

missing_options_tickers
