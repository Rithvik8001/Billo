ALTER TABLE "receipts" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "receipts" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "receipts" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "receipts" ALTER COLUMN "group_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "receipt_items" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "receipt_items" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "receipt_items" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "receipt_items" ALTER COLUMN "receipt_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "groups" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "groups" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "groups" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "group_members" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "group_members" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "group_members" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "group_members" ALTER COLUMN "group_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "item_assignments" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "item_assignments" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "item_assignments" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "item_assignments" ALTER COLUMN "receipt_item_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "settlements" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "settlements" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "settlements" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "settlements" ALTER COLUMN "receipt_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "settlements" ALTER COLUMN "group_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "currency_code" text DEFAULT 'USD' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_group_invites" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_settlements" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_payments" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_weekly_summary" boolean DEFAULT true NOT NULL;