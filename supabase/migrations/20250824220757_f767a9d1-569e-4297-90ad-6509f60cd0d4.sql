-- Fix Auth RLS Initialization Plan warnings and Multiple Permissive Policies warnings
-- This migration optimizes RLS policies for better performance

-- Fix address_requests table RLS policies
DROP POLICY IF EXISTS "Secure view policy" ON public.address_requests;
DROP POLICY IF EXISTS "Authenticated users can create address requests" ON public.address_requests;
DROP POLICY IF EXISTS "Optimized update policy" ON public.address_requests;
DROP POLICY IF EXISTS "Optimized delete policy" ON public.address_requests;

-- Create optimized policies for address_requests using (select auth.uid())
CREATE POLICY "Secure view policy" 
ON public.address_requests 
FOR SELECT 
USING (((SELECT auth.uid()) IS NOT NULL) AND ((user_id = (SELECT auth.uid())) OR is_admin()));

CREATE POLICY "Authenticated users can create address requests" 
ON public.address_requests 
FOR INSERT 
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Optimized update policy" 
ON public.address_requests 
FOR UPDATE 
USING (((SELECT auth.uid()) IS NOT NULL) AND ((user_id = (SELECT auth.uid())) OR is_admin()))
WITH CHECK (((SELECT auth.uid()) IS NOT NULL) AND ((user_id = (SELECT auth.uid())) OR is_admin()));

CREATE POLICY "Optimized delete policy" 
ON public.address_requests 
FOR DELETE 
USING (((SELECT auth.uid()) IS NOT NULL) AND ((user_id = (SELECT auth.uid())) OR is_admin()));

-- Fix user_roles table RLS policies - consolidate overlapping policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;

-- Create consolidated policies for user_roles
CREATE POLICY "View roles policy" 
ON public.user_roles 
FOR SELECT 
USING ((user_id = (SELECT auth.uid())) OR is_admin());

CREATE POLICY "Admins can insert roles" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (is_admin());

CREATE POLICY "Admins can update roles" 
ON public.user_roles 
FOR UPDATE 
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admins can delete roles" 
ON public.user_roles 
FOR DELETE 
USING (is_admin());

-- Fix filled_contracts table - consolidate overlapping policies
DROP POLICY IF EXISTS "Deny all access to unauthenticated users" ON public.filled_contracts;
DROP POLICY IF EXISTS "Deny access to non-admin authenticated users" ON public.filled_contracts;
DROP POLICY IF EXISTS "Admins can view all filled contracts" ON public.filled_contracts;
DROP POLICY IF EXISTS "Admins can insert filled contracts" ON public.filled_contracts;
DROP POLICY IF EXISTS "Admins can update filled contracts" ON public.filled_contracts;
DROP POLICY IF EXISTS "Admins can delete filled contracts" ON public.filled_contracts;

-- Create consolidated policies for filled_contracts (single policy per action)
CREATE POLICY "Admin only select policy" 
ON public.filled_contracts 
FOR SELECT 
TO authenticated
USING (is_admin());

CREATE POLICY "Admin only insert policy" 
ON public.filled_contracts 
FOR INSERT 
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Admin only update policy" 
ON public.filled_contracts 
FOR UPDATE 
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admin only delete policy" 
ON public.filled_contracts 
FOR DELETE 
TO authenticated
USING (is_admin());

-- Explicit deny policy for anonymous users (single policy)
CREATE POLICY "Deny anonymous access" 
ON public.filled_contracts 
FOR ALL 
TO anon 
USING (false) 
WITH CHECK (false);

-- Fix duplicate indexes - remove the redundant one
DROP INDEX IF EXISTS public.idx_filled_contracts_access_token_unique;

-- Ensure we still have the necessary unique constraint (the other index should remain)
-- The filled_contracts_access_token_key constraint should still exist