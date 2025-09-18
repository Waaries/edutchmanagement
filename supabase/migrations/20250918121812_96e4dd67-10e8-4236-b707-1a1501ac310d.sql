-- Re-enable RLS and create working policies for anonymous users
ALTER TABLE public.address_requests ENABLE ROW LEVEL SECURITY;

-- Remove all existing policies first
DROP POLICY IF EXISTS "Public can create address requests" ON public.address_requests;
DROP POLICY IF EXISTS "Users can view own requests" ON public.address_requests;  
DROP POLICY IF EXISTS "Users can update own requests" ON public.address_requests;
DROP POLICY IF EXISTS "Users can delete own requests" ON public.address_requests;

-- 1. Allow ANONYMOUS (anon role) and AUTHENTICATED users to INSERT address requests
CREATE POLICY "Allow address request creation" 
ON public.address_requests 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- 2. Allow authenticated users to view their own requests + admins view all
CREATE POLICY "Allow viewing own requests" 
ON public.address_requests 
FOR SELECT 
TO authenticated
USING (
  is_admin() OR user_id = auth.uid()
);

-- 3. Allow authenticated users to update their own requests + admins update all  
CREATE POLICY "Allow updating own requests" 
ON public.address_requests 
FOR UPDATE 
TO authenticated
USING (
  is_admin() OR user_id = auth.uid()
)
WITH CHECK (
  is_admin() OR user_id = auth.uid()
);

-- 4. Allow authenticated users to delete their own requests + admins delete all
CREATE POLICY "Allow deleting own requests" 
ON public.address_requests 
FOR DELETE 
TO authenticated
USING (
  is_admin() OR user_id = auth.uid()
);