-- Finance Management Database Initialization Script
-- This script sets up the initial database schema for the finance management application

-- Enable UUID extension for generating unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create notes table for the docs/notes feature
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    category VARCHAR(100) DEFAULT 'general',
    tags TEXT[], -- Array of tags for better organization
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create transactions table for financial data
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    transaction_type VARCHAR(20) CHECK (transaction_type IN ('income', 'expense', 'transfer')),
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table for better organization
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('income', 'expense', 'note')),
    color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color code
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_category ON notes(category);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at);
CREATE INDEX IF NOT EXISTS idx_notes_tags ON notes USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);

CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a default system user for default categories
INSERT INTO users (id, email, username, password_hash, first_name, last_name) VALUES
    ('00000000-0000-0000-0000-000000000000', 'system@finance-management.local', 'system', '$2a$10$dummy.hash.for.system.user', 'System', 'User')
ON CONFLICT (id) DO NOTHING;

-- Insert some default categories (will be copied to new users when they register)
INSERT INTO categories (user_id, name, type, color, icon) VALUES
    ('00000000-0000-0000-0000-000000000000', 'General', 'note', '#6B7280', 'document-text'),
    ('00000000-0000-0000-0000-000000000000', 'Plans', 'note', '#3B82F6', 'calendar'),
    ('00000000-0000-0000-0000-000000000000', 'Strategies', 'note', '#10B981', 'light-bulb'),
    ('00000000-0000-0000-0000-000000000000', 'Wishlist', 'note', '#F59E0B', 'heart'),
    ('00000000-0000-0000-0000-000000000000', 'Bullet Points', 'note', '#8B5CF6', 'list-bullet')
ON CONFLICT DO NOTHING;

-- Function to copy default categories to a new user
CREATE OR REPLACE FUNCTION copy_default_categories_to_user(new_user_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO categories (user_id, name, type, color, icon)
    SELECT new_user_id, name, type, color, icon
    FROM categories
    WHERE user_id = '00000000-0000-0000-0000-000000000000';
END;
$$ LANGUAGE plpgsql;

-- Create a view for notes with user information
CREATE OR REPLACE VIEW notes_with_user AS
SELECT 
    n.id,
    n.user_id,
    u.username,
    n.title,
    n.content,
    n.category,
    n.tags,
    n.is_favorite,
    n.created_at,
    n.updated_at
FROM notes n
JOIN users u ON n.user_id = u.id;

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO finance_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO finance_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO finance_user;
