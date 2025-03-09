import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const {
      symbols,
      expiration,
      minStrike,
      maxStrike,
      optionType,
      totalResults,
    } = req.body;

    if (!symbols || !expiration || !minStrike || !maxStrike || !optionType) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const formattedSymbols = symbols.split(",").map((s) => s.trim());
    let allOptions = [];

    for (const symbol of formattedSymbols) {
      const url = `https://query2.finance.yahoo.com/v7/finance/options/${symbol}`;
      const response = await axios.get(url);

      if (!response.data.optionChain || !response.data.optionChain.result[0]) {
        continue;
      }

      const stockPrice =
        response.data.optionChain.result[0].quote.regularMarketPrice;
      const availableExpirations =
        response.data.optionChain.result[0].expirationDates;

      // Convert expiration to timestamp & check if available
      const expirationTimestamp = Math.floor(
        new Date(expiration).getTime() / 1000
      );
      if (!availableExpirations.includes(expirationTimestamp)) {
        continue;
      }

      // Get options for the selected expiration date
      const optionData = response.data.optionChain.result[0].options.find(
        (opt) => opt.expirationDate === expirationTimestamp
      );

      if (!optionData) continue;

      let options = optionType === "call" ? optionData.calls : optionData.puts;

      // Filter by strike price range
      options = options.filter(
        (opt) => opt.strike >= minStrike && opt.strike <= maxStrike
      );

      // Sort by highest open interest & volume (best liquidity)
      options.sort((a, b) => (b.openInterest || 0) - (a.openInterest || 0));

      // Pick top results
      const selectedOptions = options.slice(0, totalResults || 10);

      // Format response
      selectedOptions.forEach((opt) => {
        allOptions.push({
          symbol,
          stock_price: stockPrice,
          expiration,
          strike_price: opt.strike,
          option_type: optionType,
          market_price: opt.lastPrice || 0,
          implied_volatility: opt.impliedVolatility || 0,
          open_interest: opt.openInterest || 0,
          volume: opt.volume || 0,
        });
      });
    }

    if (allOptions.length === 0) {
      return res
        .status(404)
        .json({ error: "No options found matching criteria" });
    }

    return res.status(200).json(allOptions);
  } catch (error) {
    console.error("Error fetching options:", error);
    return res.status(500).json({ error: "Failed to fetch option data" });
  }
}
