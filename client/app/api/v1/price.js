import axios from "axios";

export default async function handler(req, res) {
  // Only allow POST if you want to avoid GET calls
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    const apiUrl = "http://152.67.66.102:8777/api/v1/price";
    const response = await axios.post(apiUrl, req.body);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch price" });
  }
}
