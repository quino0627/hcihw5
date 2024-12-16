"use client";

import { ArrowLeft, Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";

interface VehicleHeaderProps {
  title: string;
  subtitle?: string;
}

export default function VehicleHeader({ title, subtitle }: VehicleHeaderProps) {
  const router = useRouter();

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b z-10">
      <div className="h-14 px-4 flex items-center justify-between">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button className="p-2">
          <Bookmark className="w-6 h-6" />
        </button>
      </div>
      <div className="px-4 pb-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
