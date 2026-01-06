import { useState, useEffect, useCallback, useRef } from "react";
import { useGroupsService } from "@/lib/groups-service";
import type { Group, CreateGroupInput } from "@/types/groups";

export function useGroups() {
  const groupsService = useGroupsService();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Use ref to store the service functions to avoid recreating callbacks
  const serviceRef = useRef(groupsService);
  serviceRef.current = groupsService;

  const fetchGroups = useCallback(async () => {
    try {
      setError(null);
      const fetchedGroups = await serviceRef.current.fetchGroups();
      setGroups(fetchedGroups);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch groups";
      setError(errorMessage);
      console.error("Error fetching groups:", err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []); // Empty deps - we use ref to access current service

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await fetchGroups();
  }, [fetchGroups]);

  const createGroup = useCallback(
    async (data: CreateGroupInput) => {
      try {
        setError(null);
        const response = await serviceRef.current.createGroup(data);
        setGroups((prev) => [response.group, ...prev]);
        return response.group;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create group";
        setError(errorMessage);
        throw err;
      }
    },
    [] // Empty deps - we use ref to access current service
  );

  const updateGroupInList = useCallback((updatedGroup: Group) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === updatedGroup.id ? updatedGroup : g))
    );
  }, []);

  const removeGroupFromList = useCallback((groupId: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
  }, []);

  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return {
    groups,
    isLoading,
    error,
    refreshing,
    fetchGroups,
    refresh,
    createGroup,
    updateGroupInList,
    removeGroupFromList,
  };
}
