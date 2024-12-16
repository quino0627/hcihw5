"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import VehicleHeader from "@/components/vehicles/VehicleHeader";

export default function ReservationCompletePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <VehicleHeader title="예약 완료" />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* 완료 메시지 */}
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">예약이 완료되었습니다</h2>
            <p className="text-gray-500 mb-8">
              예약하신 내용은 나의 예약 내역에서 확인하실 수 있습니다
            </p>
            <Link href="/">
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium">
                홈으로 돌아가기
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
