"use client";

import Header from "@/components/dashboard/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f5f5f7] antialiased selection:bg-[#2997ff]/20 selection:text-[#2997ff]">
      <Header />
      <main className="pt-[52px]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-8 py-4 sm:py-8">
          <div className="relative">
            {/* Subtle gradient background */}
            <div className="absolute -inset-x-4 sm:-inset-x-32 -top-32 -bottom-32 -z-10">
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-50/50 via-white to-indigo-50/50 opacity-50 blur-3xl" />
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
