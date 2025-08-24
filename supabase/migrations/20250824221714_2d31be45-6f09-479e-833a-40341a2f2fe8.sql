-- Add index to cover the foreign key contract_templates_created_by_fkey
-- Even if query stats show low usage, FKs benefit from indexes for enforcement and deletes/updates
CREATE INDEX IF NOT EXISTS idx_contract_templates_created_by
  ON public.contract_templates (created_by);