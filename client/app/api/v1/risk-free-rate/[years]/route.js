import { NextResponse } from "next/server";
import axios from "axios";

// GET /api/v1/risk-free-rate/<years>
export async function GET(request, { params }) {
  try {
    // "years" is whatever is in the URL path: /api/v1/risk-free-rate/1
    const { years } = params;

    // 1. Pick the correct FRED series based on the 'years' param
    let seriesId;
    const numericYears = Number(years);
    if (numericYears < 1) {
      seriesId = "DGS3MO"; // 3-Month
    } else if (numericYears < 5) {
      seriesId = "DGS5"; // 5-Year
    } else {
      seriesId = "DGS10"; // 10-Year
    }

    // 2. Make sure you have an API key
    const apiKey = "0de8b88e8310c6ebbd66c2eaa2ccb03f"; // or from env if you'd like
    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key is missing." },
        { status: 500 }
      );
    }

    // 3. Build the FRED API URL
    const apiUrl = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json`;

    // 4. Fetch data from the FRED API
    const { data } = await axios.get(apiUrl);

    // 5. Check we have valid data
    if (!data.observations || data.observations.length === 0) {
      return NextResponse.json(
        { error: "No data available for the selected rate." },
        { status: 500 }
      );
    }

    // 6. Extract the latest observation’s value
    const latestValue = parseFloat(
      data.observations[data.observations.length - 1].value
    );

    // 7. Return the JSON to the client
    return NextResponse.json({ value: latestValue }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching risk-free rate." },
      { status: 500 }
    );
  }
}
