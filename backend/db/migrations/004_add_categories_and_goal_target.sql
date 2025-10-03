-- Migration: Add categories table and goal target_date

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Use non-unique index to avoid failure if duplicates exist; enforce via UI for now
CREATE INDEX IF NOT EXISTS idx_categories_user_name ON categories(user_id, name);

-- Extend goals with optional target_date
ALTER TABLE goals ADD COLUMN IF NOT EXISTS target_date DATE;


