-- Disable RLS temporarily while we investigate
ALTER TABLE public.address_requests DISABLE ROW LEVEL SECURITY;

-- Let's test if the is_admin() function is causing issues
-- Create a simple policy that doesn't use is_admin()
CREATE POLICY "test_simple_insert" 
ON public.address_requests 
FOR INSERT 
WITH CHECK (true);

-- Re-enable RLS to test
ALTER TABLE public.address_requests ENABLE ROW LEVEL SECURITY;