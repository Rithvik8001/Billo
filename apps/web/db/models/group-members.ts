import { pgTable, text, timestamp, integer, index, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { groups } from './groups';
import { users } from './users';

// =====================
// GROUP MEMBERS TABLE (Junction)
// =====================
export const groupMembers = pgTable('group_members', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  groupId: integer('group_id')
    .references(() => groups.id, { onDelete: 'cascade' })
    .notNull(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  role: text('role', { enum: ['admin', 'member'] }).default('member').notNull(),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
}, (table) => [
  index('group_members_group_idx').on(table.groupId),
  index('group_members_user_idx').on(table.userId),
  unique('unique_group_member').on(table.groupId, table.userId),
]);

// Relations
export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [groupMembers.userId],
    references: [users.id],
  }),
}));
