-- Remove unused index on contract_templates table
-- This index has never been used and removing it will improve write performance
DROP INDEX IF EXISTS public.idx_contract_templates_created_by;