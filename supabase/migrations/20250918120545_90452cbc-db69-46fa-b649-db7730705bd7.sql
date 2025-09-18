-- Add missing INSERT policy for profiles table
-- This allows users to create their own profile record when they sign up

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (id = auth.uid());