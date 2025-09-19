-- FINAL SECURITY FIX - Complete all function search paths

-- Ensure all remaining functions have search_path set (security requirement)
CREATE OR REPLACE FUNCTION public.set_secure_contract_expiry()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Set expiration to 48 hours if not set
  IF NEW.expires_at IS NULL THEN
    NEW.expires_at = NOW() + INTERVAL '48 hours';
  END IF;
  
  -- Ensure token meets minimum requirements
  IF NEW.access_token IS NOT NULL AND length(NEW.access_token) < 32 THEN
    RAISE EXCEPTION 'Contract access token must be at least 32 characters long';
  END IF;
  
  -- Set initial security metadata
  IF NEW.metadata IS NULL THEN
    NEW.metadata = jsonb_build_object(
      'created_timestamp', NOW(),
      'security_level', 'hardened',
      'token_length', length(NEW.access_token)
    );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_secure_contract_access()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  client_ip text;
BEGIN
  -- Get client IP
  client_ip := coalesce(
    current_setting('request.headers', true)::json->>'x-real-ip',
    current_setting('request.headers', true)::json->>'x-forwarded-for',
    '127.0.0.1'
  );
  
  -- Log the access with enhanced details
  INSERT INTO public.security_audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    success,
    metadata
  ) VALUES (
    auth.uid(),
    'secure_contract_accessed',
    'filled_contracts',
    NEW.id::text,
    true,
    jsonb_build_object(
      'token_used', NEW.is_token_used,
      'ip', client_ip,
      'access_count', NEW.access_count,
      'client_email', LEFT(NEW.client_email, 3) || '***', -- Masked email
      'access_time', NOW(),
      'expires_at', NEW.expires_at
    )
  );
  
  RETURN NEW;
END;
$$;

-- Log completion of final security hardening
INSERT INTO public.security_audit_logs (
  action, resource_type, success, metadata
) VALUES (
  'final_security_hardening_completed', 'system', true,
  jsonb_build_object(
    'security_measures', ARRAY[
      'token_rate_limiting_10_per_hour',
      'token_complexity_min_32_chars',
      'automatic_48h_expiration',
      'enhanced_audit_logging',
      'suspicious_activity_detection',
      'ip_based_monitoring',
      'secure_function_search_paths',
      'constraint_based_validation'
    ],
    'completion_time', NOW(),
    'security_level', 'MAXIMUM'
  )
);