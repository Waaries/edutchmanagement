-- Fix address requests RLS policy to allow anonymous users to create requests
-- This is needed for the public contact/request form

-- Drop the current restrictive policy
DROP POLICY IF EXISTS "Authenticated users can create address requests" ON public.address_requests;

-- Create a new policy that allows anyone to create address requests
CREATE POLICY "Anyone can create address requests" 
ON public.address_requests 
FOR INSERT 
WITH CHECK (true);

-- Update the select policy to allow viewing own requests for anonymous users too
-- Keep the existing secure view policy but make it more flexible
DROP POLICY IF EXISTS "Secure view policy" ON public.address_requests;

CREATE POLICY "Users can view own requests and admins can view all" 
ON public.address_requests 
FOR SELECT 
USING (
  -- Allow if user is admin
  is_admin() 
  OR 
  -- Allow if it's the user's own request (for authenticated users)
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
  OR
  -- For anonymous requests, we don't allow viewing (since they can't identify themselves)
  -- Only admins can see anonymous requests
  false
);