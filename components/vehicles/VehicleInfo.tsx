"use client";

interface VehicleInfoProps {
  manufacturer: string;
  year: number;
  category: string;
  location: string;
  features: Record<string, boolean>;
}

export default function VehicleInfo({
  manufacturer,
  year,
  category,
  location,
  features,
}: VehicleInfoProps) {
  return (
    <div className="bg-white rounded-lg p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm text-gray-500">제조사</h3>
          <p className="font-medium">{manufacturer}</p>
        </div>
        <div>
          <h3 className="text-sm text-gray-500">분류</h3>
          <p className="font-medium">{category}</p>
        </div>
        <div>
          <h3 className="text-sm text-gray-500">연식</h3>
          <p className="font-medium">{year}년형</p>
        </div>
        <div>
          <h3 className="text-sm text-gray-500">위치</h3>
          <p className="font-medium">{location}</p>
        </div>
      </div>

      <div>
        <h3 className="text-sm text-gray-500 mb-2">안전 옵션</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(features).map(
            ([feature, enabled]) =>
              enabled && (
                <span
                  key={feature}
                  className="text-xs px-2 py-1 bg-gray-100 rounded-full"
                >
                  {feature}
                </span>
              )
          )}
        </div>
      </div>
    </div>
  );
}
