"use client";

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerComponent = ({ selectedDate, onChange }) => {
  return (
    <div className="w-full">
      <label className="block font-medium">Expiration Date</label>
      <DatePicker
        selected={selectedDate}
        onChange={onChange}
        className="border p-2 rounded w-full"
        dateFormat="yyyy-MM-dd"
        minDate={new Date()}
      />
    </div>
  );
};

export default DatePickerComponent;
