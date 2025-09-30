-- Migration: Add performance indexes based on usage patterns
-- Created: 2024-01-15 (after monitoring production queries)
-- Description: Add indexes for frequently queried columns

-- Only add these indexes AFTER you've identified they're needed through query analysis

-- Add category index if filtering by category becomes common
-- CREATE INDEX IF NOT EXISTS idx_notes_category ON notes(category);

-- Add boolean indexes only if these queries become frequent
-- CREATE INDEX IF NOT EXISTS idx_notes_is_archived ON notes(is_archived);
-- CREATE INDEX IF NOT EXISTS idx_notes_is_favorite ON notes(is_favorite);

-- Composite indexes for complex queries (add as needed)
-- CREATE INDEX IF NOT EXISTS idx_notes_user_archived ON notes(user_id, is_archived);
-- CREATE INDEX IF NOT EXISTS idx_notes_user_favorite ON notes(user_id, is_favorite);
