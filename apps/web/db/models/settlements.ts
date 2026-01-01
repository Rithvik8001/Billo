import { pgTable, text, timestamp, integer, decimal, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { receipts } from './receipts';
import { groups } from './groups';
import { users } from './users';

// =====================
// SETTLEMENTS TABLE
// =====================
export const settlements = pgTable('settlements', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  receiptId: integer('receipt_id')
    .references(() => receipts.id, { onDelete: 'cascade' }),
  groupId: integer('group_id')
    .references(() => groups.id, { onDelete: 'cascade' }),

  // Payment details
  fromUserId: text('from_user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  toUserId: text('to_user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('USD'),

  // Status
  status: text('status', {
    enum: ['pending', 'completed', 'cancelled']
  }).default('pending').notNull(),
  settledAt: timestamp('settled_at'),

  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('settlements_receipt_idx').on(table.receiptId),
  index('settlements_from_user_idx').on(table.fromUserId),
  index('settlements_to_user_idx').on(table.toUserId),
]);

// Relations
export const settlementsRelations = relations(settlements, ({ one }) => ({
  receipt: one(receipts, {
    fields: [settlements.receiptId],
    references: [receipts.id],
  }),
  group: one(groups, {
    fields: [settlements.groupId],
    references: [groups.id],
  }),
  fromUser: one(users, {
    fields: [settlements.fromUserId],
    references: [users.id],
    relationName: 'settlementFrom',
  }),
  toUser: one(users, {
    fields: [settlements.toUserId],
    references: [users.id],
    relationName: 'settlementTo',
  }),
}));
