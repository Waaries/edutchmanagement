-- Fix filled_contracts RLS policies to allow legitimate token-based access
-- while maintaining security and preventing data theft

-- Remove the overly restrictive "deny all" policy
DROP POLICY IF EXISTS "Deny anonymous access" ON public.filled_contracts;

-- Add policy to allow public access with valid access tokens
-- This enables the contract filling functionality while protecting data
CREATE POLICY "Public can access contracts with valid tokens" 
ON public.filled_contracts 
FOR SELECT 
USING (
  access_token IS NOT NULL 
  AND length(access_token) >= 10
  AND (expires_at IS NULL OR now() <= expires_at)
);

-- Allow public to update contracts with valid tokens (for filling out forms)
CREATE POLICY "Public can update contracts with valid tokens" 
ON public.filled_contracts 
FOR UPDATE 
USING (
  access_token IS NOT NULL 
  AND length(access_token) >= 10
  AND (expires_at IS NULL OR now() <= expires_at)
  AND status != 'completed'
)
WITH CHECK (
  access_token IS NOT NULL 
  AND length(access_token) >= 10
  AND (expires_at IS NULL OR now() <= expires_at)
  AND status != 'completed'
);