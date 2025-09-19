-- FIX: Address security linter warnings from token hardening

-- ============================================================================
-- FIX 1: Remove Security Definer property from public_profiles view
-- ============================================================================

-- Drop and recreate the view without security_barrier (which causes SECURITY DEFINER behavior)
DROP VIEW IF EXISTS public.public_profiles;

-- Create a regular view that relies on RLS policies instead of SECURITY DEFINER
CREATE VIEW public.public_profiles AS
SELECT 
  id,
  first_name,
  last_name,
  company_name,
  created_at,
  updated_at,
  avatar_url
FROM public.profiles
WHERE id IS NOT NULL;

-- Don't set security_barrier = true as it creates SECURITY DEFINER behavior
-- Instead rely on the RLS policies on the underlying profiles table

-- ============================================================================
-- FIX 2: Set search_path for all functions to prevent mutable search path
-- ============================================================================

-- Update all functions to have immutable search_path
CREATE OR REPLACE FUNCTION public.set_contract_expiry()
RETURNS TRIGGER AS $$
BEGIN
  -- Set expiration to 48 hours if not set
  IF NEW.expires_at IS NULL THEN
    NEW.expires_at = NOW() + INTERVAL '48 hours';
  END IF;
  
  -- Ensure token meets minimum requirements
  IF NEW.access_token IS NOT NULL AND length(NEW.access_token) < 32 THEN
    RAISE EXCEPTION 'Contract access token must be at least 32 characters long';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.log_contract_access()
RETURNS TRIGGER AS $$
DECLARE
  client_ip text;
BEGIN
  -- Get client IP
  client_ip := coalesce(
    current_setting('request.headers', true)::json->>'x-real-ip',
    current_setting('request.headers', true)::json->>'x-forwarded-for',
    '127.0.0.1'
  );
  
  -- Log the access
  INSERT INTO public.security_audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    success,
    metadata
  ) VALUES (
    auth.uid(),
    'contract_accessed',
    'filled_contracts',
    NEW.id::text,
    true,
    jsonb_build_object(
      'token_used', NEW.is_token_used,
      'ip', client_ip,
      'access_count', NEW.access_count,
      'client_email', NEW.client_email
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.check_suspicious_activity()
RETURNS void AS $$
DECLARE
  suspicious_ips text[];
  suspicious_count int;
BEGIN
  -- Find IPs with >5 failed token attempts in last hour
  SELECT ARRAY_AGG(DISTINCT metadata->>'ip'), COUNT(DISTINCT metadata->>'ip')
  INTO suspicious_ips, suspicious_count
  FROM public.security_audit_logs
  WHERE action = 'token_access_failed'
    AND created_at > NOW() - INTERVAL '1 hour'
    AND metadata->>'ip' IS NOT NULL
  GROUP BY metadata->>'ip'
  HAVING COUNT(*) > 5;
  
  -- Log suspicious activity if found
  IF suspicious_count > 0 THEN
    INSERT INTO public.security_audit_logs (
      action, resource_type, success, metadata
    ) VALUES (
      'suspicious_activity_detected', 'security_monitoring', true,
      jsonb_build_object(
        'detection_type', 'repeated_token_failures',
        'suspicious_ips', suspicious_ips,
        'ip_count', suspicious_count,
        'detection_time', NOW()
      )
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.cleanup_security_logs()
RETURNS void AS $$
DECLARE
  deleted_count int;
BEGIN
  -- Keep security logs for 90 days
  DELETE FROM public.security_audit_logs 
  WHERE created_at < NOW() - INTERVAL '90 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Log the cleanup
  INSERT INTO public.security_audit_logs (
    action, resource_type, success, metadata
  ) VALUES (
    'security_logs_cleanup', 'security_audit_logs', true,
    jsonb_build_object('deleted_count', deleted_count, 'retention_days', 90)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================================
-- LOG THE SECURITY FIXES
-- ============================================================================

INSERT INTO public.security_audit_logs (
  action, resource_type, success, metadata
) VALUES (
  'security_linter_fixes_applied', 'database_security', true,
  jsonb_build_object(
    'fixes_applied', ARRAY[
      'removed_security_definer_view',
      'set_immutable_search_path_all_functions'
    ],
    'timestamp', NOW()
  )
);