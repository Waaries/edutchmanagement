-- Fix security issues identified in the scan

-- 1. Fix user_roles table - restrict SELECT to only own roles unless admin
DROP POLICY IF EXISTS "Users can view roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (is_admin());

-- 2. Fix address_requests INSERT policy - require authentication
DROP POLICY IF EXISTS "Optimized insert policy" ON public.address_requests;

CREATE POLICY "Authenticated users can create address requests" 
ON public.address_requests 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- 3. Add stricter policies for contact_messages - ensure only admins can access
-- (Contact messages already have admin-only policies, but let's make them more explicit)
DROP POLICY IF EXISTS "Admins can view all contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can update contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Anyone can create contact messages" ON public.contact_messages;

CREATE POLICY "Only admins can view contact messages" 
ON public.contact_messages 
FOR SELECT 
USING (is_admin());

CREATE POLICY "Only admins can update contact messages" 
ON public.contact_messages 
FOR UPDATE 
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Anyone can create contact messages" 
ON public.contact_messages 
FOR INSERT 
WITH CHECK (true);

-- 4. Add additional security for filled_contracts
-- Ensure only admins can delete filled contracts
CREATE POLICY "Only admins can delete filled contracts" 
ON public.filled_contracts 
FOR DELETE 
USING (is_admin());