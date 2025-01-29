"use client";

import { useAuth } from "@/context/auth-context";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Welcome back!</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-white/10 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Recent Activity
            </h2>
            <p className="text-gray-400">No recent activity</p>
          </div>

          <div className="rounded-lg border border-white/10 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Your Groups
            </h2>
            <p className="text-gray-400">No groups yet</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
