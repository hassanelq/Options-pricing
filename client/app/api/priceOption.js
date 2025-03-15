import axios from "axios";

export const priceOption = async (PricingRequest) => {
  try {
    const response = await axios.post(`http://127.0.0.1:8000/api/v1/price`, {
      ...PricingRequest,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching market data:", error);
    throw error;
  }
};
