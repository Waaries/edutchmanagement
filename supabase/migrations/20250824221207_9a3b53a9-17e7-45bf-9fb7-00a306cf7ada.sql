-- Remove unused index on contract_templates.created_by
-- The index was created for foreign key optimization but is not being used by any queries
DROP INDEX IF EXISTS public.idx_contract_templates_created_by;