-- Completely disable RLS temporarily to test if that fixes the issue
-- This is just for testing - we'll re-enable it after
ALTER TABLE public.address_requests DISABLE ROW LEVEL SECURITY;