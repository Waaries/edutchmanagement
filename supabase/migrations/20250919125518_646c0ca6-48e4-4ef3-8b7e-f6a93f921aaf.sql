-- CRITICAL SECURITY FIXES - Comprehensive Database Security Update
-- This migration fixes 4 critical security vulnerabilities

-- =====================================================
-- 1. CONTACT_MESSAGES TABLE - Fix Conflicting Policies
-- =====================================================

-- Drop all existing conflicting policies
DROP POLICY IF EXISTS "contact_messages_authenticated_insert" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages_admin_select" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages_admin_update" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages_admin_delete" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages_deny_public" ON public.contact_messages;

-- Ensure RLS is enabled
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create secure policies for contact_messages
CREATE POLICY "contact_messages_public_insert" 
ON public.contact_messages 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "contact_messages_admin_only_select" 
ON public.contact_messages 
FOR SELECT 
TO authenticated
USING (is_admin());

CREATE POLICY "contact_messages_admin_only_update" 
ON public.contact_messages 
FOR UPDATE 
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "contact_messages_admin_only_delete" 
ON public.contact_messages 
FOR DELETE 
TO authenticated
USING (is_admin());

-- =====================================================
-- 2. FILLED_CONTRACTS TABLE - Enhanced Token Security
-- =====================================================

-- Add security columns to filled_contracts
ALTER TABLE public.filled_contracts 
ADD COLUMN IF NOT EXISTS is_token_used boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS token_created_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS last_accessed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS access_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Drop existing problematic policies
DROP POLICY IF EXISTS "filled_contracts_deny_direct_access" ON public.filled_contracts;
DROP POLICY IF EXISTS "filled_contracts_admin_select" ON public.filled_contracts;
DROP POLICY IF EXISTS "filled_contracts_admin_insert" ON public.filled_contracts;
DROP POLICY IF EXISTS "filled_contracts_admin_update" ON public.filled_contracts;
DROP POLICY IF EXISTS "filled_contracts_admin_delete" ON public.filled_contracts;

-- Ensure RLS is enabled
ALTER TABLE public.filled_contracts ENABLE ROW LEVEL SECURITY;

-- Create secure policies for filled_contracts
CREATE POLICY "filled_contracts_owner_access" 
ON public.filled_contracts 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "filled_contracts_admin_full_access" 
ON public.filled_contracts 
FOR ALL 
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Deny all direct access except through security functions
CREATE POLICY "filled_contracts_deny_direct_token_access" 
ON public.filled_contracts 
FOR ALL 
TO anon
USING (false)
WITH CHECK (false);

-- =====================================================
-- 3. USER_SESSIONS TABLE - Strict Access Control
-- =====================================================

-- Add security columns to user_sessions
ALTER TABLE public.user_sessions 
ADD COLUMN IF NOT EXISTS encrypted_ip_hash text,
ADD COLUMN IF NOT EXISTS session_metadata jsonb DEFAULT '{}';

-- Drop existing policies
DROP POLICY IF EXISTS "user_sessions_own_access" ON public.user_sessions;
DROP POLICY IF EXISTS "user_sessions_system_insert" ON public.user_sessions;
DROP POLICY IF EXISTS "user_sessions_own_update" ON public.user_sessions;
DROP POLICY IF EXISTS "user_sessions_own_delete" ON public.user_sessions;
DROP POLICY IF EXISTS "user_sessions_admin_full_access" ON public.user_sessions;
DROP POLICY IF EXISTS "user_sessions_deny_anon" ON public.user_sessions;

-- Ensure RLS is enabled
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create strict policies for user_sessions
CREATE POLICY "user_sessions_own_data_only" 
ON public.user_sessions 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "user_sessions_own_update_only" 
ON public.user_sessions 
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_sessions_own_delete_only" 
ON public.user_sessions 
FOR DELETE 
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "user_sessions_system_insert_only" 
ON public.user_sessions 
FOR INSERT 
TO authenticated, service_role
WITH CHECK (user_id = auth.uid() OR auth.role() = 'service_role');

CREATE POLICY "user_sessions_admin_management" 
ON public.user_sessions 
FOR ALL 
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Deny all anonymous access
CREATE POLICY "user_sessions_deny_anonymous" 
ON public.user_sessions 
FOR ALL 
TO anon
USING (false)
WITH CHECK (false);

-- =====================================================
-- 4. ENHANCED SECURITY FUNCTIONS
-- =====================================================

-- Create enhanced contract access function with comprehensive security
CREATE OR REPLACE FUNCTION public.get_contract_by_token_secure(token_param text)
RETURNS TABLE(
  id uuid, 
  template_id uuid, 
  client_email text, 
  client_name text, 
  filled_data jsonb, 
  status text, 
  created_at timestamp with time zone, 
  updated_at timestamp with time zone, 
  completed_at timestamp with time zone,
  template_title text, 
  template_content text, 
  template_description text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  contract_record RECORD;
  client_ip inet;
  user_agent_header text;
BEGIN
  -- Enhanced validation: Check token parameter (minimum 32 characters for security)
  IF token_param IS NULL OR token_param = '' OR length(token_param) < 32 THEN
    -- Log failed attempt in new audit table
    INSERT INTO public.security_audit_logs (
      action, resource_type, resource_id, success, error_message, ip_address, metadata
    ) VALUES (
      'contract_access_attempt', 'filled_contracts', left(coalesce(token_param, 'NULL'), 10), 
      false, 'Invalid token format', client_ip, 
      jsonb_build_object('token_length', coalesce(length(token_param), 0))
    );
    
    RAISE EXCEPTION 'Invalid access token provided';
  END IF;

  -- Check if contract exists and is valid
  SELECT fc.*, ct.title as template_title, ct.content as template_content, ct.description as template_description
  INTO contract_record
  FROM public.filled_contracts fc
  JOIN public.contract_templates ct ON ct.id = fc.template_id
  WHERE fc.access_token = token_param
    AND (fc.expires_at IS NULL OR now() <= fc.expires_at)
    AND fc.status != 'cancelled'
    AND NOT fc.is_token_used;

  IF NOT FOUND THEN
    -- Log failed attempt in new audit table
    INSERT INTO public.security_audit_logs (
      action, resource_type, resource_id, success, error_message, ip_address
    ) VALUES (
      'contract_access_denied', 'filled_contracts', left(token_param, 10), 
      false, 'Contract not found or expired', client_ip
    );
    
    RAISE LOG 'Invalid or expired contract access attempt with token: %', left(token_param, 8) || '...';
    RETURN;
  END IF;

  -- Log successful access in new audit table
  INSERT INTO public.security_audit_logs (
    action, resource_type, resource_id, success, ip_address, metadata
  ) VALUES (
    'contract_accessed', 'filled_contracts', contract_record.id::text, 
    true, client_ip, jsonb_build_object('client_email', contract_record.client_email)
  );

  -- Mark token as used (one-time use security enhancement)
  UPDATE public.filled_contracts 
  SET 
    is_token_used = true,
    last_accessed_at = now(),
    access_count = access_count + 1,
    metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
      'last_accessed', now()::text,
      'access_count', COALESCE((metadata->>'access_count')::int, 0) + 1
    )
  WHERE access_token = token_param;

  -- Return the contract data
  RETURN QUERY
  SELECT 
    contract_record.id,
    contract_record.template_id,
    contract_record.client_email,
    contract_record.client_name,
    contract_record.filled_data,
    contract_record.status,
    contract_record.created_at,
    contract_record.updated_at,
    contract_record.completed_at,
    contract_record.template_title,
    contract_record.template_content,
    contract_record.template_description;
END;
$$;

-- Create enhanced session cleanup function
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions_secure()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  expired_count integer;
BEGIN
  -- Count expired sessions for logging
  SELECT count(*) INTO expired_count
  FROM public.user_sessions 
  WHERE expires_at < now() AND is_active = true;

  -- Deactivate expired sessions
  UPDATE public.user_sessions 
  SET is_active = false 
  WHERE expires_at < now() AND is_active = true;

  -- Log cleanup action
  INSERT INTO public.security_audit_logs (
    action, resource_type, success, metadata
  ) VALUES (
    'session_cleanup', 'user_sessions', true, 
    jsonb_build_object('expired_sessions_count', expired_count)
  );
END;
$$;

-- Create function to hash IP addresses for privacy
CREATE OR REPLACE FUNCTION public.hash_ip_address(ip_address inet)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Simple hash for IP privacy (in production, use more robust hashing)
  RETURN encode(sha256(ip_address::text::bytea), 'hex');
END;
$$;

-- =====================================================
-- 5. SECURITY TRIGGERS AND CONSTRAINTS
-- =====================================================

-- Create trigger to auto-expire old sessions
CREATE OR REPLACE FUNCTION public.auto_expire_sessions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Auto-expire sessions older than 30 days
  IF NEW.created_at < now() - interval '30 days' THEN
    NEW.is_active = false;
    NEW.expires_at = now();
  END IF;
  
  -- Hash IP address for privacy
  IF NEW.ip_address IS NOT NULL THEN
    NEW.encrypted_ip_hash = public.hash_ip_address(NEW.ip_address);
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER auto_expire_user_sessions
  BEFORE INSERT OR UPDATE ON public.user_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_expire_sessions();

-- Create trigger for contract token expiration
CREATE OR REPLACE FUNCTION public.validate_contract_token()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Set expiration to 48 hours if not set
  IF NEW.expires_at IS NULL THEN
    NEW.expires_at = now() + interval '48 hours';
  END IF;
  
  -- Set token creation time
  IF NEW.token_created_at IS NULL THEN
    NEW.token_created_at = now();
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_filled_contract_token
  BEFORE INSERT OR UPDATE ON public.filled_contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_contract_token();

-- =====================================================
-- 6. RATE LIMITING SETUP
-- =====================================================

-- Create rate limiting table for contact form
CREATE TABLE IF NOT EXISTS public.rate_limiting (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address inet NOT NULL,
  action_type text NOT NULL,
  attempt_count integer DEFAULT 1,
  first_attempt_at timestamp with time zone DEFAULT now(),
  last_attempt_at timestamp with time zone DEFAULT now(),
  is_blocked boolean DEFAULT false,
  blocked_until timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on rate limiting table
ALTER TABLE public.rate_limiting ENABLE ROW LEVEL SECURITY;

-- Create admin-only policy for rate limiting
CREATE POLICY "rate_limiting_admin_only" 
ON public.rate_limiting 
FOR ALL 
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Create rate limiting function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  client_ip inet, 
  action_name text, 
  max_attempts integer DEFAULT 3, 
  time_window interval DEFAULT '1 hour'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_attempts integer;
  rate_record RECORD;
BEGIN
  -- Get current rate limiting record
  SELECT * INTO rate_record
  FROM public.rate_limiting 
  WHERE ip_address = client_ip 
    AND action_type = action_name 
    AND first_attempt_at > now() - time_window;
  
  IF NOT FOUND THEN
    -- Create new rate limiting record
    INSERT INTO public.rate_limiting (ip_address, action_type, attempt_count, first_attempt_at, last_attempt_at)
    VALUES (client_ip, action_name, 1, now(), now());
    RETURN true;
  ELSE
    -- Check if blocked
    IF rate_record.is_blocked AND rate_record.blocked_until > now() THEN
      RETURN false;
    END IF;
    
    -- Update attempt count
    current_attempts = rate_record.attempt_count + 1;
    
    IF current_attempts > max_attempts THEN
      -- Block the IP
      UPDATE public.rate_limiting 
      SET 
        attempt_count = current_attempts,
        last_attempt_at = now(),
        is_blocked = true,
        blocked_until = now() + time_window
      WHERE ip_address = client_ip AND action_type = action_name;
      
      RETURN false;
    ELSE
      -- Update attempt count
      UPDATE public.rate_limiting 
      SET 
        attempt_count = current_attempts,
        last_attempt_at = now()
      WHERE ip_address = client_ip AND action_type = action_name;
      
      RETURN true;
    END IF;
  END IF;
END;
$$;

-- =====================================================
-- 7. CLEANUP AND MAINTENANCE
-- =====================================================

-- Create maintenance function to clean old records
CREATE OR REPLACE FUNCTION public.security_maintenance()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Clean old rate limiting records (older than 7 days)
  DELETE FROM public.rate_limiting 
  WHERE created_at < now() - interval '7 days';
  
  -- Clean old security audit logs (older than 90 days)
  DELETE FROM public.security_audit_logs 
  WHERE created_at < now() - interval '90 days';
  
  -- Mark expired contracts as expired
  UPDATE public.filled_contracts 
  SET status = 'expired' 
  WHERE expires_at < now() 
    AND status NOT IN ('completed', 'cancelled', 'expired');
  
  -- Log maintenance completion
  INSERT INTO public.security_audit_logs (
    action, resource_type, success, metadata
  ) VALUES (
    'security_maintenance', 'system', true, 
    jsonb_build_object('cleanup_completed_at', now())
  );
END;
$$;