import React from "react";

const PricingResult = ({ priceResult }) => {
  return (
    priceResult && (
      <div className="mt-6 bg-teal-100 p-4 rounded">
        <h4 className="font-bold mb-2 text-teal-900">Pricing Result:</h4>
        <p className="text-teal-800">
          Price: <span className="font-bold">{priceResult.price}</span>
        </p>
        <p className="text-teal-800">
          Methodology:{" "}
          <span className="font-bold">{priceResult.methodology}</span>
        </p>
      </div>
    )
  );
};

export default PricingResult;
