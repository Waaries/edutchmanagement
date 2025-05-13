
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
  
  -- Skip RLS completely by using a direct query without policy checks
  -- This prevents the infinite recursion
  EXECUTE 'SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = $1 AND role = ''admin''
  )' INTO is_admin_user USING _user_id;
  
  RETURN is_admin_user;
END;
$function$;
