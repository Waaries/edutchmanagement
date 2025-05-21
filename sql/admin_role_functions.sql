
-- Function to add admin role while bypassing RLS
CREATE OR REPLACE FUNCTION public.add_admin_role(user_id_param UUID)
RETURNS VOID AS $$
BEGIN
  -- Only allow admins to execute this function
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only administrators can add admin roles';
  END IF;
  
  -- Directly insert the admin role bypassing RLS
  INSERT INTO public.user_roles (user_id, role)
  VALUES (user_id_param, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to remove admin role while bypassing RLS
CREATE OR REPLACE FUNCTION public.remove_admin_role(user_id_param UUID)
RETURNS VOID AS $$
BEGIN
  -- Only allow admins to execute this function
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only administrators can remove admin roles';
  END IF;

  -- Directly delete the admin role bypassing RLS
  DELETE FROM public.user_roles
  WHERE user_id = user_id_param AND role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
