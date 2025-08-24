-- Complete the realtime configuration for all tables
-- Set REPLICA IDENTITY FULL for tables that need it
ALTER TABLE public.contract_templates REPLICA IDENTITY FULL;
ALTER TABLE public.contract_template_fields REPLICA IDENTITY FULL;  
ALTER TABLE public.filled_contracts REPLICA IDENTITY FULL;
ALTER TABLE public.user_roles REPLICA IDENTITY FULL;

-- Add missing tables to the supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.contract_templates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contract_template_fields;
ALTER PUBLICATION supabase_realtime ADD TABLE public.filled_contracts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_roles;