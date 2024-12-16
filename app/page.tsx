"use client";

import MainLayout from "@/components/layout/MainLayout";
import { supabase } from "@/utils/supabase/client";
import VehicleCard from "@/components/home/VehicleCard";
import ReservationList from "@/components/reservation/ReservationList";
import { useEffect, useState } from "react";
import type { Reservation } from "@/types/reservation";

interface Vehicle {
  id: string;
  model: string;
  manufacturer: string;
  location: string;
  image_url?: string;
  category: string;
}

export default function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(function fetchData() {
    // 차량 데이터 가져오기
    supabase
      .from("vehicles")
      .select("*")
      .eq("status", "available")
      .then(({ data }) => {
        if (data) {
          setVehicles(data);
        }
      });

    // 예약 데이터 가져오기 (취소된 예약 제외)
    supabase
      .from("reservations")
      .select(
        `
        *,
        vehicle:vehicles (
          model,
          manufacturer,
          location
        )
      `
      )
      .neq("status", "cancelled") // 취소된 예약 제외
      .order("status", { ascending: false }) // active가 먼저 오도록
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) {
          setReservations(data as Reservation[]);
        }
        setIsLoading(false);
      });
  }, []);

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold">반갑습니다 지영님!</h1>

      {/* 예약 내역 섹션 */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-4">나의 예약 내역</h2>
        {isLoading ? (
          <div className="bg-white rounded-lg p-2 text-center text-gray-500">
            로딩 중...
          </div>
        ) : reservations.length > 0 ? (
          <div className="space-y-2">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className={`bg-white rounded-lg p-2 ${
                  reservation.status === "active"
                    ? "border-[1.5px] border-blue-500"
                    : "border border-gray-200"
                }`}
              >
                <ReservationList reservations={[reservation]} compact />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-2 text-center text-gray-500">
            현재 예약 내역이 없습니다.
          </div>
        )}
      </section>

      {/* AI 추천 테마 섹션 */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">추천 테마: 가까운 게 최고</h2>
          <button className="text-sm text-gray-500">더보기 →</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {vehicles
            ?.slice(0, 2)
            .map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                id={vehicle.id}
                model={vehicle.model}
                manufacturer={vehicle.manufacturer}
                category={vehicle.category}
                location={vehicle.location}
              />
            ))}
        </div>
      </section>

      {/* 좋아할 만한 차 섹션 */}
      <section className="mt-8 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">좋아하실 만한 차</h2>
          <button className="text-sm text-gray-500">더보기 →</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {vehicles
            ?.slice(2)
            .map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                id={vehicle.id}
                model={vehicle.model}
                manufacturer={vehicle.manufacturer}
                category={vehicle.category}
                location={vehicle.location}
              />
            ))}
        </div>
      </section>
    </MainLayout>
  );
}
