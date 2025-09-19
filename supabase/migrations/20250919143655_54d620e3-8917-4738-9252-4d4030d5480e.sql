-- CRITICAL FIX: Allow anonymous users to submit address requests

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "address_requests_anon_insert" ON public.address_requests;
DROP POLICY IF EXISTS "address_requests_authenticated_insert" ON public.address_requests;
DROP POLICY IF EXISTS "address_requests_public_insert" ON public.address_requests;

-- Create a comprehensive policy for anonymous and authenticated users
CREATE POLICY "allow_public_insert_address_requests"
ON public.address_requests
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Ensure ip_address and user_id can be null for anonymous submissions
ALTER TABLE public.address_requests 
ALTER COLUMN ip_address DROP NOT NULL;

ALTER TABLE public.address_requests 
ALTER COLUMN user_id DROP NOT NULL;

-- Log this critical fix
INSERT INTO public.security_audit_logs (
  action, resource_type, success, metadata
) VALUES (
  'critical_rls_fix_applied', 'address_requests', true,
  jsonb_build_object('fix_type', 'anonymous_form_submission', 'timestamp', NOW())
);