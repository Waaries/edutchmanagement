
-- 1. Remove anonymous SELECT access to recent address_requests
DROP POLICY IF EXISTS "anon_can_see_recent_submissions" ON public.address_requests;

-- 2. Remove sensitive tables from Realtime publication to prevent channel-level leaks
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'user_roles',
    'address_requests',
    'contact_messages',
    'contract_templates',
    'contract_template_fields',
    'filled_contracts'
  ])
  LOOP
    IF EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = t
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime DROP TABLE public.%I', t);
    END IF;
  END LOOP;
END $$;
