import { pgTable, text, timestamp, uuid, decimal, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { receiptItems } from './receipt-items';
import { users } from './users';

// =====================
// ITEM ASSIGNMENTS TABLE
// =====================
export const itemAssignments = pgTable('item_assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  receiptItemId: uuid('receipt_item_id')
    .references(() => receiptItems.id, { onDelete: 'cascade' })
    .notNull(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),

  // Split configuration
  splitType: text('split_type', {
    enum: ['full', 'percentage', 'amount']
  }).default('full').notNull(),
  splitValue: decimal('split_value', { precision: 10, scale: 2 }),
  calculatedAmount: decimal('calculated_amount', { precision: 10, scale: 2 }).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('item_assignments_item_idx').on(table.receiptItemId),
  index('item_assignments_user_idx').on(table.userId),
]);

// Relations
export const itemAssignmentsRelations = relations(itemAssignments, ({ one }) => ({
  item: one(receiptItems, {
    fields: [itemAssignments.receiptItemId],
    references: [receiptItems.id],
  }),
  user: one(users, {
    fields: [itemAssignments.userId],
    references: [users.id],
  }),
}));
