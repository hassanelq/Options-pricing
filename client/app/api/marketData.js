import axios from "axios";

export const fetchMarketData = async (symbol) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/v1/market-data/${symbol}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching market data:", error);
    throw error; // Throw the error instead of returning an error object
  }
};
