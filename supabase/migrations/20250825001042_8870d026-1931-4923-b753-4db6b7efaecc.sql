-- Voeg expliciete policy toe om anonieme toegang tot contract templates te blokkeren
CREATE POLICY "Deny anonymous access to contract templates" ON public.contract_templates
FOR ALL 
TO anon
USING (false)
WITH CHECK (false);

-- Voeg policy toe om alleen geauthenticeerde admins toegang te geven
CREATE POLICY "Only admins can access contract templates" ON public.contract_templates
FOR ALL
TO authenticated  
USING (is_admin())
WITH CHECK (is_admin());