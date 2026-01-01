import { pgTable, text, timestamp, integer, decimal, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { receiptItems } from './receipt-items';
import { settlements } from './settlements';

// =====================
// RECEIPTS TABLE
// =====================
export const receipts = pgTable('receipts', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),

  // Cloudinary image data
  imageUrl: text('image_url').notNull(),
  imagePublicId: text('image_public_id').notNull(),
  thumbnailUrl: text('thumbnail_url'),

  // Receipt metadata
  merchantName: text('merchant_name'),
  merchantAddress: text('merchant_address'),
  purchaseDate: timestamp('purchase_date'),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }),
  tax: decimal('tax', { precision: 10, scale: 2 }),

  // Processing workflow
  status: text('status', {
    enum: ['pending', 'uploading', 'processing', 'completed', 'failed']
  }).default('pending').notNull(),

  // AI extraction metadata
  extractedData: jsonb('extracted_data'), // Raw AI response
  extractionError: text('extraction_error'),
  extractedAt: timestamp('extracted_at'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('receipts_user_idx').on(table.userId),
  index('receipts_status_idx').on(table.status),
]);

// Relations
export const receiptsRelations = relations(receipts, ({ one, many }) => ({
  user: one(users, {
    fields: [receipts.userId],
    references: [users.id],
  }),
  items: many(receiptItems),
  settlements: many(settlements),
}));
