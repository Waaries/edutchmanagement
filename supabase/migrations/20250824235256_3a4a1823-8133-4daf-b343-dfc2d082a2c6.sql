-- Voeg ontbrekende index toe voor foreign key performance
CREATE INDEX IF NOT EXISTS idx_contract_templates_created_by 
ON public.contract_templates (created_by);

-- Verwijder ongebruikte indices die waarschijnlijk niet nodig zijn
DROP INDEX IF EXISTS public.idx_login_logs_ip_address;
DROP INDEX IF EXISTS public.idx_user_sessions_is_active;

-- Behoud belangrijke indices voor security monitoring:
-- idx_login_logs_user_id - voor gebruikersspecifieke login geschiedenis 
-- idx_login_logs_event_type - voor filteren op event types
-- idx_user_sessions_user_id - voor gebruikersspecifieke sessies