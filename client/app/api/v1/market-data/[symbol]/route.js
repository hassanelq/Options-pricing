import axios from "axios";

// This handles GET requests to /api/v1/market-data/<symbol>
export async function GET(request, { params }) {
  try {
    const { symbol } = params; // e.g., "AAPL"
    // const apiUrl = `http://152.67.66.102:8777/api/v1/market-data/${symbol}`;
    // const apiUrl = `http://127.0.0.1:8000/api/v1/market-data/${symbol}`;

    const apiUrl = `http://157.90.115.198:8000/api/v1/market-data/${symbol}`;
    const { data } = await axios.get(apiUrl);

    // Return data
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
