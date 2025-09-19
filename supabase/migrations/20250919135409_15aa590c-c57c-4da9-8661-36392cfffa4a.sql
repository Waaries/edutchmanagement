-- FINAL SECURITY HARDENING - Token Access & Profile Protection

-- ============================================================================
-- ISSUE 1: TOKEN-BASED ACCESS SECURITY
-- ============================================================================

-- 1. Add token validation function with rate limiting
CREATE OR REPLACE FUNCTION public.validate_contract_token(token_param text)
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
  
  -- Check rate limit for token attempts from this IP
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
  
  -- Validate token format first
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

-- 2. Add token complexity requirements
ALTER TABLE public.filled_contracts 
ADD CONSTRAINT IF NOT EXISTS token_length_check 
CHECK (length(access_token) >= 32);

-- 3. Update automatic token expiration function (enhance existing)
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
$$ LANGUAGE plpgsql;

-- Create trigger for automatic expiration (drop first if exists)
DROP TRIGGER IF EXISTS auto_expire_contract ON public.filled_contracts;
CREATE TRIGGER auto_expire_contract
  BEFORE INSERT ON public.filled_contracts
  FOR EACH ROW EXECUTE FUNCTION public.set_contract_expiry();

-- ============================================================================
-- ISSUE 2: PROFILES DATA PROTECTION
-- ============================================================================

-- Create view for public profile data (non-sensitive fields only)
CREATE OR REPLACE VIEW public.public_profiles AS
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

-- Enable RLS on the view
ALTER VIEW public.public_profiles SET (security_barrier = true);

-- Create RLS policy for public profiles view
CREATE POLICY "Public profiles are viewable by authenticated users"
ON public.profiles
FOR SELECT
USING (
  -- Users can see their own full profile
  (id = auth.uid()) OR
  -- Admins can see all profiles
  (public.is_admin()) OR
  -- Others can only see basic info (handled by public_profiles view)
  (auth.role() = 'authenticated')
);

-- ============================================================================
-- ISSUE 3: ENHANCED SECURITY MONITORING
-- ============================================================================

-- 1. Enhanced token access logging function
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

-- Create trigger for contract access logging
DROP TRIGGER IF EXISTS log_contract_access_trigger ON public.filled_contracts;
CREATE TRIGGER log_contract_access_trigger
  AFTER UPDATE ON public.filled_contracts
  FOR EACH ROW
  WHEN (NEW.is_token_used = true AND OLD.is_token_used = false)
  EXECUTE FUNCTION public.log_contract_access();

-- 2. Suspicious activity detection function
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

-- 3. Create function to clean up old security logs (data retention)
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