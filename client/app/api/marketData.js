import axios from "axios";

export const fetchMarketData = async (symbol) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/options-data?symbol=${symbol}&total_results=10`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching market data:", error);
    return {};
  }
};
