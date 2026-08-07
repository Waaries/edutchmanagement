-- Temporary QA accounts for reproducing the login redirect bug
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data, confirmation_token, recovery_token, email_change_token_new, email_change
) VALUES
('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
 'qa.user.test@example.com', crypt('TestPass123', gen_salt('bf')), now(), now(), now(),
 '{"provider":"email","providers":["email"]}', '{}', '', '', '', ''),
('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
 'qa.admin.test@example.com', crypt('TestPass123', gen_salt('bf')), now(), now(), now(),
 '{"provider":"email","providers":["email"]}', '{}', '', '', '', '');

INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
SELECT gen_random_uuid(), u.id, u.id::text,
       jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true),
       'email', now(), now(), now()
FROM auth.users u
WHERE u.email IN ('qa.user.test@example.com','qa.admin.test@example.com');

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::user_role FROM auth.users WHERE email = 'qa.admin.test@example.com'
ON CONFLICT (user_id, role) DO NOTHING;