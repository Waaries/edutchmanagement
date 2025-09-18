-- Consolidate remaining overlapping RLS policies for better performance

-- Fix filled_contracts table - consolidate admin and token-based access
DROP POLICY IF EXISTS "Admin only select policy" ON public.filled_contracts;
DROP POLICY IF EXISTS "Admin only update policy" ON public.filled_contracts;
DROP POLICY IF EXISTS "Public can access contracts with valid tokens" ON public.filled_contracts;
DROP POLICY IF EXISTS "Public can update contracts with valid tokens" ON public.filled_contracts;

-- Create single consolidated policies for filled_contracts
CREATE POLICY "Consolidated contract access policy" 
ON public.filled_contracts 
FOR SELECT 
USING (
  is_admin() OR 
  (
    access_token IS NOT NULL 
    AND length(access_token) >= 10
    AND (expires_at IS NULL OR now() <= expires_at)
  )
);

CREATE POLICY "Consolidated contract update policy" 
ON public.filled_contracts 
FOR UPDATE 
USING (
  is_admin() OR 
  (
    access_token IS NOT NULL 
    AND length(access_token) >= 10
    AND (expires_at IS NULL OR now() <= expires_at)
    AND status != 'completed'
  )
)
WITH CHECK (
  is_admin() OR 
  (
    access_token IS NOT NULL 
    AND length(access_token) >= 10
    AND (expires_at IS NULL OR now() <= expires_at)
    AND status != 'completed'
  )
);

-- Fix user_sessions table - remove redundant admin policy since optimized policy already includes admin access
DROP POLICY IF EXISTS "Admins can manage sessions completely" ON public.user_sessions;

-- The "Optimized session access policy" already handles both admin and user access properly