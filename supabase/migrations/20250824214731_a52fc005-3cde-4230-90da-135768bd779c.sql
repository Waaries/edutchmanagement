-- Fix remaining function search_path warnings by updating ALL functions with proper search paths
CREATE OR REPLACE FUNCTION public.validate_filled_contracts_expiration()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF NEW.expires_at IS NOT NULL AND NEW.expires_at <= now() THEN
    RAISE EXCEPTION 'Contract link has already expired';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  _user_id uuid;
  is_admin_user boolean;
BEGIN
  -- Cache the user ID to avoid multiple calls to auth.uid()
  _user_id := (SELECT auth.uid());
  
  -- Use a SELECT statement to bypass RLS and prevent infinite recursion
  -- This follows the recommended pattern for improved performance
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = 'admin'
  ) INTO is_admin_user;
  
  RETURN is_admin_user;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;