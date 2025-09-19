-- FINAL SECURITY HARDENING - Token Access & Monitoring (Simplified)

-- ============================================================================
-- ISSUE 1: TOKEN-BASED ACCESS SECURITY
-- ============================================================================

-- 1. Add secure token validation function with rate limiting
CREATE OR REPLACE FUNCTION public.validate_contract_token_secure(token_param text)
RETURNS uuid AS $$
DECLARE
  contract_id uuid;
  attempt_count int;
  client_ip text;
BEGIN
  -- Get client IP (with fallback for testing)
  client_ip := coalesce(
    current_setting('request.headers', true)::json->>'x-real-ip',
    current_setting('request.headers', true)::json->>'x-forwarded-for',
    '127.0.0.1'
  );
  
  -- Check rate limit for token attempts from this IP (max 10 per hour)
  SELECT COUNT(*) INTO attempt_count
  FROM public.security_audit_logs
  WHERE action = 'token_access_attempt'
    AND metadata->>'ip' = client_ip
    AND created_at > NOW() - INTERVAL '1 hour';
  
  IF attempt_count > 10 THEN
    -- Log rate limit violation
    INSERT INTO public.security_audit_logs (
      action, resource_type, success, error_message, metadata
    ) VALUES (
      'token_rate_limit_exceeded', 'filled_contracts', false, 
      'Too many token access attempts', 
      jsonb_build_object('ip', client_ip, 'attempts', attempt_count)
    );
    
    RAISE EXCEPTION 'Too many token access attempts from this IP address';
  END IF;
  
  -- Log this attempt
  INSERT INTO public.security_audit_logs (
    action, resource_type, metadata
  ) VALUES (
    'token_access_attempt', 'filled_contracts',
    jsonb_build_object('ip', client_ip, 'token_prefix', LEFT(token_param, 4))
  );
  
  -- Validate token format first (minimum 32 characters)
  IF token_param IS NULL OR length(token_param) < 32 THEN
    INSERT INTO public.security_audit_logs (
      action, resource_type, success, error_message, metadata
    ) VALUES (
      'token_access_failed', 'filled_contracts', false, 
      'Invalid token format',
      jsonb_build_object('ip', client_ip, 'token_length', coalesce(length(token_param), 0))
    );
    RETURN NULL;
  END IF;
  
  -- Validate token and get contract ID
  SELECT id INTO contract_id
  FROM public.filled_contracts
  WHERE access_token = token_param
    AND is_token_used = false
    AND (expires_at IS NULL OR expires_at > NOW())
    AND status NOT IN ('cancelled', 'expired');
  
  IF contract_id IS NULL THEN
    -- Log failed attempt
    INSERT INTO public.security_audit_logs (
      action, resource_type, success, error_message, metadata
    ) VALUES (
      'token_access_failed', 'filled_contracts', false,
      'Token not found or expired',
      jsonb_build_object('ip', client_ip, 'token_prefix', LEFT(token_param, 4))
    );
    RETURN NULL;
  END IF;
  
  -- Log successful validation
  INSERT INTO public.security_audit_logs (
    action, resource_type, resource_id, success, metadata
  ) VALUES (
    'token_access_validated', 'filled_contracts', contract_id::text, true,
    jsonb_build_object('ip', client_ip)
  );
  
  RETURN contract_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Add token complexity constraint (safely)
DO $$ 
BEGIN
  -- Drop existing constraint if it exists
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
             WHERE constraint_name = 'token_length_check' 
             AND table_name = 'filled_contracts') THEN
    ALTER TABLE public.filled_contracts DROP CONSTRAINT token_length_check;
  END IF;
  
  -- Add the constraint
  ALTER TABLE public.filled_contracts 
  ADD CONSTRAINT token_length_check CHECK (length(access_token) >= 32);
EXCEPTION
  WHEN OTHERS THEN
    -- Log any errors
    INSERT INTO public.security_audit_logs (
      action, resource_type, success, error_message
    ) VALUES (
      'constraint_creation_failed', 'filled_contracts', false, SQLERRM
    );
END $$;

-- 3. Enhanced automatic token expiration
CREATE OR REPLACE FUNCTION public.set_secure_contract_expiry()
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
$$ LANGUAGE plpgsql;

-- Replace the trigger for secure expiration
DROP TRIGGER IF EXISTS auto_expire_contract ON public.filled_contracts;
DROP TRIGGER IF EXISTS secure_contract_expiry ON public.filled_contracts;
CREATE TRIGGER secure_contract_expiry
  BEFORE INSERT ON public.filled_contracts
  FOR EACH ROW EXECUTE FUNCTION public.set_secure_contract_expiry();

-- ============================================================================
-- ISSUE 2: ENHANCED SECURITY MONITORING
-- ============================================================================

-- 1. Enhanced contract access logging
CREATE OR REPLACE FUNCTION public.log_secure_contract_access()
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for secure access logging
DROP TRIGGER IF EXISTS log_contract_access_trigger ON public.filled_contracts;
DROP TRIGGER IF EXISTS log_secure_contract_access_trigger ON public.filled_contracts;
CREATE TRIGGER log_secure_contract_access_trigger
  AFTER UPDATE ON public.filled_contracts
  FOR EACH ROW
  WHEN (NEW.is_token_used = true AND OLD.is_token_used = false)
  EXECUTE FUNCTION public.log_secure_contract_access();

-- 2. Suspicious activity detection with enhanced monitoring
CREATE OR REPLACE FUNCTION public.detect_suspicious_activity()
RETURNS TABLE(threat_level text, description text, ip_addresses text[], detection_time timestamptz) AS $$
DECLARE
  suspicious_ips text[];
  failed_attempts_count int;
  rate_limit_violations int;
BEGIN
  -- Detect repeated failed token attempts
  SELECT ARRAY_AGG(DISTINCT metadata->>'ip'), COUNT(*)
  INTO suspicious_ips, failed_attempts_count
  FROM public.security_audit_logs
  WHERE action = 'token_access_failed'
    AND created_at > NOW() - INTERVAL '1 hour'
    AND metadata->>'ip' IS NOT NULL;
  
  -- Detect rate limit violations
  SELECT COUNT(*) INTO rate_limit_violations
  FROM public.security_audit_logs
  WHERE action = 'token_rate_limit_exceeded'
    AND created_at > NOW() - INTERVAL '1 hour';
  
  -- Return threat analysis
  IF failed_attempts_count > 10 THEN
    INSERT INTO public.security_audit_logs (
      action, resource_type, success, metadata
    ) VALUES (
      'high_threat_detected', 'security_monitoring', true,
      jsonb_build_object(
        'threat_level', 'HIGH',
        'failed_attempts', failed_attempts_count,
        'rate_violations', rate_limit_violations,
        'suspicious_ips', suspicious_ips,
        'detection_time', NOW()
      )
    );
    
    RETURN QUERY SELECT 
      'HIGH'::text, 
      'Multiple failed token access attempts detected'::text,
      suspicious_ips,
      NOW();
  ELSIF rate_limit_violations > 3 THEN
    RETURN QUERY SELECT 
      'MEDIUM'::text,
      'Rate limit violations detected'::text,
      suspicious_ips,
      NOW();
  ELSE
    RETURN QUERY SELECT 
      'LOW'::text,
      'Normal activity levels'::text,
      ARRAY[]::text[],
      NOW();
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Automated security cleanup and maintenance
CREATE OR REPLACE FUNCTION public.security_maintenance_hardened()
RETURNS void AS $$
DECLARE
  deleted_logs int;
  expired_contracts int;
  cleanup_summary jsonb;
BEGIN
  -- Clean old security logs (keep 90 days)
  DELETE FROM public.security_audit_logs 
  WHERE created_at < NOW() - INTERVAL '90 days';
  GET DIAGNOSTICS deleted_logs = ROW_COUNT;
  
  -- Mark expired contracts
  UPDATE public.filled_contracts 
  SET status = 'expired' 
  WHERE expires_at < NOW() 
    AND status NOT IN ('completed', 'cancelled', 'expired');
  GET DIAGNOSTICS expired_contracts = ROW_COUNT;
  
  -- Create cleanup summary
  cleanup_summary := jsonb_build_object(
    'deleted_logs', deleted_logs,
    'expired_contracts', expired_contracts,
    'cleanup_time', NOW(),
    'retention_policy', '90 days'
  );
  
  -- Log maintenance completion
  INSERT INTO public.security_audit_logs (
    action, resource_type, success, metadata
  ) VALUES (
    'security_maintenance_completed', 'system', true, cleanup_summary
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Log successful hardening deployment
INSERT INTO public.security_audit_logs (
  action, resource_type, success, metadata
) VALUES (
  'security_hardening_deployed', 'system', true,
  jsonb_build_object(
    'features', ARRAY[
      'token_rate_limiting',
      'enhanced_logging',
      'suspicious_activity_detection',
      'automated_maintenance',
      'token_complexity_validation'
    ],
    'deployment_time', NOW(),
    'version', 'final_hardening_v1'
  )
);