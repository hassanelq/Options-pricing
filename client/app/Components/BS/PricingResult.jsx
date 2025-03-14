import React from "react";

const PricingResult = ({ priceResult }) => {
  return (
    priceResult && (
      <div className="mt-6 bg-teal-100 p-4 rounded">
        <h4 className="font-bold mb-2 text-teal-900">Pricing Result:</h4>
        <pre className="whitespace-pre-wrap text-sm text-teal-900">
          {priceResult}
        </pre>
      </div>
    )
  );
};

export default PricingResult;
