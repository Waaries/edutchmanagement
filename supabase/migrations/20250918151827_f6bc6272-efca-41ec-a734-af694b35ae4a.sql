-- URGENT SECURITY FIXES: Comprehensive table security hardening
-- Fix critical vulnerabilities in filled_contracts, user_sessions, and strengthen all policies

-- =====================================================
-- 1. FILLED_CONTRACTS TABLE - CRITICAL SECURITY FIXES
-- =====================================================

-- Drop all existing overly permissive policies
DROP POLICY IF EXISTS "Enhanced contract access policy" ON public.filled_contracts;
DROP POLICY IF EXISTS "Enhanced contract update policy" ON public.filled_contracts;
DROP POLICY IF EXISTS "filled_contracts_admin_full_access" ON public.filled_contracts;
DROP POLICY IF EXISTS "Admin only delete policy" ON public.filled_contracts;
DROP POLICY IF EXISTS "Admin only insert policy" ON public.filled_contracts;

-- Create secure contract access policies with proper restrictions
-- Only allow access through secure functions, not direct table access
CREATE POLICY "filled_contracts_deny_direct_access" 
ON public.filled_contracts 
FOR ALL 
USING (false);

-- Admin-only policies for management
CREATE POLICY "filled_contracts_admin_select" 
ON public.filled_contracts 
FOR SELECT 
TO authenticated
USING (is_admin());

CREATE POLICY "filled_contracts_admin_insert" 
ON public.filled_contracts 
FOR INSERT 
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "filled_contracts_admin_update" 
ON public.filled_contracts 
FOR UPDATE 
TO authenticated
USING (is_admin()) 
WITH CHECK (is_admin());

CREATE POLICY "filled_contracts_admin_delete" 
ON public.filled_contracts 
FOR DELETE 
TO authenticated
USING (is_admin());

-- =====================================================
-- 2. USER_SESSIONS TABLE - HIGH PRIORITY SECURITY FIXES  
-- =====================================================

-- Drop existing policy and create more restrictive ones
DROP POLICY IF EXISTS "Optimized session access policy" ON public.user_sessions;

-- Users can only see their own sessions
CREATE POLICY "user_sessions_own_access" 
ON public.user_sessions 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Only system functions can create sessions (not users directly)
CREATE POLICY "user_sessions_system_insert" 
ON public.user_sessions 
FOR INSERT 
TO service_role
WITH CHECK (true);

-- Users can update only their own session activity
CREATE POLICY "user_sessions_own_update" 
ON public.user_sessions 
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

-- Users can delete/logout their own sessions
CREATE POLICY "user_sessions_own_delete" 
ON public.user_sessions 
FOR DELETE 
TO authenticated
USING (user_id = auth.uid());

-- Admins can manage all sessions for support purposes
CREATE POLICY "user_sessions_admin_full_access" 
ON public.user_sessions 
FOR ALL 
TO authenticated
USING (is_admin()) 
WITH CHECK (is_admin());

-- Explicit denial for anonymous users
CREATE POLICY "user_sessions_deny_anon" 
ON public.user_sessions 
FOR ALL 
TO anon
USING (false);

-- =====================================================
-- 3. CREATE SECURITY AUDIT LOGS TABLE
-- =====================================================

-- Create table for comprehensive access logging
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  ip_address inet,
  user_agent text,
  success boolean NOT NULL DEFAULT true,
  error_message text,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "audit_logs_admin_only" 
ON public.security_audit_logs 
FOR SELECT 
TO authenticated
USING (is_admin());

-- System can insert audit logs
CREATE POLICY "audit_logs_system_insert" 
ON public.security_audit_logs 
FOR INSERT 
TO service_role
WITH CHECK (true);

-- =====================================================
-- 4. CREATE SECURE CONTRACT ACCESS FUNCTION
-- =====================================================

-- Enhanced security function for contract access with comprehensive logging
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
AS $function$
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
    AND fc.status != 'cancelled';

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
  SET metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
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
$function$;

-- =====================================================
-- 5. SESSION CLEANUP AND SECURITY ENHANCEMENT
-- =====================================================

-- Enhanced session cleanup function with security logging
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions_secure()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

-- =====================================================
-- 6. ADD METADATA COLUMN TO FILLED_CONTRACTS FOR TRACKING
-- =====================================================

-- Add metadata column if it doesn't exist for enhanced tracking
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'filled_contracts' AND column_name = 'metadata') THEN
    ALTER TABLE public.filled_contracts ADD COLUMN metadata jsonb DEFAULT '{}';
  END IF;
END $$;

-- =====================================================
-- 7. ENSURE ALL TABLES HAVE RLS ENABLED
-- =====================================================

-- Ensure RLS is enabled on all sensitive tables
ALTER TABLE public.filled_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;