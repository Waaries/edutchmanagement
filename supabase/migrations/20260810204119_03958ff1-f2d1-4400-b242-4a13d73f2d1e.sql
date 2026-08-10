-- 1. Make owner columns nullable
ALTER TABLE public.contract_templates ALTER COLUMN created_by DROP NOT NULL;
ALTER TABLE public.filled_contracts ALTER COLUMN user_id DROP NOT NULL;

-- 2. Recreate FKs with ON DELETE SET NULL
ALTER TABLE public.address_requests DROP CONSTRAINT IF EXISTS address_requests_user_id_fkey;
ALTER TABLE public.address_requests
  ADD CONSTRAINT address_requests_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.contract_templates DROP CONSTRAINT IF EXISTS contract_templates_created_by_fkey;
ALTER TABLE public.contract_templates
  ADD CONSTRAINT contract_templates_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.filled_contracts DROP CONSTRAINT IF EXISTS filled_contracts_user_id_fkey;
ALTER TABLE public.filled_contracts
  ADD CONSTRAINT filled_contracts_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- 3. Allow the detach-update triggered by ON DELETE SET NULL
CREATE OR REPLACE FUNCTION public.protect_contract_access()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Allow the ON DELETE SET NULL detach performed when a user account is removed
  IF TG_OP = 'UPDATE' AND NEW.user_id IS NULL AND OLD.user_id IS NOT NULL THEN
    RETURN NEW;
  END IF;

  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required for contract access';
  END IF;

  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF NEW.user_id IS NULL THEN
      RAISE EXCEPTION 'Contract user_id cannot be null';
    END IF;

    IF NEW.user_id != auth.uid() AND NOT is_admin() THEN
      RAISE EXCEPTION 'Unauthorized access to contract data - user can only access own contracts';
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_filled_contracts_expiration()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Allow detaching an orphaned contract even if it already expired
  IF TG_OP = 'UPDATE' AND NEW.user_id IS NULL AND OLD.user_id IS NOT NULL THEN
    RETURN NEW;
  END IF;

  IF NEW.expires_at IS NOT NULL AND NEW.expires_at <= now() THEN
    RAISE EXCEPTION 'Contract link has already expired';
  END IF;
  RETURN NEW;
END;
$function$;

-- 4. Ensure admins keep seeing detached rows (existing admin policies use is_admin()).
DROP POLICY IF EXISTS "Users see only own contracts" ON public.filled_contracts;
CREATE POLICY "Users see only own contracts" ON public.filled_contracts
  FOR SELECT USING ((auth.uid() IS NOT NULL AND user_id = auth.uid()) OR is_admin());