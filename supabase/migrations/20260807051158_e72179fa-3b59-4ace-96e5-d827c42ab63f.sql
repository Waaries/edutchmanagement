DO $$
DECLARE ids uuid[];
BEGIN
  SELECT array_agg(id) INTO ids FROM auth.users WHERE email LIKE 'qa.%@example.com';
  IF ids IS NULL THEN RETURN; END IF;
  DELETE FROM public.user_roles WHERE user_id = ANY(ids);
  DELETE FROM public.profiles WHERE id = ANY(ids);
  DELETE FROM public.user_sessions WHERE user_id = ANY(ids);
  DELETE FROM public.login_logs WHERE user_id = ANY(ids) OR email LIKE 'qa.%@example.com';
  DELETE FROM public.security_audit_logs WHERE user_id = ANY(ids);
  DELETE FROM public.profile_access_log WHERE user_id = ANY(ids) OR accessed_profile_id = ANY(ids);
  DELETE FROM public.filled_contracts WHERE user_id = ANY(ids);
  DELETE FROM public.mail_items WHERE user_id = ANY(ids) OR registered_by = ANY(ids);
  DELETE FROM public.address_requests WHERE user_id = ANY(ids);
  DELETE FROM auth.identities WHERE user_id = ANY(ids);
  DELETE FROM auth.sessions WHERE user_id = ANY(ids);
  DELETE FROM auth.users WHERE id = ANY(ids);
END $$;