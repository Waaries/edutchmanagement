-- Remove ALL policies and create one very simple policy that should work
DO $$
DECLARE
    pol RECORD;
BEGIN
    -- Drop all existing policies
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'address_requests'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.address_requests', pol.policyname);
    END LOOP;
END $$;

-- Create ONE simple policy that allows all INSERT operations
CREATE POLICY "simple_insert_policy" 
ON public.address_requests 
FOR INSERT 
WITH CHECK (true);

-- Create admin-only policies for SELECT, UPDATE, DELETE
CREATE POLICY "admin_only_select" 
ON public.address_requests 
FOR SELECT 
TO authenticated
USING (is_admin());

CREATE POLICY "admin_only_update" 
ON public.address_requests 
FOR UPDATE 
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "admin_only_delete" 
ON public.address_requests 
FOR DELETE 
TO authenticated
USING (is_admin());