-- Fix address_requests RLS policies completely
-- Remove all existing policies first
DROP POLICY IF EXISTS "Anyone can create address requests" ON public.address_requests;
DROP POLICY IF EXISTS "Optimized delete policy" ON public.address_requests;
DROP POLICY IF EXISTS "Optimized update policy" ON public.address_requests;
DROP POLICY IF EXISTS "Users can view own requests and admins can view all" ON public.address_requests;

-- Create simple and clear policies

-- 1. Allow anyone (including anonymous users) to INSERT address requests
CREATE POLICY "Public can create address requests" 
ON public.address_requests 
FOR INSERT 
TO public
WITH CHECK (true);

-- 2. Allow users to view their own requests + admins can view all
CREATE POLICY "Users can view own requests" 
ON public.address_requests 
FOR SELECT 
TO public
USING (
  -- Admin can view all
  is_admin() 
  OR 
  -- Authenticated users can view their own requests
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
);

-- 3. Allow users to update their own requests + admins can update all
CREATE POLICY "Users can update own requests" 
ON public.address_requests 
FOR UPDATE 
TO public
USING (
  -- Admin can update all
  is_admin() 
  OR 
  -- Authenticated users can update their own requests
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
)
WITH CHECK (
  -- Admin can update all
  is_admin() 
  OR 
  -- Authenticated users can update their own requests
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
);

-- 4. Allow users to delete their own requests + admins can delete all
CREATE POLICY "Users can delete own requests" 
ON public.address_requests 
FOR DELETE 
TO public
USING (
  -- Admin can delete all
  is_admin() 
  OR 
  -- Authenticated users can delete their own requests
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
);