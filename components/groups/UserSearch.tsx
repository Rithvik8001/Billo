"use client";

import { Input } from "@/components/ui/Input";

interface UserSearchProps {
  onSelect: (userId: string) => void;
}

export function UserSearch({ onSelect }: UserSearchProps) {
  return (
    <Input
      type="email"
      placeholder="Enter email address to invite"
      onChange={(e) => {
        // TODO: Implement user search
      }}
    />
  );
}
