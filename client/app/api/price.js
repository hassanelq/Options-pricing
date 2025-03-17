import axios from "axios";

export default async function handler(req, res) {
  // For extra safety, allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Forward the request body to your real backend
    const apiUrl = "http://152.67.66.102:8777/api/v1/price";
    const response = await axios.post(apiUrl, req.body);

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch price" });
  }
}
