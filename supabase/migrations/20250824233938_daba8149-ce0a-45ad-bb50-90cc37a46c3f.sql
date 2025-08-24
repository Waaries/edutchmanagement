-- Create login_logs table for tracking user authentication events
CREATE TABLE public.login_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  event_type text NOT NULL, -- 'login_success', 'login_failed', 'logout', 'signup'
  ip_address inet,
  user_agent text,
  country text,
  city text,
  success boolean NOT NULL DEFAULT true,
  error_message text,
  session_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on login_logs
ALTER TABLE public.login_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all login logs
CREATE POLICY "Admins can view all login logs" 
ON public.login_logs 
FOR SELECT 
USING (is_admin());

-- Create policy for admins to insert login logs
CREATE POLICY "Admins can insert login logs" 
ON public.login_logs 
FOR INSERT 
WITH CHECK (is_admin());

-- Create indexes for better performance
CREATE INDEX idx_login_logs_user_id ON public.login_logs(user_id);
CREATE INDEX idx_login_logs_created_at ON public.login_logs(created_at DESC);
CREATE INDEX idx_login_logs_event_type ON public.login_logs(event_type);
CREATE INDEX idx_login_logs_ip_address ON public.login_logs(ip_address);

-- Create user_sessions table for active session management
CREATE TABLE public.user_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token text NOT NULL UNIQUE,
  ip_address inet,
  user_agent text,
  country text,
  city text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  last_activity timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone,
  is_active boolean NOT NULL DEFAULT true
);

-- Enable RLS on user_sessions
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all sessions
CREATE POLICY "Admins can view all sessions" 
ON public.user_sessions 
FOR ALL
USING (is_admin());

-- Create policy for users to view their own sessions
CREATE POLICY "Users can view their own sessions" 
ON public.user_sessions 
FOR SELECT
USING (auth.uid() = user_id);

-- Create indexes for user_sessions
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_is_active ON public.user_sessions(is_active);
CREATE INDEX idx_user_sessions_last_activity ON public.user_sessions(last_activity DESC);

-- Create function to log authentication events
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

-- Create function to manage user sessions
CREATE OR REPLACE FUNCTION public.manage_user_session(
  p_user_id uuid,
  p_session_token text,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_action text DEFAULT 'create' -- 'create', 'update', 'end'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create function to clean up expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.user_sessions 
  SET is_active = false 
  WHERE expires_at < now() AND is_active = true;
END;
$$;