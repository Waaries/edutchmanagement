
-- Hide admin-only / owner-only tables from anon + authenticated GraphQL/REST schemas.
-- RLS still enforces row access for legitimate paths (admin RPCs, edge functions with service_role,
-- and authenticated.SELECT remains where users need to read their own rows).

-- Fully internal / admin-only tables: revoke from both anon and authenticated.
REVOKE SELECT ON public.user_roles            FROM anon;
REVOKE SELECT ON public.login_logs            FROM anon, authenticated;
REVOKE SELECT ON public.security_audit_logs   FROM anon;
REVOKE SELECT ON public.rate_limiting         FROM anon, authenticated;
REVOKE SELECT ON public.rate_limit_tracking   FROM anon, authenticated;
REVOKE SELECT ON public.profile_access_log    FROM anon, authenticated;
REVOKE SELECT ON public.contract_access_logs  FROM anon, authenticated;

-- Admin-managed content tables (admin UI uses authenticated role + is_admin RLS).
REVOKE SELECT ON public.contract_templates        FROM anon;
REVOKE SELECT ON public.contract_template_fields  FROM anon;

-- Owner-only tables: anon never needs to read them.
REVOKE SELECT ON public.filled_contracts FROM anon;
REVOKE SELECT ON public.profiles         FROM anon;
REVOKE SELECT ON public.user_sessions    FROM anon;

-- Public submission tables: keep INSERT for anon, drop SELECT.
REVOKE SELECT ON public.contact_messages  FROM anon;
REVOKE SELECT ON public.address_requests  FROM anon;
