export const fetchMarketData = async (symbol) => {
  return {
    underlyingPrice: 150,
    riskFreeRate: 3,
    volatility: 20,
  };
};

// const fetchOptions = async () => {
//   setIsLoading(true);
//   try {
//     const response = await axios.post("http://127.0.0.1:8000/options-data", {
//       symbol: inputs.symbol,
//       total_results: parseInt(inputs.totalResults),
//     });

//     setOptionsList(response.data);
//   } catch (error) {
//     console.error("Error fetching options:", error);
//     setOptionsList([]);
//   }
//   setIsLoading(false);
// };
