import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { receipts } from './receipts';
import { groups } from './groups';
import { groupMembers } from './group-members';
import { itemAssignments } from './item-assignments';
import { settlements } from './settlements';

// =====================
// USERS TABLE (Clerk Integration)
// =====================
export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk user ID as primary key
  clerkUserId: text('clerk_user_id').notNull().unique(),
  email: text('email').notNull(),
  name: text('name'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  receipts: many(receipts),
  groupsCreated: many(groups),
  groupMemberships: many(groupMembers),
  itemAssignments: many(itemAssignments),
  settlementsFrom: many(settlements, { relationName: 'settlementFrom' }),
  settlementsTo: many(settlements, { relationName: 'settlementTo' }),
}));
