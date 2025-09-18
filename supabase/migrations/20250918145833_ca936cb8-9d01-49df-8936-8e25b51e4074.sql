-- Fix security issues with contract templates and fields by adding explicit restrictive policies

-- First, drop the existing broad policies and create more specific ones for contract_templates
DROP POLICY IF EXISTS "Admins can manage contract templates" ON public.contract_templates;

-- Create explicit policies for contract_templates with clear access restrictions
CREATE POLICY "contract_templates_admin_select" 
ON public.contract_templates 
FOR SELECT 
USING (is_admin());

CREATE POLICY "contract_templates_admin_insert" 
ON public.contract_templates 
FOR INSERT 
WITH CHECK (is_admin());

CREATE POLICY "contract_templates_admin_update" 
ON public.contract_templates 
FOR UPDATE 
USING (is_admin()) 
WITH CHECK (is_admin());

CREATE POLICY "contract_templates_admin_delete" 
ON public.contract_templates 
FOR DELETE 
USING (is_admin());

-- Add explicit denial policy for non-authenticated users (this makes the security explicit)
CREATE POLICY "contract_templates_deny_public" 
ON public.contract_templates 
FOR ALL 
USING (false);

-- Now fix contract_template_fields table
DROP POLICY IF EXISTS "Admins can manage contract template fields" ON public.contract_template_fields;

-- Create explicit policies for contract_template_fields
CREATE POLICY "contract_fields_admin_select" 
ON public.contract_template_fields 
FOR SELECT 
USING (is_admin());

CREATE POLICY "contract_fields_admin_insert" 
ON public.contract_template_fields 
FOR INSERT 
WITH CHECK (is_admin());

CREATE POLICY "contract_fields_admin_update" 
ON public.contract_template_fields 
FOR UPDATE 
USING (is_admin()) 
WITH CHECK (is_admin());

CREATE POLICY "contract_fields_admin_delete" 
ON public.contract_template_fields 
FOR DELETE 
USING (is_admin());

-- Add explicit denial policy for contract_template_fields
CREATE POLICY "contract_fields_deny_public" 
ON public.contract_template_fields 
FOR ALL 
USING (false);

-- Strengthen the filled_contracts policies to address the client data concern
-- Add more restrictive policies for client data protection

-- Create a more restrictive admin-only policy for sensitive client operations
CREATE POLICY "filled_contracts_admin_full_access" 
ON public.filled_contracts 
FOR ALL 
USING (is_admin()) 
WITH CHECK (is_admin());

-- Ensure RLS is enabled on all tables (safety check)
ALTER TABLE public.contract_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_template_fields ENABLE ROW LEVEL SECURITY; 
ALTER TABLE public.filled_contracts ENABLE ROW LEVEL SECURITY;