-- CRITICAL FIX: Remove blocking RLS policy causing 401 error

-- Remove the problematic policy that blocks all SELECT operations
DROP POLICY IF EXISTS "address_requests_deny_public_read" ON public.address_requests;

-- Allow anonymous users to see recently submitted requests (1 hour window for confirmation)
CREATE POLICY "anon_can_see_recent_submissions" 
ON public.address_requests 
FOR SELECT 
TO anon 
USING (created_at > NOW() - INTERVAL '1 hour');

-- Allow authenticated users to see their own requests and admins to see all
CREATE POLICY "authenticated_users_see_own_requests" 
ON public.address_requests 
FOR SELECT 
TO authenticated 
USING (
  user_id = auth.uid() 
  OR 
  is_admin()
);

-- Log this critical policy fix
INSERT INTO public.security_audit_logs (
  action, resource_type, success, metadata
) VALUES (
  'blocking_rls_policy_removed', 'address_requests', true,
  jsonb_build_object('removed_policy', 'address_requests_deny_public_read', 'reason', 'blocking_anonymous_submissions', 'timestamp', NOW())
);