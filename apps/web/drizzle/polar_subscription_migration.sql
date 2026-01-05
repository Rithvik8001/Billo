
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_tier text DEFAULT 'free' NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS polar_customer_id text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS polar_subscription_id text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_current_period_end timestamp;

-- Index for quick customer lookups (used in webhook processing and portal access)
CREATE INDEX IF NOT EXISTS idx_users_polar_customer_id ON users(polar_customer_id);

-- Index for subscription tier lookups (used in rate limiting)
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);
