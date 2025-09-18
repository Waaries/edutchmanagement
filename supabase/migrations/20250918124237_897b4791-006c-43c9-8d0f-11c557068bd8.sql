-- Re-enable RLS and create working policies step by step
ALTER TABLE public.address_requests ENABLE ROW LEVEL SECURITY;

-- Remove any existing policies first
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'address_requests'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.address_requests', pol.policyname);
    END LOOP;
END $$;

-- Create a very simple INSERT policy that allows everyone to create requests
-- Using the most basic syntax possible
CREATE POLICY "allow_insert_for_all" 
ON public.address_requests 
FOR INSERT 
WITH CHECK (true);

-- Create SELECT policy only for admins (since regular users shouldn't view requests anyway)
CREATE POLICY "admin_can_select_all" 
ON public.address_requests 
FOR SELECT 
USING (is_admin());

-- Create UPDATE/DELETE policies only for admins
CREATE POLICY "admin_can_update_all" 
ON public.address_requests 
FOR UPDATE 
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "admin_can_delete_all" 
ON public.address_requests 
FOR DELETE 
USING (is_admin());