-- Complete RLS reset to fix caching issues
-- Step 1: Disable RLS completely
ALTER TABLE public.address_requests DISABLE ROW LEVEL SECURITY;

-- Step 2: Remove all policies 
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

-- Step 3: Re-enable RLS
ALTER TABLE public.address_requests ENABLE ROW LEVEL SECURITY;

-- Step 4: Create the most basic policy possible
CREATE POLICY "allow_all_inserts" 
ON public.address_requests 
FOR INSERT 
WITH CHECK (true);

-- Step 5: Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';