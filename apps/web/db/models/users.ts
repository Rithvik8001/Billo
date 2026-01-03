import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';
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
  currencyCode: text('currency_code').default('USD').notNull(),
  emailGroupInvites: boolean('email_group_invites').default(true).notNull(),
  emailSettlements: boolean('email_settlements').default(true).notNull(),
  emailPayments: boolean('email_payments').default(true).notNull(),
  emailWeeklySummary: boolean('email_weekly_summary').default(true).notNull(),
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
