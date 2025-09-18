-- Fix critical security issues with contact_messages table
-- Current policy allows anyone to insert, need to restrict to authenticated users only

-- First, drop the existing overly permissive policy
DROP POLICY IF EXISTS "Anyone can create contact messages" ON public.contact_messages;

-- Create restrictive policies for contact_messages table

-- Only authenticated users can submit contact messages
CREATE POLICY "contact_messages_authenticated_insert" 
ON public.contact_messages 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Only admins can view contact messages
CREATE POLICY "contact_messages_admin_select" 
ON public.contact_messages 
FOR SELECT 
TO authenticated 
USING (is_admin());

-- Only admins can update contact messages  
CREATE POLICY "contact_messages_admin_update" 
ON public.contact_messages 
FOR UPDATE 
TO authenticated 
USING (is_admin()) 
WITH CHECK (is_admin());

-- Only admins can delete contact messages
CREATE POLICY "contact_messages_admin_delete" 
ON public.contact_messages 
FOR DELETE 
TO authenticated 
USING (is_admin());

-- Add explicit denial policy for public access (security hardening)
CREATE POLICY "contact_messages_deny_public" 
ON public.contact_messages 
FOR ALL 
TO anon 
USING (false);

-- Drop the existing policies to avoid conflicts
DROP POLICY IF EXISTS "Only admins can view contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Only admins can update contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Only admins can delete contact messages" ON public.contact_messages;

-- Ensure RLS is enabled (safety check)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Fix similar issue with address_requests table that's causing RLS violations
-- Check current policies on address_requests
-- The policy "Anyone can submit address requests" might be too permissive

-- Create a more secure policy that allows both authenticated and anonymous users 
-- to submit address requests (business requirement) but is more explicit
DROP POLICY IF EXISTS "Anyone can submit address requests" ON public.address_requests;

-- Allow both authenticated and anonymous users to submit address requests
-- This is needed for the business use case where people can request addresses without accounts
CREATE POLICY "address_requests_public_insert" 
ON public.address_requests 
FOR INSERT 
WITH CHECK (true);

-- But add explicit restrictions for other operations
CREATE POLICY "address_requests_deny_public_read" 
ON public.address_requests 
FOR SELECT 
TO anon 
USING (false);