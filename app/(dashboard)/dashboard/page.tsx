"use client";

import { useUser } from "@clerk/nextjs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !user) {
    return null;
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4 sm:space-y-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-8">
          <h1 className="text-[28px] sm:text-[40px] font-semibold text-gray-900">
            Welcome back, {user.firstName || "there"}
          </h1>
          <Button size="lg" className="w-full sm:w-auto">
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            New Expense
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-xl p-4 sm:p-8 shadow-sm hover:shadow-md transition-all"
          >
            <h2 className="text-base sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
              Recent Activity
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              No recent activity
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-xl p-4 sm:p-8 shadow-sm hover:shadow-md transition-all"
          >
            <h2 className="text-base sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
              Your Groups
            </h2>
            <p className="text-sm sm:text-base text-gray-500">No groups yet</p>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
