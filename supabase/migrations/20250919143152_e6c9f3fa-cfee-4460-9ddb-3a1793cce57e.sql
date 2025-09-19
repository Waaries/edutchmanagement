-- Fix address_requests RLS policies to allow anonymous user submissions

-- Drop the existing public insert policy 
DROP POLICY IF EXISTS "address_requests_public_insert" ON public.address_requests;

-- Create proper insert policy for anonymous users (anon role)
CREATE POLICY "address_requests_anon_insert" 
ON public.address_requests 
FOR INSERT 
TO anon
WITH CHECK (true);

-- Also create insert policy for authenticated users
CREATE POLICY "address_requests_authenticated_insert" 
ON public.address_requests 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Ensure the user_id can be null for anonymous submissions
-- (This is already nullable but let's make sure the constraint allows it)
ALTER TABLE public.address_requests 
ALTER COLUMN user_id DROP NOT NULL;