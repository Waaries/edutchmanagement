-- 1) Add expiration and uniqueness for access tokens
ALTER TABLE public.filled_contracts
  ADD COLUMN IF NOT EXISTS expires_at timestamptz DEFAULT (now() + interval '30 days');

-- Ensure tokens are unique to prevent enumeration collisions
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public' AND indexname = 'idx_filled_contracts_access_token_unique'
  ) THEN
    CREATE UNIQUE INDEX idx_filled_contracts_access_token_unique
      ON public.filled_contracts(access_token);
  END IF;
END $$;

-- 2) Validation trigger instead of CHECK constraint (time-based)
CREATE OR REPLACE FUNCTION public.validate_filled_contracts_expiration()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.expires_at IS NOT NULL AND NEW.expires_at <= now() THEN
    RAISE EXCEPTION 'Contract link has already expired';
  END IF;
  RETURN NEW;
END;
$$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_validate_filled_contracts_expiration'
  ) THEN
    CREATE TRIGGER trg_validate_filled_contracts_expiration
    BEFORE INSERT OR UPDATE ON public.filled_contracts
    FOR EACH ROW EXECUTE FUNCTION public.validate_filled_contracts_expiration();
  END IF;
END $$;

-- 3) Harden secure RPC: enforce non-expired tokens
CREATE OR REPLACE FUNCTION public.get_contract_by_token(token_param text)
RETURNS TABLE(
  id uuid,
  template_id uuid,
  client_email text,
  client_name text,
  filled_data jsonb,
  status text,
  access_token text,
  created_at timestamptz,
  updated_at timestamptz,
  completed_at timestamptz,
  template_title text,
  template_content text,
  template_description text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate token parameter
  IF token_param IS NULL OR token_param = '' THEN
    RETURN;
  END IF;

  -- Return only the contract that matches the exact token and is not expired
  RETURN QUERY
  SELECT 
    fc.id,
    fc.template_id,
    fc.client_email,
    fc.client_name,
    fc.filled_data,
    fc.status,
    fc.access_token,
    fc.created_at,
    fc.updated_at,
    fc.completed_at,
    ct.title as template_title,
    ct.content as template_content,
    ct.description as template_description
  FROM public.filled_contracts fc
  JOIN public.contract_templates ct ON ct.id = fc.template_id
  WHERE fc.access_token = token_param
    AND (fc.expires_at IS NULL OR now() <= fc.expires_at);
END;
$$;

-- 4) Harden updates: only allow if not expired and not already completed
CREATE OR REPLACE FUNCTION public.update_contract_by_token(
  token_param text,
  filled_data_param jsonb,
  status_param text DEFAULT 'completed'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER  
SET search_path = public
AS $$
BEGIN
  -- Validate token parameter
  IF token_param IS NULL OR token_param = '' THEN
    RETURN false;
  END IF;

  -- Update only when link is valid (not expired) and contract not completed
  UPDATE public.filled_contracts 
  SET 
    filled_data = filled_data_param,
    status = status_param,
    completed_at = CASE WHEN status_param = 'completed' THEN now() ELSE completed_at END,
    updated_at = now()
  WHERE access_token = token_param
    AND (expires_at IS NULL OR now() <= expires_at)
    AND status <> 'completed';

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  RETURN true;
END;
$$;