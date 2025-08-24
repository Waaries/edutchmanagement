-- Fix performance issues: Add missing foreign key index and remove unused indexes

-- 1) Add index for foreign key on contract_templates.created_by for better join performance
CREATE INDEX IF NOT EXISTS idx_contract_templates_created_by ON public.contract_templates(created_by);

-- 2) Remove unused indexes that are not being utilized
DROP INDEX IF EXISTS public.idx_contract_templates_status;
DROP INDEX IF EXISTS public.idx_filled_contracts_access_token;
DROP INDEX IF EXISTS public.idx_filled_contracts_status;

-- Note: We keep the unique index on access_token since it's used for security validation