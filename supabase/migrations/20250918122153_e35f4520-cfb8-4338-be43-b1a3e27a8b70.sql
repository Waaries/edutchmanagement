-- Update RLS policies: regular users can only VIEW their own requests
-- Remove UPDATE and DELETE policies for regular users

-- Drop existing policies
DROP POLICY IF EXISTS "Allow updating own requests" ON public.address_requests;
DROP POLICY IF EXISTS "Allow deleting own requests" ON public.address_requests;

-- Keep the viewing policy for authenticated users (they can view their own requests)
-- Keep the creation policy (anonymous + authenticated can create requests)

-- Only allow ADMINS to update and delete address requests
CREATE POLICY "Only admins can update requests" 
ON public.address_requests 
FOR UPDATE 
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Only admins can delete requests" 
ON public.address_requests 
FOR DELETE 
TO authenticated
USING (is_admin());