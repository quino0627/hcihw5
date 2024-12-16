"use client";

interface DurationPickerProps {
  duration: number;
  onDurationChange: (hours: number) => void;
}

const DURATIONS = [2, 4, 6, 8, 12];

export default function DurationPicker({
  duration,
  onDurationChange,
}: DurationPickerProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">대여 시간</p>
          <p className="font-medium">{duration}시간</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {DURATIONS.map((hours) => (
          <button
            key={hours}
            onClick={() => onDurationChange(hours)}
            className={`
              p-3 border rounded-lg text-center transition-colors
              ${
                duration === hours
                  ? "bg-blue-600 text-white border-blue-600"
                  : "hover:bg-gray-50"
              }
            `}
          >
            {hours}시간
          </button>
        ))}
      </div>
    </div>
  );
}
