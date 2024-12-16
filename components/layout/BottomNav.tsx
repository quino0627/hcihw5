"use client";

import { Home, Calendar, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleReservationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.replace("/reservations");
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="container mx-auto px-4">
        <div className="flex justify-around py-2">
          <Link
            href="/"
            className={`flex flex-col items-center p-2 ${
              isActive("/") ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">홈</span>
          </Link>

          <button
            onClick={handleReservationClick}
            className={`flex flex-col items-center p-2 ${
              isActive("/reservations") ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs mt-1">예약</span>
          </button>

          <Link
            href="/profile"
            className={`flex flex-col items-center p-2 ${
              isActive("/profile") ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">프로필</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
