-- CRITICAL SECURITY FIX: Complete lockdown of filled_contracts table

-- Step 1: Enable RLS (already enabled but ensuring it's set)
ALTER TABLE filled_contracts ENABLE ROW LEVEL SECURITY;

-- Step 2: Remove ALL existing policies on filled_contracts
DROP POLICY IF EXISTS "Users can only create own contracts" ON filled_contracts;
DROP POLICY IF EXISTS "Users can only view own contracts" ON filled_contracts;
DROP POLICY IF EXISTS "Users can only update own contracts" ON filled_contracts;
DROP POLICY IF EXISTS "Users can only delete own contracts" ON filled_contracts;
DROP POLICY IF EXISTS "filled_contracts_owner_access" ON filled_contracts;
DROP POLICY IF EXISTS "filled_contracts_insert_policy" ON filled_contracts;
DROP POLICY IF EXISTS "filled_contracts_public_access" ON filled_contracts;

-- Step 3: Create STRICT new policies with NO public access

-- Policy 1: Users can ONLY see their own contracts (authenticated users only)
CREATE POLICY "Users see only own contracts"
ON filled_contracts
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid()
);

-- Policy 2: Users can ONLY insert their own contracts (authenticated users only)
CREATE POLICY "Users create only own contracts"
ON filled_contracts
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid()
);

-- Policy 3: Users can ONLY update their own contracts (authenticated users only)
CREATE POLICY "Users update only own contracts"
ON filled_contracts
FOR UPDATE
USING (
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid()
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid()
);

-- Policy 4: Users can ONLY delete their own contracts (authenticated users only)
CREATE POLICY "Users delete only own contracts"
ON filled_contracts
FOR DELETE
USING (
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid()
);

-- Policy 5: Admins have full access (using the is_admin function)
CREATE POLICY "Admins have full access"
ON filled_contracts
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Step 4: Add protection trigger for extra security
CREATE OR REPLACE FUNCTION protect_contract_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required for contract access';
  END IF;
  
  -- For INSERT and UPDATE operations
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Ensure user can only access their own data unless they are admin
    IF NEW.user_id != auth.uid() AND NOT is_admin() THEN
      RAISE EXCEPTION 'Unauthorized access to contract data - user can only access own contracts';
    END IF;
    
    -- Ensure user_id is not null and matches authenticated user (unless admin)
    IF NEW.user_id IS NULL THEN
      RAISE EXCEPTION 'Contract user_id cannot be null';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS enforce_contract_security ON filled_contracts;
CREATE TRIGGER enforce_contract_security
  BEFORE INSERT OR UPDATE ON filled_contracts
  FOR EACH ROW EXECUTE FUNCTION protect_contract_access();

-- Step 5: Log this critical security update
INSERT INTO security_audit_logs (
  action, 
  resource_type, 
  success, 
  metadata
) VALUES (
  'critical_security_lockdown', 
  'filled_contracts', 
  true, 
  jsonb_build_object(
    'description', 'Complete RLS lockdown implemented for filled_contracts table',
    'policies_removed', 'all existing policies',
    'policies_created', 'strict user-only + admin policies',
    'trigger_added', 'protect_contract_access'
  )
);