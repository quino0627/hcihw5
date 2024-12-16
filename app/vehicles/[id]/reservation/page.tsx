"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { notFound, useRouter, useParams } from "next/navigation";
import VehicleHeader from "@/components/vehicles/VehicleHeader";
import DateTimePicker from "@/components/reservation/DateTimePicker";
import TimePicker from "@/components/reservation/TimePicker";
import DurationPicker from "@/components/reservation/DurationPicker";

interface Vehicle {
  id: string;
  model: string;
  manufacturer: string;
  year: number;
  category: string;
  location: string;
  status: string;
  features: Record<string, boolean>;
}

export default function ReservationPage() {
  const router = useRouter();
  const params = useParams();
  const vehicleId = params?.id as string;

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("09:00");
  const [duration, setDuration] = useState<number>(4);
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

  const handleNext = () => {
    // 예약 정보를 다음 페이지로 전달
    router.push(
      `/vehicles/${vehicleId}/reservation/confirm?` +
        `date=${selectedDate.toISOString()}&` +
        `time=${selectedTime}&` +
        `duration=${duration}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <VehicleHeader
        title="예약하기"
        subtitle={`${vehicle.model} | ${vehicle.manufacturer}`}
      />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* 날짜 선택 */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">날짜 선택</h2>
            <div className="bg-white rounded-lg p-4">
              <DateTimePicker
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </div>
          </section>

          {/* 시간 선택 */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">시간 선택</h2>
            <div className="bg-white rounded-lg p-4">
              <TimePicker
                selectedTime={selectedTime}
                onTimeSelect={setSelectedTime}
              />
            </div>
          </section>

          {/* 예약 시간 */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">대여 시간</h2>
            <div className="bg-white rounded-lg p-4">
              <DurationPicker
                duration={duration}
                onDurationChange={setDuration}
              />
            </div>
          </section>
        </div>
      </main>

      {/* 다음 단계 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <button
          onClick={handleNext}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
        >
          다음 단계
        </button>
      </div>
    </div>
  );
}
