"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import type { Reservation } from "@/types/reservation";
import { getStatusText, getStatusColor } from "@/utils/reservation";

interface ReservationListProps {
  reservations: Reservation[];
  compact?: boolean;
}

export default function ReservationList({
  reservations,
  compact = false,
}: ReservationListProps) {
  if (reservations.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4 text-center text-gray-500">
        예약 내역이 없습니다
      </div>
    );
  }

  return (
    <div className={compact ? "space-y-2" : "space-y-4"}>
      {reservations.map((reservation) => (
        <Link
          key={reservation.id}
          href={`/reservations/${reservation.id}`}
          className={`block bg-white rounded-lg ${compact ? "py-2" : "p-4"}`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className={`font-medium ${compact ? "text-sm" : ""}`}>
                {reservation.vehicle.manufacturer} {reservation.vehicle.model}
              </h3>
              <div
                className={`text-gray-500 ${compact ? "text-xs" : "text-sm"}`}
              >
                <p>{reservation.vehicle.location}</p>
                <p>
                  {format(
                    new Date(reservation.start_time),
                    "M월 d일 (E) HH:mm",
                    {
                      locale: ko,
                    }
                  )}
                  {" · "}
                  {reservation.duration}시간
                </p>
              </div>
            </div>
            <span
              className={`
                px-2 py-1 rounded-full font-medium
                ${getStatusColor(reservation.status)}
                ${compact ? "text-xs" : "text-sm"}
              `}
            >
              {getStatusText(reservation.status)}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
