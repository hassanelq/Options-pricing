import React from "react";

const PricingResult = ({ priceResult }) => {
  return (
    priceResult && (
      <div className="mt-6 bg-teal-100 p-4 rounded">
        <h4 className="font-bold mb-2 text-teal-900">Pricing Result:</h4>

        {/* Print all what's in priceResult */}
        <div className="flex flex-col gap-2">
          {Object.entries(priceResult).map(([key, value]) => {
            const displayValue =
              key === "price" ? `${value.toFixed(2)} $` : value;
            return (
              <div key={key} className="flex justify-between">
                <span className="text-teal-800">{key} :</span>
                <span className="text-teal-900 font-bold">{displayValue}</span>
              </div>
            );
          })}
        </div>
      </div>
    )
  );
};

export default PricingResult;
