-- Fix critical security vulnerability: Remove anonymous access to address_requests
-- This prevents unauthorized access to sensitive customer contact information

DROP POLICY IF EXISTS "Optimized view policy" ON public.address_requests;

-- Create secure SELECT policy that only allows:
-- 1. Users to view their own requests
-- 2. Admins to view all requests
-- 3. NO anonymous access
CREATE POLICY "Secure view policy" ON public.address_requests
FOR SELECT
USING (
  (auth.uid() IS NOT NULL) AND 
  ((user_id = auth.uid()) OR is_admin())
);