-- Verify and ensure the index is completely removed
-- Check if the index still exists and remove it if it does
DROP INDEX IF EXISTS public.idx_contract_templates_created_by;

-- Also check for any similar indexes that might exist
-- List all indexes on contract_templates table for verification
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'contract_templates' 
AND schemaname = 'public';