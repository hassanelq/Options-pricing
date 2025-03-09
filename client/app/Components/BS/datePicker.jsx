"use client";

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerComponent = ({ selectedDate, onChange }) => {
  return (
    <div className="w-full">
      <label className="block font-medium mb-1 text-gray-700">
        Expiration Date
      </label>
      <div className="relative">
        <DatePicker
          selected={selectedDate}
          onChange={onChange}
          className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
          dateFormat="yyyy-MM-dd"
          minDate={new Date()} // Prevent past dates
        />
      </div>
    </div>
  );
};

export default DatePickerComponent;
