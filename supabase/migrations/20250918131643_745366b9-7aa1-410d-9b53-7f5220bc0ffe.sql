-- Fix unindexed foreign key and maintain performance-critical indexes
-- The "unused" indexes are actually critical for application performance and RLS policies
-- They haven't been used yet because the application doesn't have enough data/activity

-- Add missing index for foreign key constraint on login_logs.user_id
-- This was removed earlier but the foreign key constraint still exists
CREATE INDEX IF NOT EXISTS idx_login_logs_user_id ON public.login_logs(user_id);

-- Note: Keeping the existing "unused" indexes as they are performance-critical:
-- - idx_address_requests_user_id: Essential for RLS policies filtering by user_id
-- - idx_contract_template_fields_template_id: Required for template field joins
-- - idx_filled_contracts_template_id: Needed for contract-template relationships
-- - idx_user_sessions_user_id: Critical for session management and RLS

-- These indexes will become active once the application has more data and query activity