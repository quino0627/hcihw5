"use client";

import { Bell, Settings, User } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 px-4 flex items-center justify-between bg-white border-b">
      <Link href="/profile" className="p-2">
        <User className="w-6 h-6" />
      </Link>
      <div className="flex items-center gap-4">
        <button className="p-2">
          <Bell className="w-6 h-6" />
        </button>
        <Link href="/settings" className="p-2">
          <Settings className="w-6 h-6" />
        </Link>
      </div>
    </header>
  );
}
