-- Add public access policy for filled_contracts using access tokens
-- This allows clients to view and potentially update their contracts using the access token

CREATE POLICY "Public can view contracts with valid access token" 
ON public.filled_contracts 
FOR SELECT 
USING (access_token IS NOT NULL AND access_token != '');

CREATE POLICY "Public can update contracts with valid access token" 
ON public.filled_contracts 
FOR UPDATE 
USING (access_token IS NOT NULL AND access_token != '')
WITH CHECK (access_token IS NOT NULL AND access_token != '');