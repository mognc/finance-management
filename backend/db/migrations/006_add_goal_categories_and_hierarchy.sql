-- Migration: Add goal categories and hierarchical goals support
-- Description: Add categories to goals and support for main goals with sub-goals

-- Add category column to goals table
ALTER TABLE goals ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'general';
ALTER TABLE goals ADD COLUMN IF NOT EXISTS parent_goal_id UUID NULL;
ALTER TABLE goals ADD COLUMN IF NOT EXISTS is_main_goal BOOLEAN DEFAULT true;
ALTER TABLE goals ADD COLUMN IF NOT EXISTS description TEXT;

-- Add foreign key constraint for parent_goal_id
ALTER TABLE goals ADD CONSTRAINT fk_goals_parent_goal 
    FOREIGN KEY (parent_goal_id) REFERENCES goals(id) ON DELETE CASCADE;

-- Create index for parent_goal_id
CREATE INDEX IF NOT EXISTS idx_goals_parent_goal_id ON goals(parent_goal_id);
CREATE INDEX IF NOT EXISTS idx_goals_category ON goals(category);
CREATE INDEX IF NOT EXISTS idx_goals_is_main_goal ON goals(is_main_goal);

-- Create goal_categories table for predefined categories
CREATE TABLE IF NOT EXISTS goal_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7), -- hex color code
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Insert predefined goal categories
INSERT INTO goal_categories (name, description, icon, color) VALUES
('Travel', 'Travel and vacation goals', 'plane', '#3b82f6'),
('Education', 'Educational goals and courses', 'graduation-cap', '#10b981'),
('Lifestyle', 'Lifestyle upgrades and improvements', 'home', '#f59e0b'),
('Health', 'Health and fitness goals', 'heart', '#ef4444'),
('Technology', 'Technology and gadgets', 'smartphone', '#8b5cf6'),
('Emergency', 'Emergency fund and safety nets', 'shield', '#06b6d4'),
('Investment', 'Investment and wealth building', 'trending-up', '#84cc16'),
('General', 'General savings goals', 'target', '#6b7280')
ON CONFLICT (name) DO NOTHING;

-- Create goal_expenses table to track expenses associated with goals
CREATE TABLE IF NOT EXISTS goal_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    goal_id UUID NOT NULL,
    expense_id UUID NOT NULL,
    amount NUMERIC(14,2) NOT NULL CHECK (amount >= 0),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_goal_expenses_goal FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE,
    CONSTRAINT fk_goal_expenses_expense FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_goal_expenses_user_id ON goal_expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_goal_expenses_goal_id ON goal_expenses(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_expenses_expense_id ON goal_expenses(expense_id);

-- Update existing goals to have category 'General' if not set
UPDATE goals SET category = 'General' WHERE category IS NULL OR category = '';

-- Add trigger to update updated_at for goals
DROP TRIGGER IF EXISTS update_goals_updated_at ON goals;
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
