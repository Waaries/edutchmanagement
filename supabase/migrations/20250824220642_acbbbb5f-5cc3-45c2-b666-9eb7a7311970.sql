-- Add explicit deny policies for unauthenticated users on filled_contracts table
-- This ensures that even if other policies fail, unauthenticated users cannot access contract data

-- Drop existing policies to recreate them with better security structure
DROP POLICY IF EXISTS "Admins can view all filled contracts" ON public.filled_contracts;
DROP POLICY IF EXISTS "Admins can insert filled contracts" ON public.filled_contracts;
DROP POLICY IF EXISTS "Admins can update filled contracts" ON public.filled_contracts;
DROP POLICY IF EXISTS "Only admins can delete filled contracts" ON public.filled_contracts;

-- Create explicit deny policy for unauthenticated users (highest priority)
CREATE POLICY "Deny all access to unauthenticated users"
ON public.filled_contracts
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Create explicit deny policy for authenticated non-admin users
CREATE POLICY "Deny access to non-admin authenticated users"
ON public.filled_contracts
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Create specific admin policies (more explicit)
CREATE POLICY "Admins can view all filled contracts"
ON public.filled_contracts
FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Admins can insert filled contracts"
ON public.filled_contracts
FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Admins can update filled contracts"
ON public.filled_contracts
FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admins can delete filled contracts"
ON public.filled_contracts
FOR DELETE
TO authenticated
USING (is_admin());

-- Add additional security check to existing functions to ensure they validate properly
-- Update get_contract_by_token function with additional security measures
CREATE OR REPLACE FUNCTION public.get_contract_by_token(token_param text)
 RETURNS TABLE(id uuid, template_id uuid, client_email text, client_name text, filled_data jsonb, status text, access_token text, created_at timestamp with time zone, updated_at timestamp with time zone, completed_at timestamp with time zone, template_title text, template_content text, template_description text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Enhanced validation: Check token parameter
  IF token_param IS NULL OR token_param = '' OR length(token_param) < 10 THEN
    RAISE EXCEPTION 'Invalid access token provided';
  END IF;

  -- Return only the contract that matches the exact token and is not expired
  RETURN QUERY
  SELECT 
    fc.id,
    fc.template_id,
    fc.client_email,
    fc.client_name,
    fc.filled_data,
    fc.status,
    fc.access_token,
    fc.created_at,
    fc.updated_at,
    fc.completed_at,
    ct.title as template_title,
    ct.content as template_content,
    ct.description as template_description
  FROM public.filled_contracts fc
  JOIN public.contract_templates ct ON ct.id = fc.template_id
  WHERE fc.access_token = token_param
    AND (fc.expires_at IS NULL OR now() <= fc.expires_at);
    
  -- Log access attempt for security monitoring
  IF NOT FOUND THEN
    RAISE LOG 'Invalid or expired contract access attempt with token: %', left(token_param, 8) || '...';
  END IF;
END;
$function$;

-- Update update_contract_by_token function with additional security measures  
CREATE OR REPLACE FUNCTION public.update_contract_by_token(token_param text, filled_data_param jsonb, status_param text DEFAULT 'completed'::text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  contract_found boolean := false;
BEGIN
  -- Enhanced validation: Check token parameter
  IF token_param IS NULL OR token_param = '' OR length(token_param) < 10 THEN
    RAISE EXCEPTION 'Invalid access token provided';
  END IF;

  -- Validate status parameter
  IF status_param NOT IN ('pending', 'completed', 'cancelled') THEN
    RAISE EXCEPTION 'Invalid status parameter provided';
  END IF;

  -- Validate filled_data parameter
  IF filled_data_param IS NULL THEN
    RAISE EXCEPTION 'Contract data cannot be null';
  END IF;

  -- Check if contract exists and is valid first
  SELECT true INTO contract_found
  FROM public.filled_contracts 
  WHERE access_token = token_param
    AND (expires_at IS NULL OR now() <= expires_at)
    AND status <> 'completed';

  IF NOT contract_found THEN
    RAISE LOG 'Invalid contract update attempt with token: %', left(token_param, 8) || '...';
    RETURN false;
  END IF;

  -- Update only when link is valid (not expired) and contract not completed
  UPDATE public.filled_contracts 
  SET 
    filled_data = filled_data_param,
    status = status_param,
    completed_at = CASE WHEN status_param = 'completed' THEN now() ELSE completed_at END,
    updated_at = now()
  WHERE access_token = token_param
    AND (expires_at IS NULL OR now() <= expires_at)
    AND status <> 'completed';

  RETURN FOUND;
END;
$function$;