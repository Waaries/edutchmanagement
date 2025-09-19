-- FIX SECURITY LINTER WARNINGS - Complete Hardening

-- Fix search_path issues in functions (security requirement)
CREATE OR REPLACE FUNCTION public.detect_suspicious_activity()
RETURNS TABLE(threat_level text, description text, ip_addresses text[], detection_time timestamptz) 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
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
$$;

-- Fix search_path for security maintenance function
CREATE OR REPLACE FUNCTION public.security_maintenance_hardened()
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
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
$$;

-- Ensure public_profiles view is secure (drop if it exists)
DROP VIEW IF EXISTS public.public_profiles;

-- Log security fixes completion
INSERT INTO public.security_audit_logs (
  action, resource_type, success, metadata
) VALUES (
  'security_linter_fixes_applied', 'system', true,
  jsonb_build_object(
    'fixes_applied', ARRAY[
      'removed_security_definer_view',
      'fixed_function_search_paths',
      'enhanced_function_security'
    ],
    'completion_time', NOW()
  )
);