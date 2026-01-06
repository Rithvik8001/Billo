import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useActivityService } from "@/lib/activity-service";
import type { ActivityItem, ActivityType } from "@/types/activity";

export type ActivityFilter =
  | "all"
  | "settlements"
  | "receipts"
  | "groups"
  | "payments";

export interface ActivitySection {
  title: string;
  data: ActivityItem[];
}

// Group activities by date sections
function groupActivitiesByDate(activities: ActivityItem[]): ActivitySection[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const sections: ActivitySection[] = [
    { title: "Today", data: [] },
    { title: "Yesterday", data: [] },
    { title: "This Week", data: [] },
    { title: "Earlier", data: [] },
  ];

  activities.forEach((activity) => {
    const activityDate = new Date(activity.rawTimestamp);
    
    if (activityDate >= today) {
      sections[0].data.push(activity);
    } else if (activityDate >= yesterday) {
      sections[1].data.push(activity);
    } else if (activityDate >= weekAgo) {
      sections[2].data.push(activity);
    } else {
      sections[3].data.push(activity);
    }
  });

  // Remove empty sections
  return sections.filter((section) => section.data.length > 0);
}

export function useActivity() {
  const { userId } = useAuth();
  const activityService = useActivityService();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Use ref to store the service functions to avoid recreating callbacks
  const serviceRef = useRef(activityService);
  serviceRef.current = activityService;

  const fetchActivity = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const fetchedActivities = await serviceRef.current.fetchActivity(userId);
      setActivities(fetchedActivities);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch activity";
      setError(errorMessage);
      console.error("Error fetching activity:", err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await fetchActivity();
  }, [fetchActivity]);

  const filterActivities = useCallback(
    (filter: ActivityFilter): ActivityItem[] => {
      if (filter === "all") {
        return activities;
      }

      const typeMap: Record<ActivityFilter, ActivityType | null> = {
        all: null,
        settlements: "settlement",
        receipts: "receipt",
        payments: "payment",
        groups: "group",
      };

      const targetType = typeMap[filter];
      if (!targetType) {
        return activities;
      }

      return activities.filter((item) => item.type === targetType);
    },
    [activities]
  );

  const getGroupedActivities = useCallback(
    (filter: ActivityFilter): ActivitySection[] => {
      const filtered = filterActivities(filter);
      return groupActivitiesByDate(filtered);
    },
    [filterActivities]
  );

  useEffect(() => {
    fetchActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]); // Only run when userId changes

  return {
    activities,
    isLoading,
    error,
    refreshing,
    fetchActivity,
    refresh,
    filterActivities,
    getGroupedActivities,
  };
}

