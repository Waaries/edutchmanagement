
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id_param UUID)
  RETURNS boolean
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $function$
DECLARE
  is_admin_user boolean;
BEGIN
  -- Direct query to check if user has admin role
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = user_id_param AND role = 'admin'
  ) INTO is_admin_user;
  
  RETURN is_admin_user;
END;
$function$;
