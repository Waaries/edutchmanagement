CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, company_name, phone)
  VALUES (
    NEW.id,
    NULLIF(NEW.raw_user_meta_data->>'first_name', ''),
    NULLIF(NEW.raw_user_meta_data->>'last_name', ''),
    NULLIF(NEW.raw_user_meta_data->>'company_name', ''),
    NULLIF(NEW.raw_user_meta_data->>'phone', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill profiles for existing users (bypasses the validate_profile_access trigger)
ALTER TABLE public.profiles DISABLE TRIGGER validate_profile_modification;

INSERT INTO public.profiles (id, first_name, last_name, company_name, phone)
SELECT
  u.id,
  NULLIF(u.raw_user_meta_data->>'first_name', ''),
  NULLIF(u.raw_user_meta_data->>'last_name', ''),
  NULLIF(u.raw_user_meta_data->>'company_name', ''),
  NULLIF(u.raw_user_meta_data->>'phone', '')
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

ALTER TABLE public.profiles ENABLE TRIGGER validate_profile_modification;