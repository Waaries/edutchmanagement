-- Remove unused index on contract_templates.created_by
-- This index has not been used and is consuming unnecessary storage and slowing down writes
DROP INDEX IF EXISTS public.idx_contract_templates_created_by;