-- Migration: Create historical summary table for storing aggregated financial data
-- Description: Table to store weekly, monthly, and yearly financial summaries for historical analysis

-- Historical summaries for different time periods
CREATE TABLE IF NOT EXISTS historical_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('weekly', 'monthly', 'yearly')),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_income NUMERIC(14,2) NOT NULL DEFAULT 0,
    total_expense NUMERIC(14,2) NOT NULL DEFAULT 0,
    total_savings NUMERIC(14,2) NOT NULL DEFAULT 0,
    category_data TEXT, -- JSON string for category breakdown
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_historical_summaries_user_id ON historical_summaries(user_id);
CREATE INDEX IF NOT EXISTS idx_historical_summaries_period_type ON historical_summaries(period_type);
CREATE INDEX IF NOT EXISTS idx_historical_summaries_period_start ON historical_summaries(period_start);
CREATE INDEX IF NOT EXISTS idx_historical_summaries_period_end ON historical_summaries(period_end);
CREATE INDEX IF NOT EXISTS idx_historical_summaries_user_period ON historical_summaries(user_id, period_type, period_start);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_historical_summaries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_historical_summaries_updated_at
    BEFORE UPDATE ON historical_summaries
    FOR EACH ROW
    EXECUTE FUNCTION update_historical_summaries_updated_at();
