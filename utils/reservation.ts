import type { Reservation } from "@/types/reservation";

export function getStatusText(status: Reservation["status"]) {
  switch (status) {
    case "pending":
      return "예약 대기";
    case "active":
      return "이용 중";
    case "completed":
      return "이용 완료";
    case "cancelled":
      return "예약 취소";
  }
}

export function getStatusColor(status: Reservation["status"]) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "active":
      return "bg-green-100 text-green-800";
    case "completed":
      return "bg-gray-100 text-gray-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
  }
}
