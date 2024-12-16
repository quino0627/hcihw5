"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";
import type { Reservation } from "@/types/reservation";
import Image from "next/image";

interface Vehicle {
  id: string;
  model: string;
  manufacturer: string;
  location: string;
  image_url?: string;
}

interface ReservationWithVehicle extends Reservation {
  vehicle: Vehicle;
}

type Tab = "smartkey" | "inquiry";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
  title,
  description,
  confirmText,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
  title: string;
  description: string;
  confirmText: string;
}) {
  if (!isOpen) return null;

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
                flex-1 py-3 rounded-lg font-medium
                ${isProcessing ? "bg-gray-400 text-gray-200" : "bg-red-600 text-white"}
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

function FeedbackModal({
  isOpen,
  message,
  onClose,
}: {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-sm">
        <div className="p-6">
          <p className="text-center mb-6">{message}</p>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-lg font-medium bg-blue-600 text-white"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReservationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const reservationId = params?.id as string;

  const [activeTab, setActiveTab] = useState<Tab>("smartkey");
  const [reservation, setReservation] = useState<ReservationWithVehicle | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [inquiry, setInquiry] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAiResponding, setIsAiResponding] = useState(false);

  useEffect(
    function fetchReservation() {
      if (!reservationId) return;

      const supabase = createClientComponentClient<Database>();
      supabase
        .from("reservations")
        .select(
          `
        *,
        vehicle:vehicles (
          model,
          manufacturer,
          location,
          image_url
        )
      `
        )
        .eq("id", reservationId)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error("예약 정보 조회 실패:", error);
            return;
          }
          setReservation(data as ReservationWithVehicle);
          setIsLoading(false);
        });
    },
    [reservationId]
  );

  const handleCancelClick = () => {
    setIsModalOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!reservation) return;

    try {
      setIsProcessing(true);
      const supabase = createClientComponentClient<Database>();

      const { error } = await supabase
        .from("reservations")
        .update({ status: "cancelled" })
        .eq("id", reservationId);

      if (error) {
        console.error("예약 취소 실패:", error);
        alert("예약 취소에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      setReservation({ ...reservation, status: "cancelled" });
    } catch (error) {
      console.error("예약 취소 중 오류 발생:", error);
      alert("예약 취소 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
      setIsModalOpen(false);
    }
  };

  const handleDoorLock = () => {
    setFeedbackMessage("문이 잠겼습니다");
  };

  const handleDoorUnlock = () => {
    setFeedbackMessage("문이 열렸습니다");
  };

  const handleReturnClick = () => {
    setIsReturnModalOpen(true);
  };

  const handleReturnConfirm = async () => {
    try {
      setIsProcessing(true);
      const supabase = createClientComponentClient<Database>();

      const { error } = await supabase
        .from("reservations")
        .update({ status: "completed" })
        .eq("id", reservationId);

      if (error) {
        console.error("차량 반납 실패:", error);
        alert("차량 반납에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      setFeedbackMessage("차량이 성공적으로 반납되었습니다");
      if (reservation) {
        setReservation({ ...reservation, status: "completed" });
      }
    } catch (error) {
      console.error("차량 반납 중 오류 발생:", error);
      alert("차량 반납 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
      setIsReturnModalOpen(false);
    }
  };

  const handleInquirySubmit = async () => {
    if (!inquiry.trim() || isAiResponding) return;

    const newMessage: Message = { role: "user", content: inquiry };
    setMessages((prev) => [...prev, newMessage]);
    setInquiry("");
    setIsAiResponding(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, newMessage],
          vehicleInfo: {
            model: reservation?.vehicle.model,
            manufacturer: reservation?.vehicle.manufacturer,
            location: reservation?.vehicle.location,
          },
          reservationInfo: {
            id: reservation?.id,
            status: reservation?.status,
            startTime: reservation?.start_time,
            duration: reservation?.duration,
          },
        }),
      });

      if (!response.ok) throw new Error("AI 응답 생성 실패");

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
      console.error("AI 응답 오류:", error);
      alert("답변 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsAiResponding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">예약 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  const startTime = parseISO(reservation.start_time);
  const formattedDate = format(startTime, "yyyy년 M월 d일 (E)", { locale: ko });
  const formattedTime = format(startTime, "HH:mm");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 z-10 bg-white border-b">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <button
            onClick={() => router.push("/reservations")}
            className="p-2 -ml-2 mr-2"
          >
            ← {/* TODO: 실제 아이콘으로 교체 */}
          </button>
          <h1 className="text-xl font-semibold">예약 상세</h1>
        </div>
      </div>

      <main className="pt-16">
        {/* 차량 정보 */}
        <div className="bg-white">
          <div className="container mx-auto px-4">
            <div className="py-6">
              <div className="h-48 bg-gray-200 rounded-lg mb-4 relative overflow-hidden">
                {reservation.vehicle.image_url ? (
                  <Image
                    src={reservation.vehicle.image_url}
                    alt={`${reservation.vehicle.manufacturer} ${reservation.vehicle.model}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    이미지 없음
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    {reservation.vehicle.model}
                  </h2>
                  <p className="text-gray-500">
                    {reservation.vehicle.manufacturer}
                  </p>
                </div>
                {reservation.status === "cancelled" && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                    취소된 예약
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex">
              <button
                onClick={() => setActiveTab("smartkey")}
                className={`flex-1 py-4 text-center font-medium border-b-2 ${
                  activeTab === "smartkey"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500"
                }`}
              >
                스마트키
              </button>
              <button
                onClick={() => setActiveTab("inquiry")}
                className={`flex-1 py-4 text-center font-medium border-b-2 ${
                  activeTab === "inquiry"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500"
                }`}
              >
                차량 문의
              </button>
            </div>
          </div>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="container mx-auto px-4 py-6">
          {activeTab === "smartkey" ? (
            <div className="space-y-4">
              {reservation.status === "active" ? (
                <div className="grid grid-cols-1 gap-4">
                  <button
                    onClick={handleDoorLock}
                    className="w-full py-4 bg-white rounded-lg font-medium border"
                  >
                    문잠금
                  </button>
                  <button
                    onClick={handleDoorUnlock}
                    className="w-full py-4 bg-white rounded-lg font-medium border"
                  >
                    문열기
                  </button>
                  <button
                    onClick={handleReturnClick}
                    className="w-full py-4 bg-white rounded-lg font-medium border"
                  >
                    반납하기
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-lg p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">날짜</p>
                      <p className="font-medium">{formattedDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">시간</p>
                      <p className="font-medium">{formattedTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">대여 시간</p>
                      <p className="font-medium">{reservation.duration}시간</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">위치</p>
                      <p className="font-medium">
                        {reservation.vehicle.location}
                      </p>
                    </div>
                    {reservation.status === "cancelled" && (
                      <div className="pt-4 mt-4 border-t text-center">
                        <p className="text-gray-500">
                          이 예��은 취소되었습니다
                        </p>
                      </div>
                    )}
                  </div>
                  {reservation.status === "pending" && (
                    <div className="mt-6 text-center">
                      <button
                        onClick={handleCancelClick}
                        className="text-sm text-gray-500 hover:text-red-600"
                      >
                        예약 취소하기
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg flex flex-col h-[calc(100vh-16rem)]">
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-blue-50 ml-8"
                          : "bg-gray-50 mr-8"
                      }`}
                    >
                      <p className="text-sm text-gray-600 mb-1">
                        {message.role === "user" ? "나" : "AI 상담사"}
                      </p>
                      <p>{message.content}</p>
                    </div>
                  ))}
                  {isAiResponding && (
                    <div className="bg-gray-50 p-3 rounded-lg mr-8">
                      <p className="text-sm text-gray-600 mb-1">AI 상담사</p>
                      <p className="text-gray-500">
                        답변을 생성하고 있습니다...
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="sticky bottom-0 bg-white border-t p-4">
                <div className="flex gap-2">
                  <textarea
                    value={inquiry}
                    onChange={(e) => setInquiry(e.target.value)}
                    placeholder="문의사항을 입력해주세요"
                    className="flex-1 p-3 border rounded-lg resize-none h-20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleInquirySubmit}
                    disabled={!inquiry.trim() || isAiResponding}
                    className={`px-4 rounded-lg font-medium ${
                      !inquiry.trim() || isAiResponding
                        ? "bg-gray-100 text-gray-400"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    전송
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleCancelConfirm}
          isProcessing={isProcessing}
          title="예약을 취소하시겠습니까?"
          description="취소 후에는 되돌릴 수 없습니다."
          confirmText="예약 취소"
        />

        <FeedbackModal
          isOpen={!!feedbackMessage}
          message={feedbackMessage}
          onClose={() => setFeedbackMessage("")}
        />

        <ConfirmModal
          isOpen={isReturnModalOpen}
          onClose={() => setIsReturnModalOpen(false)}
          onConfirm={handleReturnConfirm}
          isProcessing={isProcessing}
          title="차량을 반납하시겠습니까?"
          description="반납 후에는 되돌릴 수 없습니다."
          confirmText="반납하기"
        />
      </main>
    </div>
  );
}
