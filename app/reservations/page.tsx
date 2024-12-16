"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ReservationList from "@/components/reservation/ReservationList";
import MainLayout from "@/components/layout/MainLayout";
import type { Database } from "@/types/supabase";
import type { Reservation } from "@/types/reservation";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(function fetchReservations() {
    const supabase = createClientComponentClient<Database>();

    // 먼저 데이터 가져오기를 시도하고 결과를 콘솔에 출력
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
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error("예약 목록 조회 실패:", error);
          return;
        }

        console.log("받아온 예약 데이터:", data); // 디버깅용

        if (data) {
          setReservations(data as Reservation[]);
        }
        setIsLoading(false);
      });
  }, []);

  // 디버깅용 로그
  console.log("현재 예약 상태:", reservations);

  return (
    <MainLayout>
      <div className="fixed top-0 left-0 right-0 z-10 bg-white border-b">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <h1 className="text-xl font-semibold">예약 내역</h1>
        </div>
      </div>

      <main className="pt-16 pb-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center text-gray-500">로딩 중...</div>
          ) : reservations.length > 0 ? (
            <ReservationList reservations={reservations} />
          ) : (
            <div className="bg-white rounded-lg p-4 text-center text-gray-500">
              예약 내역이 없습니다
            </div>
          )}
        </div>
      </main>
    </MainLayout>
  );
}
