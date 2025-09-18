-- Clean up truly unnecessary indexes while keeping performance-critical ones
-- 
-- KEEPING these indexes as they're important for application performance:
-- - idx_address_requests_user_id: Critical for RLS filtering by user_id
-- - idx_contract_template_fields_template_id: Needed for loading template fields
-- - idx_filled_contracts_template_id: Needed for joining contract data with templates
-- - idx_user_sessions_user_id: Critical for RLS and user session queries
-- 
-- REMOVING indexes that are less likely to be used in normal application flow:

-- Remove login logs indexes - these tables are primarily append-only with minimal querying
DROP INDEX IF EXISTS idx_login_logs_created_at;
DROP INDEX IF EXISTS idx_login_logs_event_type;  
DROP INDEX IF EXISTS idx_login_logs_user_id;

-- Remove last_activity index - we mainly query sessions by user_id, not by activity time
DROP INDEX IF EXISTS idx_user_sessions_last_activity;

-- Note: Keeping the other indexes as they will become performance-critical as data grows:
-- - Address requests filtered by user (RLS policies)
-- - Contract templates and their fields (join operations)
-- - Filled contracts linked to templates (admin queries)
-- - User sessions by user_id (session management)