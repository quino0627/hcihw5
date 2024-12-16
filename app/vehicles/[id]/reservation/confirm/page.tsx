"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";

interface Vehicle {
  id: string;
  model: string;
  manufacturer: string;
  location: string;
  image_url?: string;
}

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
  type = "create",
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
  type?: "create" | "cancel";
}) {
  if (!isOpen) return null;

  const messages = {
    create: {
      title: "예약하시겠습니까?",
      description: "예약 정보를 한 번 더 확인해 주세요.",
      confirmText: "예약하기",
      buttonColor: "bg-blue-600",
    },
    cancel: {
      title: "예약을 취소하시겠습니까?",
      description: "취소 후에는 되돌릴 수 없습니다.",
      confirmText: "예약 취소",
      buttonColor: "bg-red-600",
    },
  };

  const { title, description, confirmText, buttonColor } = messages[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          <p className="text-gray-500 text-sm mb-6">{description}</p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-lg font-medium border"
              disabled={isProcessing}
            >
              아니오
            </button>
            <button
              onClick={onConfirm}
              disabled={isProcessing}
              className={`
                flex-1 py-3 rounded-lg font-medium text-white
                ${isProcessing ? "bg-gray-400" : buttonColor}
              `}
            >
              {isProcessing ? "처리 중..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReservationConfirmPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const vehicleId = params?.id as string;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // URL에서 예약 정보 가져오기
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const duration = searchParams.get("duration");

  useEffect(
    function fetchVehicle() {
      if (!vehicleId) return;

      const supabase = createClientComponentClient<Database>();
      supabase
        .from("vehicles")
        .select("*")
        .eq("id", vehicleId)
        .single()
        .then(({ data }) => {
          if (data) {
            setVehicle(data);
          }
          setIsLoading(false);
        });
    },
    [vehicleId]
  );

  const handleReservationClick = () => {
    setIsModalOpen(true);
  };

  const handleReservationConfirm = async () => {
    if (!vehicle || !date || !time || !duration) {
      alert("예약 정보가 올바르지 않습니다.");
      return;
    }

    try {
      setIsProcessing(true);
      const supabase = createClientComponentClient<Database>();

      // 예약 시작 시간 생성
      const [hour, minute] = time.split(":");
      const startTime = parseISO(date);
      startTime.setHours(parseInt(hour), parseInt(minute));

      // 종료 시간 계산
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + parseInt(duration));

      // 예약 생성
      const { data, error } = await supabase
        .from("reservations")
        .insert({
          vehicle_id: vehicleId,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          duration: parseInt(duration),
          status: "pending",
          user_id: "00000000-0000-0000-0000-000000000000", // 테스트용 사용자 ID
        })
        .select()
        .single();

      if (error) {
        console.error("예약 실패:", error);
        alert(error.message || "예약에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      if (!data) {
        alert("예약 데이터를 받아��지 못했습니다.");
        return;
      }

      // 예약 성공 후 예약 상세 페이지로 이동
      router.push(`/reservations/${data.id}`);
    } catch (error) {
      console.error("예약 처리 중 오류 발생:", error);
      alert("예약 처리 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
      setIsModalOpen(false);
    }
  };

  if (isLoading || !vehicle || !date || !time || !duration) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  const reservationDate = parseISO(date);
  const formattedDate = format(reservationDate, "yyyy년 M월 d일 (E)", {
    locale: ko,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 z-10 bg-white border-b">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <button onClick={() => router.back()} className="p-2 -ml-2 mr-2">
            ← {/* TODO: 실제 아이콘으로 체 */}
          </button>
          <h1 className="text-xl font-semibold">예약 확인</h1>
        </div>
      </div>

      <main className="pt-16 pb-24">
        <div className="container mx-auto px-4">
          {/* 차량 정보 */}
          <section className="mb-6">
            <div className="bg-white rounded-lg p-6">
              <div className="aspect-video bg-gray-200 rounded-lg mb-4">
                {vehicle.image_url && (
                  <img
                    src={vehicle.image_url}
                    alt={vehicle.model}
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}
              </div>
              <h2 className="text-xl font-semibold mb-1">{vehicle.model}</h2>
              <p className="text-gray-500">{vehicle.manufacturer}</p>
            </div>
          </section>

          {/* 예약 정보 */}
          <section className="mb-6">
            <div className="bg-white rounded-lg p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500">날짜</p>
                <p className="font-medium">{formattedDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">시간</p>
                <p className="font-medium">{time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">대여 시간</p>
                <p className="font-medium">{duration}시간</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">위치</p>
                <p className="font-medium">{vehicle.location}</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* 예약하기 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <button
          onClick={handleReservationClick}
          disabled={isProcessing}
          className={`
            w-full py-3 rounded-lg font-medium
            ${isProcessing ? "bg-gray-400 text-gray-200" : "bg-blue-600 text-white"}
          `}
        >
          {isProcessing ? "예약 처리 중..." : "예약하기"}
        </button>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleReservationConfirm}
        isProcessing={isProcessing}
        type="create"
      />
    </div>
  );
}
