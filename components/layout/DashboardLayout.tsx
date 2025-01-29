"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">{children}</main>
      </div>
    </div>
  );
}
