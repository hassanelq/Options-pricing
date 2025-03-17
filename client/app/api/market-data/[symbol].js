import axios from "axios";

export default async function handler(req, res) {
  try {
    const { symbol } = req.query;
    // Proxy the request to your actual backend
    const apiUrl = `http://152.67.66.102:8777/api/v1/market-data/${symbol}`;
    const response = await axios.get(apiUrl);

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch data" });
  }
}
