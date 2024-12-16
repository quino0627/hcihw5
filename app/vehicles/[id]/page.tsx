"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import VehicleHeader from "@/components/vehicles/VehicleHeader";
import VehicleInfo from "@/components/vehicles/VehicleInfo";
import VehicleMap from "@/components/vehicles/VehicleMap";

interface Vehicle {
  id: string;
  model: string;
  manufacturer: string;
  year: number;
  category: string;
  location: string;
  status: string;
  features: Record<string, boolean>;
  image_url?: string;
}

export default function VehiclePage() {
  const params = useParams();
  const vehicleId = params?.id as string;
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    if (!vehicleId) return;

    const supabase = createClientComponentClient();
    supabase
      .from("vehicles")
      .select("*")
      .eq("id", vehicleId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          notFound();
        }
        setVehicle(data);
      });
  }, [vehicleId]);

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <VehicleHeader
        title={vehicle.model}
        subtitle={`${vehicle.manufacturer} | ${vehicle.category}`}
      />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* 차량 이미지 */}
          <div className="bg-white rounded-lg mb-4 relative aspect-video overflow-hidden">
            {vehicle.image_url ? (
              <Image
                src={vehicle.image_url}
                alt={`${vehicle.manufacturer} ${vehicle.model}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                이미지 없음
              </div>
            )}
          </div>

          {/* 지도 영역 */}
          <div
            className="bg-white rounded-lg mb-4 overflow-hidden"
            style={{ height: "300px" }}
          >
            <VehicleMap location={vehicle.location} />
          </div>

          {/* 차량 정보 */}
          <VehicleInfo
            manufacturer={vehicle.manufacturer}
            year={vehicle.year}
            category={vehicle.category}
            location={vehicle.location}
            features={vehicle.features}
          />
        </div>
      </main>

      {/* 예약하기 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Link href={`/vehicles/${vehicle.id}/reservation`}>
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium">
            예약하기
          </button>
        </Link>
      </div>
    </div>
  );
}
