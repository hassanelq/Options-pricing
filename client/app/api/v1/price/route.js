import axios from "axios";

// This handles the POST request to /api/v1/price
export async function POST(request) {
  try {
    const body = await request.json(); // Read the JSON body from the request
    // const apiUrl = "http://127.0.0.1:8000/api/v1/price";
    const apiUrl = "http://157.90.115.198:8000/api/v1/price";

    console.log("About to send pricing request:", PricingRequest);
    // Forward the request to your real backend
    const { data } = await axios.post(apiUrl, body);

    console.log("Received pricing response:", data);

    // Return the result as JSON
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Return error with status code 500
    return new Response(JSON.stringify({ error: "Failed to fetch price" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Add this to your priceOption function
const priceOption = async (PricingRequest) => {
  try {
    console.log("About to send pricing request:", PricingRequest);
    // This hits the Next.js route at "/api/price"
    const response = await axios.post("/api/v1/price", PricingRequest);
    console.log("Received pricing response:", response.data);
    return response.data;
  } catch (error) {
    // Your existing error handling
  }
};
