"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { UserSearch } from "@/components/groups/UserSearch";
import { groupSchema, type GroupFormValues } from "@/lib/validations/group";

export function GroupForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      description: "",
      members: [],
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = form;
  const members = watch("members") || [];

  async function onSubmit(data: GroupFormValues) {
    try {
      setIsSubmitting(true);
      // TODO: Add API call to create group
      console.log("Form data:", data);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push("/groups");
      router.refresh();
    } catch (error) {
      console.error("Error creating group:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-xl p-4 sm:p-8 shadow-sm"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 sm:space-y-8"
      >
        <div className="space-y-4 sm:space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
            >
              Group Name
            </label>
            <Input
              id="name"
              placeholder="e.g., Summer Trip 2024"
              className="max-w-md"
              error={errors.name?.message}
              {...register("name")}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
            >
              Description
            </label>
            <Textarea
              id="description"
              placeholder="What's this group for?"
              className="max-w-md h-20 sm:h-24"
              error={errors.description?.message}
              {...register("description")}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Add Members
            </label>
            <div className="max-w-md">
              <UserSearch
                onSelect={(userId) => {
                  if (!members.includes(userId)) {
                    setValue("members", [...members, userId]);
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:items-center sm:gap-4 pt-2">
          <Button
            type="button"
            variant="text"
            size="lg"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto"
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Create Group
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
