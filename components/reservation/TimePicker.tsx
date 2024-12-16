"use client";

import { useState } from "react";
import { format } from "date-fns";

interface TimePickerProps {
  onTimeSelect: (time: string) => void;
  selectedTime?: string;
}

const AVAILABLE_TIMES = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

export default function TimePicker({
  onTimeSelect,
  selectedTime,
}: TimePickerProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {AVAILABLE_TIMES.map((time) => (
        <button
          key={time}
          onClick={() => onTimeSelect(time)}
          className={`
            p-3 border rounded-lg text-center transition-colors
            ${
              selectedTime === time
                ? "bg-blue-600 text-white border-blue-600"
                : "hover:bg-gray-50"
            }
          `}
        >
          {time}
        </button>
      ))}
    </div>
  );
}
