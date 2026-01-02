import { Badge } from "@/components/ui/badge";
import type { GroupMember } from "@/lib/assignment-types";

interface PersonManagerProps {
  members: GroupMember[];
}

export function PersonManager({ members }: PersonManagerProps) {
  if (members.length === 0) {
    return (
      <div className="mt-4 text-sm text-muted-foreground">
        No members in this group yet
      </div>
    );
  }

  return (
    <div className="mt-4">
      <p className="text-sm font-medium mb-2">Group Members:</p>
      <div className="flex flex-wrap gap-2">
        {members.map((member) => (
          <Badge key={member.userId} variant="secondary" className="gap-1.5">
            {member.imageUrl && (
              <img
                src={member.imageUrl}
                alt={member.name || member.email}
                className="size-4 rounded-full"
              />
            )}
            <span>{member.name || member.email.split("@")[0]}</span>
          </Badge>
        ))}
      </div>
    </div>
  );
}
