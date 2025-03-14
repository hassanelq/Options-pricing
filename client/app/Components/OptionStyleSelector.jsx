import React from "react";

const OptionStyleSelector = ({ selectedStyle, setSelectedStyle }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3 text-teal-800">
        Step 1: Select Option Style
      </h2>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="optionStyle"
            value="European"
            checked={selectedStyle === "European"}
            onChange={(e) => setSelectedStyle(e.target.value)}
          />
          European
        </label>
      </div>
    </div>
  );
};

export default OptionStyleSelector;
