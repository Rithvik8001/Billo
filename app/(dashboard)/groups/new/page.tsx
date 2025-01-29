"use client";

import { useUser } from "@clerk/nextjs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import { GroupForm } from "@/components/groups/GroupForm";

export default function NewGroup() {
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
          <Button
            variant="text"
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-900 -ml-2 w-fit"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Back
          </Button>
          <h1 className="text-[28px] sm:text-[40px] font-semibold text-gray-900">
            Create New Group
          </h1>
        </div>

        <GroupForm />
      </motion.div>
    </DashboardLayout>
  );
}
