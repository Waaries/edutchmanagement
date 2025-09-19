-- FIX SECURITY WARNINGS - SET SEARCH PATH ON FUNCTIONS

-- Fix set_contract_user_id function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix check_submission_rate_limit function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix enforce_submission_rate_limit function
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
$$ LANGUAGE plpgsql SET search_path = public;

-- Fix log_profile_access function
CREATE OR REPLACE FUNCTION log_profile_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profile_access_log (user_id, accessed_profile_id, action)
  VALUES (COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid), NEW.id, TG_OP);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix validate_profile_access function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix cleanup_rate_limit_tracking function
CREATE OR REPLACE FUNCTION cleanup_rate_limit_tracking()
RETURNS void AS $$
BEGIN
  DELETE FROM rate_limit_tracking 
  WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;