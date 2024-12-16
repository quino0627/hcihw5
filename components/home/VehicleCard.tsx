"use client";

import { Car } from "lucide-react";
import Link from "next/link";

interface VehicleCardProps {
  id: string;
  model: string;
  manufacturer: string;
  category: string;
  location: string;
}

export default function VehicleCard({
  id,
  model,
  manufacturer,
  category,
  location,
}: VehicleCardProps) {
  return (
    <Link href={`/vehicles/${id}`}>
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
          <Car className="w-6 h-6 text-gray-600" />
        </div>
        <h3 className="font-semibold text-lg">{model}</h3>
        <p className="text-sm text-gray-600">{manufacturer}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
            {category}
          </span>
          <span className="text-xs text-gray-500">{location}</span>
        </div>
      </div>
    </Link>
  );
}
