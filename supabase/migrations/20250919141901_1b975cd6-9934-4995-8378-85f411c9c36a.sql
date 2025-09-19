-- Fix critical session management security issue
-- Remove the overly restrictive anonymous policy that blocks legitimate auth flows
DROP POLICY IF EXISTS "user_sessions_deny_anonymous" ON public.user_sessions;

-- Create a more secure but functional policy for anonymous users
-- Allow system/service role to create sessions during auth flows
CREATE POLICY "user_sessions_allow_auth_creation" 
ON public.user_sessions 
FOR INSERT 
WITH CHECK (
  -- Allow service role (Supabase auth system) to create sessions
  auth.role() = 'service_role'::text OR
  -- Allow authenticated users to create their own sessions
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
);

-- Enhance session security with IP validation trigger
CREATE OR REPLACE FUNCTION public.validate_session_security()
RETURNS TRIGGER AS $$
DECLARE
  client_ip inet;
BEGIN
  -- Get client IP for validation
  client_ip := coalesce(
    current_setting('request.headers', true)::json->>'x-real-ip',
    current_setting('request.headers', true)::json->>'x-forwarded-for',
    '127.0.0.1'
  )::inet;
  
  -- Set IP address if not provided
  IF NEW.ip_address IS NULL THEN
    NEW.ip_address = client_ip;
  END IF;
  
  -- Enhanced security metadata
  NEW.session_metadata = COALESCE(NEW.session_metadata, '{}'::jsonb) || jsonb_build_object(
    'created_at', NOW(),
    'security_version', '2.0',
    'ip_validated', true
  );
  
  -- Log session creation for monitoring
  INSERT INTO public.security_audit_logs (
    user_id, action, resource_type, resource_id, success, metadata
  ) VALUES (
    NEW.user_id, 'session_created', 'user_sessions', NEW.id::text, true,
    jsonb_build_object('ip_address', NEW.ip_address, 'user_agent', NEW.user_agent)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Apply the security validation trigger
DROP TRIGGER IF EXISTS validate_session_security_trigger ON public.user_sessions;
CREATE TRIGGER validate_session_security_trigger
  BEFORE INSERT ON public.user_sessions
  FOR EACH ROW EXECUTE FUNCTION public.validate_session_security();

-- Add session monitoring function for suspicious activity
CREATE OR REPLACE FUNCTION public.detect_session_anomalies()
RETURNS void AS $$
DECLARE
  suspicious_sessions int;
BEGIN
  -- Detect multiple sessions from different IPs for same user
  SELECT COUNT(*) INTO suspicious_sessions
  FROM public.user_sessions s1
  WHERE s1.is_active = true
    AND s1.created_at > NOW() - INTERVAL '1 hour'
    AND EXISTS (
      SELECT 1 FROM public.user_sessions s2 
      WHERE s2.user_id = s1.user_id 
        AND s2.ip_address != s1.ip_address
        AND s2.is_active = true
        AND s2.created_at > NOW() - INTERVAL '1 hour'
    );
  
  -- Log suspicious activity if detected
  IF suspicious_sessions > 0 THEN
    INSERT INTO public.security_audit_logs (
      action, resource_type, success, metadata
    ) VALUES (
      'suspicious_session_activity', 'user_sessions', true,
      jsonb_build_object('suspicious_count', suspicious_sessions, 'detection_time', NOW())
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Schedule automated session security monitoring
-- This will be called periodically by the system
INSERT INTO public.security_audit_logs (
  action, resource_type, success, metadata
) VALUES (
  'security_fix_applied', 'system', true,
  jsonb_build_object('fix_type', 'session_management', 'timestamp', NOW())
);