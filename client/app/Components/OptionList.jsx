const OptionList = ({ optionsData, handleAutoFill, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="text-center text-teal-700 font-semibold py-4">
        Loading market data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-semibold py-4">
        Failed to fetch market data. Please try again.
      </div>
    );
  }

  if (optionsData.length === 0) return null;

  return (
    <div className="mt-6">
      {optionsData?.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-3 text-teal-800">
            Available Options ({optionsData[0].symbol})
          </h2>

          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">Type</th>
                <th className="border border-gray-300 p-2">Strike Price</th>
                <th className="border border-gray-300 p-2">Underlying Price</th>
                <th className="border border-gray-300 p-2">Expiration</th>
                <th className="border border-gray-300 p-2">
                  Implied Volatility
                </th>
                <th className="border border-gray-300 p-2">Market Price</th>
                <th className="border border-gray-300 p-2"></th>
              </tr>
            </thead>
            <tbody>
              {optionsData.map((option, index) => (
                <tr key={index} className="text-center border border-gray-300">
                  <td className="border border-gray-300 p-2">
                    {option.option_type}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {option.strike_price}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {option.stock_price.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {option.expiration}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {(option.implied_volatility * 100).toFixed(2)}%
                  </td>
                  <td className="border border-gray-300 p-2">
                    {option.market_price}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={() => handleAutoFill(option)}
                    >
                      Auto-Fill
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default OptionList;
