import axios from "axios";

// This handles the POST request to /api/v1/price
export async function POST(request) {
  try {
    const body = await request.json(); // Read the JSON body from the request
    // const apiUrl = "http://152.67.66.102:8777/api/v1/calibrate";
    const apiUrl = "http://127.0.0.1:8000/api/v1/calibrate";

    // Forward the request to your real backend
    const { data } = await axios.post(apiUrl, body);

    // Return the result as JSON
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Return error with status code 500
    return new Response(JSON.stringify({ error: "Failed to calibrate" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
