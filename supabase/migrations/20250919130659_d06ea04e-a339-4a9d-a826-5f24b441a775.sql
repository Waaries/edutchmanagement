-- SECURITY FIX 1: FILLED_CONTRACTS - USER_ID VALIDATION VULNERABILITY

-- Add NOT NULL constraint on user_id column
ALTER TABLE filled_contracts ALTER COLUMN user_id SET NOT NULL;

-- Drop existing policies and create new strict ones
DROP POLICY IF EXISTS "filled_contracts_owner_access" ON filled_contracts;
DROP POLICY IF EXISTS "filled_contracts_admin_full_access" ON filled_contracts;
DROP POLICY IF EXISTS "filled_contracts_deny_direct_token_access" ON filled_contracts;

-- Create strict policies
CREATE POLICY "Users can only create own contracts"
ON filled_contracts FOR INSERT
WITH CHECK (user_id = auth.uid() AND user_id IS NOT NULL);

CREATE POLICY "Users can only view own contracts"
ON filled_contracts FOR SELECT
USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Users can only update own contracts"
ON filled_contracts FOR UPDATE
USING (user_id = auth.uid() OR is_admin())
WITH CHECK (user_id = auth.uid() OR is_admin());

CREATE POLICY "Users can only delete own contracts"
ON filled_contracts FOR DELETE
USING (user_id = auth.uid() OR is_admin());

-- Auto-set user_id trigger
CREATE OR REPLACE FUNCTION set_contract_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id = auth.uid();
  END IF;
  IF NEW.user_id != auth.uid() AND NOT is_admin() THEN
    RAISE EXCEPTION 'user_id must match authenticated user';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER ensure_contract_user_id
  BEFORE INSERT ON filled_contracts
  FOR EACH ROW EXECUTE FUNCTION set_contract_user_id();

-- SECURITY FIX 2: SPAM PROTECTION - RATE LIMITING ON PUBLIC FORMS

-- Create rate limit tracking table
CREATE TABLE IF NOT EXISTS rate_limit_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  table_name text NOT NULL,
  created_at timestamp DEFAULT NOW()
);

-- Enable RLS on rate limit tracking
ALTER TABLE rate_limit_tracking ENABLE ROW LEVEL SECURITY;

-- Only admins can view rate limit data
CREATE POLICY "Admin only rate limit access"
ON rate_limit_tracking FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Create rate limit function
CREATE OR REPLACE FUNCTION check_submission_rate_limit(user_ip text, tbl_name text)
RETURNS boolean AS $$
DECLARE
  submission_count int;
BEGIN
  -- Count submissions in last hour
  SELECT COUNT(*) INTO submission_count
  FROM rate_limit_tracking
  WHERE ip_address = user_ip
    AND table_name = tbl_name
    AND created_at > NOW() - INTERVAL '1 hour';
  
  -- Block if exceeded limit
  IF submission_count >= 3 THEN
    RETURN false;
  END IF;
  
  -- Record this attempt
  INSERT INTO rate_limit_tracking (ip_address, table_name)
  VALUES (user_ip, tbl_name);
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add IP tracking columns to forms
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS ip_address text;
ALTER TABLE address_requests ADD COLUMN IF NOT EXISTS ip_address text;

-- Create rate limit enforcement trigger
CREATE OR REPLACE FUNCTION enforce_submission_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
  -- Skip rate limiting for authenticated admin users
  IF is_admin() THEN
    RETURN NEW;
  END IF;
  
  -- Check rate limit for this IP
  IF NEW.ip_address IS NOT NULL AND NOT check_submission_rate_limit(NEW.ip_address, TG_TABLE_NAME) THEN
    RAISE EXCEPTION 'Rate limit exceeded. Maximum 3 submissions per hour per IP address.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply rate limiting to contact messages
CREATE TRIGGER contact_rate_limit_trigger
  BEFORE INSERT ON contact_messages
  FOR EACH ROW EXECUTE FUNCTION enforce_submission_rate_limit();

-- Apply rate limiting to address requests
CREATE TRIGGER address_rate_limit_trigger
  BEFORE INSERT ON address_requests
  FOR EACH ROW EXECUTE FUNCTION enforce_submission_rate_limit();

-- SECURITY FIX 3: PROFILES - STRENGTHEN AUTH.UID() VALIDATION

-- Drop existing profile policies
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Create strengthened profile policies
CREATE POLICY "Authenticated users manage own profile"
ON profiles FOR ALL
USING (
  auth.role() = 'authenticated' 
  AND id = auth.uid()
  AND auth.uid() IS NOT NULL
)
WITH CHECK (
  auth.role() = 'authenticated' 
  AND id = auth.uid()
  AND auth.uid() IS NOT NULL
);

-- Add profile access logging table
CREATE TABLE IF NOT EXISTS profile_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  accessed_profile_id uuid NOT NULL,
  action text NOT NULL,
  ip_address text,
  success boolean DEFAULT true,
  created_at timestamp DEFAULT NOW()
);

-- Enable RLS on profile access log
ALTER TABLE profile_access_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view profile access logs
CREATE POLICY "Admin only profile access logs"
ON profile_access_log FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Profile access logging trigger
CREATE OR REPLACE FUNCTION log_profile_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profile_access_log (user_id, accessed_profile_id, action)
  VALUES (COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid), NEW.id, TG_OP);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profile validation trigger
CREATE OR REPLACE FUNCTION validate_profile_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Must be authenticated
  IF auth.uid() IS NULL THEN
    -- Log failed attempt
    INSERT INTO profile_access_log (user_id, accessed_profile_id, action, success)
    VALUES ('00000000-0000-0000-0000-000000000000'::uuid, NEW.id, TG_OP, false);
    RAISE EXCEPTION 'Must be authenticated to access profiles';
  END IF;
  
  -- Can only modify own profile (unless admin)
  IF NEW.id != auth.uid() AND NOT is_admin() THEN
    -- Log unauthorized attempt
    INSERT INTO profile_access_log (user_id, accessed_profile_id, action, success)
    VALUES (auth.uid(), NEW.id, TG_OP, false);
    RAISE EXCEPTION 'Can only modify own profile';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER profile_access_audit
  AFTER INSERT OR UPDATE OR DELETE ON profiles
  FOR EACH ROW EXECUTE FUNCTION log_profile_access();

CREATE TRIGGER validate_profile_modification
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION validate_profile_access();

-- Clean up old rate limit entries (keep last 7 days)
CREATE OR REPLACE FUNCTION cleanup_rate_limit_tracking()
RETURNS void AS $$
BEGIN
  DELETE FROM rate_limit_tracking 
  WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Log all security fixes applied
INSERT INTO security_audit_logs (
  action, resource_type, success, metadata
) VALUES (
  'comprehensive_security_fixes', 'database', true,
  jsonb_build_object(
    'fixes_applied', ARRAY['user_id_validation', 'rate_limiting', 'profile_security'],
    'applied_at', NOW()
  )
);