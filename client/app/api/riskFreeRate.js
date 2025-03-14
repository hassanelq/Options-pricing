export const fetchRiskFreeRate = async (years) => {
  let seriesId;
  if (years < 1) {
    seriesId = "DGS3MO"; // 3-Month Treasury Rate
  } else if (years < 5) {
    seriesId = "DGS5"; // 5-Year Treasury Note
  } else {
    seriesId = "DGS10"; // 10-Year Treasury Note
  }

  // const apiKey = process.env.REACT_APP_FRED_API_KEY;
  const apiKey = "0de8b88e8310c6ebbd66c2eaa2ccb03f";
  if (!apiKey) {
    console.error(
      "🚨 API Key is missing! Ensure REACT_APP_FRED_API_KEY is set in your .env file."
    );
    throw new Error("API Key is missing.");
  }

  const url =
    "https://thingproxy.freeboard.io/fetch/https://api.stlouisfed.org/fred/series/observations?series_id=DGS10&api_key=0de8b88e8310c6ebbd66c2eaa2ccb03f&file_type=json";

  //   const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json`;

  console.log("Fetching risk-free rate from:", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.observations || data.observations.length === 0) {
      throw new Error("No data available for the selected rate.");
    }

    return parseFloat(data.observations[data.observations.length - 1].value);
  } catch (error) {
    console.error("Error fetching risk-free rate:", error);
    throw error;
  }
};
