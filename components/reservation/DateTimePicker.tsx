"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";

interface DateTimePickerProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function DateTimePicker({
  selectedDate,
  onDateSelect,
}: DateTimePickerProps) {
  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-sm font-medium">
          {format(selectedDate, "yyyy년 M월", { locale: ko })}
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {dates.map((date) => (
          <button
            key={date.toISOString()}
            onClick={() => onDateSelect(date)}
            className={`
              p-2 rounded-lg text-center
              ${isSameDay(date, selectedDate) ? "bg-blue-600 text-white" : "hover:bg-gray-50"}
            `}
          >
            <div className="text-xs mb-1">
              {format(date, "E", { locale: ko })}
            </div>
            <div className="font-medium">{format(date, "d")}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
