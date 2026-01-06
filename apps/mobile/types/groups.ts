export interface Group {
  id: string;
  name: string;
  description: string | null;
  emoji: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GroupMember {
  userId: string;
  name: string | null;
  email: string;
  imageUrl: string | null;
  role: "admin" | "member";
  joinedAt: string;
}

export interface SearchUser {
  id: string;
  name: string | null;
  email: string;
  imageUrl: string | null;
}

export interface CreateGroupInput {
  name: string;
  description?: string | null;
  emoji?: string;
}

export interface UpdateGroupInput {
  name?: string;
  description?: string | null;
  emoji?: string;
}
