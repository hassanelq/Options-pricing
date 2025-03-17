import axios from "axios";

export const priceOption = async (PricingRequest) => {
  try {
    // const response = await axios.post(
    //   `http://127.0.0.1:8000/api/v1/price`,
    //   PricingRequest
    // );
    const response = await axios.post(
      `http://152.67.66.102:8777/api/v1/price`,
      PricingRequest
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request setup error:", error.message);
    }
    throw error;
  }
};
