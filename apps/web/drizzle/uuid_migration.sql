
-- ===========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- STEP 2: Add UUID columns to all tables
-- ===========================================

-- Groups table
ALTER TABLE groups ADD COLUMN uuid UUID DEFAULT uuid_generate_v4();
UPDATE groups SET uuid = uuid_generate_v4() WHERE uuid IS NULL;
ALTER TABLE groups ALTER COLUMN uuid SET NOT NULL;

-- Receipts table
ALTER TABLE receipts ADD COLUMN uuid UUID DEFAULT uuid_generate_v4();
UPDATE receipts SET uuid = uuid_generate_v4() WHERE uuid IS NULL;
ALTER TABLE receipts ALTER COLUMN uuid SET NOT NULL;

-- Add new group_uuid FK column to receipts
ALTER TABLE receipts ADD COLUMN group_uuid UUID;
UPDATE receipts r SET group_uuid = g.uuid FROM groups g WHERE r.group_id = g.id;

-- Receipt Items table
ALTER TABLE receipt_items ADD COLUMN uuid UUID DEFAULT uuid_generate_v4();
UPDATE receipt_items SET uuid = uuid_generate_v4() WHERE uuid IS NULL;
ALTER TABLE receipt_items ALTER COLUMN uuid SET NOT NULL;

-- Add new receipt_uuid FK column
ALTER TABLE receipt_items ADD COLUMN receipt_uuid UUID;
UPDATE receipt_items ri SET receipt_uuid = r.uuid FROM receipts r WHERE ri.receipt_id = r.id;
ALTER TABLE receipt_items ALTER COLUMN receipt_uuid SET NOT NULL;

-- Group Members table
ALTER TABLE group_members ADD COLUMN uuid UUID DEFAULT uuid_generate_v4();
UPDATE group_members SET uuid = uuid_generate_v4() WHERE uuid IS NULL;
ALTER TABLE group_members ALTER COLUMN uuid SET NOT NULL;

-- Add new group_uuid FK column
ALTER TABLE group_members ADD COLUMN group_uuid UUID;
UPDATE group_members gm SET group_uuid = g.uuid FROM groups g WHERE gm.group_id = g.id;
ALTER TABLE group_members ALTER COLUMN group_uuid SET NOT NULL;

-- Item Assignments table
ALTER TABLE item_assignments ADD COLUMN uuid UUID DEFAULT uuid_generate_v4();
UPDATE item_assignments SET uuid = uuid_generate_v4() WHERE uuid IS NULL;
ALTER TABLE item_assignments ALTER COLUMN uuid SET NOT NULL;

-- Add new receipt_item_uuid FK column
ALTER TABLE item_assignments ADD COLUMN receipt_item_uuid UUID;
UPDATE item_assignments ia SET receipt_item_uuid = ri.uuid FROM receipt_items ri WHERE ia.receipt_item_id = ri.id;
ALTER TABLE item_assignments ALTER COLUMN receipt_item_uuid SET NOT NULL;

-- Settlements table
ALTER TABLE settlements ADD COLUMN uuid UUID DEFAULT uuid_generate_v4();
UPDATE settlements SET uuid = uuid_generate_v4() WHERE uuid IS NULL;
ALTER TABLE settlements ALTER COLUMN uuid SET NOT NULL;

-- Add new receipt_uuid and group_uuid FK columns
ALTER TABLE settlements ADD COLUMN receipt_uuid UUID;
UPDATE settlements s SET receipt_uuid = r.uuid FROM receipts r WHERE s.receipt_id = r.id;

ALTER TABLE settlements ADD COLUMN group_uuid UUID;
UPDATE settlements s SET group_uuid = g.uuid FROM groups g WHERE s.group_id = g.id;

-- ===========================================
-- STEP 3: Drop old foreign key constraints
-- ===========================================

-- Drop existing FK constraints (names from migration files)
ALTER TABLE receipts DROP CONSTRAINT IF EXISTS receipts_group_id_groups_id_fk;
ALTER TABLE receipt_items DROP CONSTRAINT IF EXISTS receipt_items_receipt_id_receipts_id_fk;
ALTER TABLE group_members DROP CONSTRAINT IF EXISTS group_members_group_id_groups_id_fk;
ALTER TABLE item_assignments DROP CONSTRAINT IF EXISTS item_assignments_receipt_item_id_receipt_items_id_fk;
ALTER TABLE settlements DROP CONSTRAINT IF EXISTS settlements_receipt_id_receipts_id_fk;
ALTER TABLE settlements DROP CONSTRAINT IF EXISTS settlements_group_id_groups_id_fk;

-- ===========================================
-- STEP 4: Drop old integer ID columns and rename UUID columns
-- ===========================================

-- Groups
ALTER TABLE groups DROP COLUMN id CASCADE;
ALTER TABLE groups RENAME COLUMN uuid TO id;
ALTER TABLE groups ADD PRIMARY KEY (id);

-- Receipts
ALTER TABLE receipts DROP COLUMN id CASCADE;
ALTER TABLE receipts RENAME COLUMN uuid TO id;
ALTER TABLE receipts ADD PRIMARY KEY (id);
ALTER TABLE receipts DROP COLUMN group_id;
ALTER TABLE receipts RENAME COLUMN group_uuid TO group_id;

-- Receipt Items
ALTER TABLE receipt_items DROP COLUMN id CASCADE;
ALTER TABLE receipt_items RENAME COLUMN uuid TO id;
ALTER TABLE receipt_items ADD PRIMARY KEY (id);
ALTER TABLE receipt_items DROP COLUMN receipt_id;
ALTER TABLE receipt_items RENAME COLUMN receipt_uuid TO receipt_id;

-- Group Members
ALTER TABLE group_members DROP COLUMN id CASCADE;
ALTER TABLE group_members RENAME COLUMN uuid TO id;
ALTER TABLE group_members ADD PRIMARY KEY (id);
ALTER TABLE group_members DROP COLUMN group_id;
ALTER TABLE group_members RENAME COLUMN group_uuid TO group_id;

-- Item Assignments
ALTER TABLE item_assignments DROP COLUMN id CASCADE;
ALTER TABLE item_assignments RENAME COLUMN uuid TO id;
ALTER TABLE item_assignments ADD PRIMARY KEY (id);
ALTER TABLE item_assignments DROP COLUMN receipt_item_id;
ALTER TABLE item_assignments RENAME COLUMN receipt_item_uuid TO receipt_item_id;

-- Settlements
ALTER TABLE settlements DROP COLUMN id CASCADE;
ALTER TABLE settlements RENAME COLUMN uuid TO id;
ALTER TABLE settlements ADD PRIMARY KEY (id);
ALTER TABLE settlements DROP COLUMN receipt_id;
ALTER TABLE settlements RENAME COLUMN receipt_uuid TO receipt_id;
ALTER TABLE settlements DROP COLUMN group_id;
ALTER TABLE settlements RENAME COLUMN group_uuid TO group_id;

-- ===========================================
-- STEP 5: Add new foreign key constraints
-- ===========================================

ALTER TABLE receipts ADD CONSTRAINT receipts_group_id_fk 
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL;

ALTER TABLE receipt_items ADD CONSTRAINT receipt_items_receipt_id_fk 
  FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE CASCADE;

ALTER TABLE group_members ADD CONSTRAINT group_members_group_id_fk 
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE;

ALTER TABLE item_assignments ADD CONSTRAINT item_assignments_receipt_item_id_fk 
  FOREIGN KEY (receipt_item_id) REFERENCES receipt_items(id) ON DELETE CASCADE;

ALTER TABLE settlements ADD CONSTRAINT settlements_receipt_id_fk 
  FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE CASCADE;

ALTER TABLE settlements ADD CONSTRAINT settlements_group_id_fk 
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE;

-- ===========================================
-- STEP 6: Recreate indexes
-- ===========================================

DROP INDEX IF EXISTS receipts_group_idx;
CREATE INDEX receipts_group_idx ON receipts(group_id);

DROP INDEX IF EXISTS receipt_items_receipt_idx;
CREATE INDEX receipt_items_receipt_idx ON receipt_items(receipt_id);

DROP INDEX IF EXISTS group_members_group_idx;
CREATE INDEX group_members_group_idx ON group_members(group_id);

DROP INDEX IF EXISTS item_assignments_item_idx;
CREATE INDEX item_assignments_item_idx ON item_assignments(receipt_item_id);

DROP INDEX IF EXISTS settlements_receipt_idx;
CREATE INDEX settlements_receipt_idx ON settlements(receipt_id);

-- Recreate unique constraint for group_members
ALTER TABLE group_members DROP CONSTRAINT IF EXISTS unique_group_member;
ALTER TABLE group_members ADD CONSTRAINT unique_group_member UNIQUE (group_id, user_id);

