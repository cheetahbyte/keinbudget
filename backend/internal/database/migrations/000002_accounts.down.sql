-- Drop the trigger and function if they exist
DROP TRIGGER IF EXISTS update_accounts_updated_at ON accounts;
DROP FUNCTION IF EXISTS update_updated_at_column;

-- Drop the accounts table
DROP TABLE IF EXISTS accounts;