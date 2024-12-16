"use client";

import MainLayout from "@/components/layout/MainLayout";
import { useEffect, useState } from "react";

interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

const MOCK_PROFILE = {
  id: "1",
  name: "지영",
  email: "jiyoung@example.com",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(function fetchProfile() {
    // 임시 데이터를 사용하여 프로필 설정
    setTimeout(() => {
      setProfile(MOCK_PROFILE);
      setIsLoading(false);
    }, 500); // 로딩 상태를 보여주기 위한 인위적인 지연
  }, []);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="fixed top-0 left-0 right-0 z-10 bg-white border-b">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <h1 className="text-xl font-semibold">프로필</h1>
        </div>
      </div>

      <main className="pt-16 pb-20">
        <div className="container mx-auto px-4">
          {/* 프로필 정보 */}
          <section className="bg-white rounded-lg p-6 mb-6">
            <div className="flex items-center mb-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl text-gray-600">
                  {profile?.name?.[0]}
                </span>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold">{profile?.name}</h2>
                <p className="text-gray-500">{profile?.email}</p>
              </div>
            </div>
          </section>

          {/* 메뉴 리스트 */}
          <section className="bg-white rounded-lg">
            <div className="divide-y">
              <button className="w-full px-6 py-4 text-left flex items-center justify-between">
                <span>개인정보 수정</span>
                <span className="text-gray-400">→</span>
              </button>
              <button className="w-full px-6 py-4 text-left flex items-center justify-between">
                <span>알림 설정</span>
                <span className="text-gray-400">→</span>
              </button>
              <button className="w-full px-6 py-4 text-left flex items-center justify-between">
                <span>이용약관</span>
                <span className="text-gray-400">→</span>
              </button>
              <button className="w-full px-6 py-4 text-left flex items-center justify-between">
                <span>개인정보 처리방침</span>
                <span className="text-gray-400">→</span>
              </button>
              <button className="w-full px-6 py-4 text-left flex items-center justify-between text-red-500">
                <span>로그아웃</span>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </section>
        </div>
      </main>
    </MainLayout>
  );
}
