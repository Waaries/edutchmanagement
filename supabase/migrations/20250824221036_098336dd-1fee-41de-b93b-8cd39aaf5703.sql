-- Create index for the foreign key on contract_templates.created_by
-- This will improve query performance when filtering or joining by created_by
CREATE INDEX IF NOT EXISTS idx_contract_templates_created_by 
ON public.contract_templates (created_by);