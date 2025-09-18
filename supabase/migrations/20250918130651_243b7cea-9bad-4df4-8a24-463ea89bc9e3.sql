-- Fix Auth RLS Performance Issues and Clean Up Redundant Policies

-- 1. Fix auth performance issues by wrapping auth.uid() calls in SELECT statements
-- This prevents re-evaluation for each row, improving query performance

-- Drop and recreate profiles policies with optimized auth calls
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (id = (SELECT auth.uid()));

CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (id = (SELECT auth.uid()));

-- Drop and recreate address_requests policies with optimized auth calls and consolidated logic
DROP POLICY IF EXISTS "Users can view their own requests" ON public.address_requests;
DROP POLICY IF EXISTS "Users can delete their own requests" ON public.address_requests;

-- Create single consolidated policies that handle both admin and user access
CREATE POLICY "Admin or user can view address requests" 
ON public.address_requests 
FOR SELECT 
USING (
  is_admin() OR 
  (user_id = (SELECT auth.uid()) AND (SELECT auth.uid()) IS NOT NULL)
);

CREATE POLICY "Admin or user can delete address requests" 
ON public.address_requests 
FOR DELETE 
USING (
  is_admin() OR 
  (user_id = (SELECT auth.uid()) AND (SELECT auth.uid()) IS NOT NULL)
);

-- Drop redundant admin policies since they're now handled in the consolidated policies above
DROP POLICY IF EXISTS "Admins can view all address requests" ON public.address_requests;
DROP POLICY IF EXISTS "Admins can delete address requests" ON public.address_requests;

-- Fix user_sessions policy with optimized auth calls
DROP POLICY IF EXISTS "Unified session access policy" ON public.user_sessions;

CREATE POLICY "Optimized session access policy" 
ON public.user_sessions 
FOR SELECT 
USING (
  is_admin() OR 
  (user_id = (SELECT auth.uid()))
);

-- Clean up contract template redundant policies
-- Remove the conflicting deny policies and keep only the admin policies
DROP POLICY IF EXISTS "Deny anonymous access to contract templates" ON public.contract_templates;
DROP POLICY IF EXISTS "Only admins can access contract templates" ON public.contract_templates;

-- Clean up contract template fields redundant policies  
DROP POLICY IF EXISTS "Deny anonymous access to contract template fields" ON public.contract_template_fields;
DROP POLICY IF EXISTS "Only authenticated users can access contract template fields" ON public.contract_template_fields;