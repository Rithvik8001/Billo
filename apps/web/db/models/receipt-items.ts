import { pgTable, text, timestamp, integer, uuid, decimal, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { receipts } from './receipts';
import { itemAssignments } from './item-assignments';

// =====================
// RECEIPT ITEMS TABLE
// =====================
export const receiptItems = pgTable('receipt_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  receiptId: uuid('receipt_id')
    .references(() => receipts.id, { onDelete: 'cascade' })
    .notNull(),

  // Item details
  name: text('name').notNull(),
  quantity: decimal('quantity', { precision: 10, scale: 3 }).default('1').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),

  // Ordering and categorization
  lineNumber: integer('line_number'),
  category: text('category'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('receipt_items_receipt_idx').on(table.receiptId),
]);

// Relations
export const receiptItemsRelations = relations(receiptItems, ({ one, many }) => ({
  receipt: one(receipts, {
    fields: [receiptItems.receiptId],
    references: [receipts.id],
  }),
  assignments: many(itemAssignments),
}));
