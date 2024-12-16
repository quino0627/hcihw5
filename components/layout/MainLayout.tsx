"use client";

import { ReactNode } from "react";
import Header from "./Header";
import BottomNav from "./BottomNav";

interface MainLayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
  hideBottomNav?: boolean;
}

export default function MainLayout({
  children,
  hideHeader = false,
  hideBottomNav = false,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {!hideHeader && <Header />}
      <main className="pt-14 pb-16 min-h-screen">
        <div className="container mx-auto px-4 py-4">{children}</div>
      </main>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
}
