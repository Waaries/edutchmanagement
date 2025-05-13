
CREATE OR REPLACE FUNCTION public.is_admin()
  RETURNS boolean
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $function$
DECLARE
  _user_id uuid;
  is_admin_user boolean;
BEGIN
  -- Cache the user ID to avoid multiple calls to auth.uid()
  _user_id := auth.uid();
  
  -- Check if the current user has the admin role
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = 'admin'
  ) INTO is_admin_user;
  
  RETURN is_admin_user;
END;
$function$;
