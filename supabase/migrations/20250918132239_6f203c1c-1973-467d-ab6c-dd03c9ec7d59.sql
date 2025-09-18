-- Enhanced security measures for contract access and data protection

-- 1. Add failed access attempt logging table for security monitoring
CREATE TABLE IF NOT EXISTS public.contract_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  access_token TEXT,
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  attempted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  error_reason TEXT
);

-- Enable RLS on access logs (admin only access)
ALTER TABLE public.contract_access_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin only access to contract logs" 
ON public.contract_access_logs 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- 2. Enhance contract access validation with stronger security
-- Update the get_contract_by_token function with enhanced security
CREATE OR REPLACE FUNCTION public.get_contract_by_token(token_param text)
RETURNS TABLE(
  id uuid, template_id uuid, client_email text, client_name text, 
  filled_data jsonb, status text, access_token text, 
  created_at timestamp with time zone, updated_at timestamp with time zone, 
  completed_at timestamp with time zone, template_title text, 
  template_content text, template_description text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  contract_record RECORD;
BEGIN
  -- Enhanced validation: Check token parameter (minimum 32 characters for security)
  IF token_param IS NULL OR token_param = '' OR length(token_param) < 32 THEN
    -- Log failed attempt
    INSERT INTO public.contract_access_logs (access_token, success, error_reason)
    VALUES (left(coalesce(token_param, 'NULL'), 10), false, 'Invalid token format');
    
    RAISE EXCEPTION 'Invalid access token provided';
  END IF;

  -- Check if contract exists and is valid
  SELECT fc.*, ct.title as template_title, ct.content as template_content, ct.description as template_description
  INTO contract_record
  FROM public.filled_contracts fc
  JOIN public.contract_templates ct ON ct.id = fc.template_id
  WHERE fc.access_token = token_param
    AND (fc.expires_at IS NULL OR now() <= fc.expires_at)
    AND fc.status != 'cancelled';

  IF NOT FOUND THEN
    -- Log failed attempt
    INSERT INTO public.contract_access_logs (access_token, success, error_reason)
    VALUES (left(token_param, 10), false, 'Contract not found or expired');
    
    RAISE LOG 'Invalid or expired contract access attempt with token: %', left(token_param, 8) || '...';
    RETURN;
  END IF;

  -- Log successful access
  INSERT INTO public.contract_access_logs (access_token, success, error_reason)
  VALUES (left(token_param, 10), true, NULL);

  -- Return the contract data
  RETURN QUERY
  SELECT 
    contract_record.id,
    contract_record.template_id,
    contract_record.client_email,
    contract_record.client_name,
    contract_record.filled_data,
    contract_record.status,
    contract_record.access_token,
    contract_record.created_at,
    contract_record.updated_at,
    contract_record.completed_at,
    contract_record.template_title,
    contract_record.template_content,
    contract_record.template_description;
END;
$$;

-- 3. Update contract update function with enhanced security
CREATE OR REPLACE FUNCTION public.update_contract_by_token(
  token_param text, 
  filled_data_param jsonb, 
  status_param text DEFAULT 'completed'::text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  contract_found boolean := false;
BEGIN
  -- Enhanced validation: Check token parameter (minimum 32 characters)
  IF token_param IS NULL OR token_param = '' OR length(token_param) < 32 THEN
    INSERT INTO public.contract_access_logs (access_token, success, error_reason)
    VALUES (left(coalesce(token_param, 'NULL'), 10), false, 'Invalid token format for update');
    
    RAISE EXCEPTION 'Invalid access token provided';
  END IF;

  -- Validate status parameter
  IF status_param NOT IN ('pending', 'completed', 'cancelled') THEN
    INSERT INTO public.contract_access_logs (access_token, success, error_reason)
    VALUES (left(token_param, 10), false, 'Invalid status parameter');
    
    RAISE EXCEPTION 'Invalid status parameter provided';
  END IF;

  -- Validate filled_data parameter
  IF filled_data_param IS NULL THEN
    INSERT INTO public.contract_access_logs (access_token, success, error_reason)
    VALUES (left(token_param, 10), false, 'Null contract data');
    
    RAISE EXCEPTION 'Contract data cannot be null';
  END IF;

  -- Check if contract exists and is valid first
  SELECT true INTO contract_found
  FROM public.filled_contracts 
  WHERE access_token = token_param
    AND (expires_at IS NULL OR now() <= expires_at)
    AND status NOT IN ('completed', 'cancelled');

  IF NOT contract_found THEN
    INSERT INTO public.contract_access_logs (access_token, success, error_reason)
    VALUES (left(token_param, 10), false, 'Update attempt on invalid/expired contract');
    
    RAISE LOG 'Invalid contract update attempt with token: %', left(token_param, 8) || '...';
    RETURN false;
  END IF;

  -- Update the contract
  UPDATE public.filled_contracts 
  SET 
    filled_data = filled_data_param,
    status = status_param,
    completed_at = CASE WHEN status_param = 'completed' THEN now() ELSE completed_at END,
    updated_at = now()
  WHERE access_token = token_param
    AND (expires_at IS NULL OR now() <= expires_at)
    AND status NOT IN ('completed', 'cancelled');

  IF FOUND THEN
    -- Log successful update
    INSERT INTO public.contract_access_logs (access_token, success, error_reason)
    VALUES (left(token_param, 10), true, 'Contract updated successfully');
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$;

-- 4. Add data retention policy for access logs (optional - keeps last 90 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_access_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM public.contract_access_logs 
  WHERE attempted_at < now() - interval '90 days';
END;
$$;

-- 5. Enhanced RLS policies with additional security measures
-- Update filled_contracts policies to be more restrictive
DROP POLICY IF EXISTS "Consolidated contract access policy" ON public.filled_contracts;
DROP POLICY IF EXISTS "Consolidated contract update policy" ON public.filled_contracts;

-- More restrictive contract access policy
CREATE POLICY "Enhanced contract access policy" 
ON public.filled_contracts 
FOR SELECT 
USING (
  is_admin() OR 
  (
    access_token IS NOT NULL 
    AND length(access_token) >= 32  -- Require longer tokens
    AND (expires_at IS NULL OR now() <= expires_at)
    AND status != 'cancelled'  -- Don't allow access to cancelled contracts
  )
);

-- More restrictive contract update policy  
CREATE POLICY "Enhanced contract update policy" 
ON public.filled_contracts 
FOR UPDATE 
USING (
  is_admin() OR 
  (
    access_token IS NOT NULL 
    AND length(access_token) >= 32
    AND (expires_at IS NULL OR now() <= expires_at)
    AND status NOT IN ('completed', 'cancelled')  -- Prevent updates to finalized contracts
  )
)
WITH CHECK (
  is_admin() OR 
  (
    access_token IS NOT NULL 
    AND length(access_token) >= 32
    AND (expires_at IS NULL OR now() <= expires_at)
    AND status NOT IN ('completed', 'cancelled')
  )
);

-- 6. Add index for performance on the new access logs table
CREATE INDEX IF NOT EXISTS idx_contract_access_logs_attempted_at 
ON public.contract_access_logs(attempted_at);

CREATE INDEX IF NOT EXISTS idx_contract_access_logs_access_token 
ON public.contract_access_logs(access_token);

-- Note: Applications should now generate access tokens with minimum 32 characters
-- using cryptographically secure random generators (e.g., crypto.randomBytes(32).toString('hex'))