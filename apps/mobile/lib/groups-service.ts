import { useApiClient } from "./api-client";
import type {
  Group,
  GroupMember,
  SearchUser,
  CreateGroupInput,
  UpdateGroupInput,
} from "@/types/groups";

export function useGroupsService() {
  const { apiRequest } = useApiClient();

  const fetchGroups = async (): Promise<Group[]> => {
    const response = await apiRequest<{ groups: Group[] }>("/api/groups");
    return response.groups;
  };

  const createGroup = async (
    data: CreateGroupInput
  ): Promise<{ group: Group }> => {
    return apiRequest<{ group: Group }>("/api/groups", {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        description: data.description || null,
        emoji: data.emoji || "👥",
      }),
    });
  };

  const fetchGroup = async (id: string): Promise<{ group: Group }> => {
    return apiRequest<{ group: Group }>(`/api/groups/${id}`);
  };

  const updateGroup = async (
    id: string,
    data: UpdateGroupInput
  ): Promise<{ group: Group }> => {
    return apiRequest<{ group: Group }>(`/api/groups/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  };

  const deleteGroup = async (id: string): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/api/groups/${id}`, {
      method: "DELETE",
    });
  };

  const fetchMembers = async (
    id: string
  ): Promise<{ members: GroupMember[] }> => {
    return apiRequest<{ members: GroupMember[] }>(`/api/groups/${id}/members`);
  };

  const addMember = async (
    id: string,
    userId: string
  ): Promise<{ member: GroupMember }> => {
    return apiRequest<{ member: GroupMember }>(`/api/groups/${id}/members`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
  };

  const updateMemberRole = async (
    id: string,
    userId: string,
    role: "admin" | "member"
  ): Promise<{ member: GroupMember }> => {
    return apiRequest<{ member: GroupMember }>(
      `/api/groups/${id}/members/${userId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ role }),
      }
    );
  };

  const removeMember = async (
    id: string,
    userId: string
  ): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(
      `/api/groups/${id}/members/${userId}`,
      {
        method: "DELETE",
      }
    );
  };

  const searchUsers = async (
    email: string
  ): Promise<{ users: SearchUser[] }> => {
    return apiRequest<{ users: SearchUser[] }>(
      `/api/users/search?email=${encodeURIComponent(email)}`
    );
  };

  return {
    fetchGroups,
    createGroup,
    fetchGroup,
    updateGroup,
    deleteGroup,
    fetchMembers,
    addMember,
    updateMemberRole,
    removeMember,
    searchUsers,
  };
}
