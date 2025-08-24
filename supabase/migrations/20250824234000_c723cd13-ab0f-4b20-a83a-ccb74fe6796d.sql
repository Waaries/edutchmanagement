-- Fix security warnings by setting search_path for all functions

-- Update log_auth_event function with proper search_path
CREATE OR REPLACE FUNCTION public.log_auth_event(
  p_user_id uuid,
  p_email text,
  p_event_type text,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_success boolean DEFAULT true,
  p_error_message text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.login_logs (
    user_id, 
    email, 
    event_type, 
    ip_address, 
    user_agent, 
    success, 
    error_message
  ) VALUES (
    p_user_id, 
    p_email, 
    p_event_type, 
    p_ip_address, 
    p_user_agent, 
    p_success, 
    p_error_message
  );
END;
$$;

-- Update manage_user_session function with proper search_path
CREATE OR REPLACE FUNCTION public.manage_user_session(
  p_user_id uuid,
  p_session_token text,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_action text DEFAULT 'create'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF p_action = 'create' THEN
    -- Deactivate old sessions for this user
    UPDATE public.user_sessions 
    SET is_active = false 
    WHERE user_id = p_user_id AND is_active = true;
    
    -- Create new session
    INSERT INTO public.user_sessions (
      user_id, 
      session_token, 
      ip_address, 
      user_agent, 
      expires_at
    ) VALUES (
      p_user_id, 
      p_session_token, 
      p_ip_address, 
      p_user_agent, 
      now() + interval '30 days'
    );
    
  ELSIF p_action = 'update' THEN
    -- Update last activity
    UPDATE public.user_sessions 
    SET last_activity = now() 
    WHERE session_token = p_session_token AND is_active = true;
    
  ELSIF p_action = 'end' THEN
    -- End session
    UPDATE public.user_sessions 
    SET is_active = false 
    WHERE session_token = p_session_token;
  END IF;
END;
$$;

-- Update cleanup_expired_sessions function with proper search_path
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public.user_sessions 
  SET is_active = false 
  WHERE expires_at < now() AND is_active = true;
END;
$$;