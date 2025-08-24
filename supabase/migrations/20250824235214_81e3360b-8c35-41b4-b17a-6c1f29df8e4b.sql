-- Optimaliseer RLS policies voor user_sessions tabel
-- Verwijder bestaande policies
DROP POLICY IF EXISTS "Admins can view all sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.user_sessions;

-- Creëer geoptimaliseerde policy die beide use cases combineert
-- Gebruik (select auth.uid()) voor betere performance
CREATE POLICY "Optimized session access policy" 
ON public.user_sessions 
FOR SELECT 
USING (
  is_admin() OR (user_id = (SELECT auth.uid()))
);

-- Behoud admin-only policies voor andere operaties
CREATE POLICY "Admins can manage sessions" 
ON public.user_sessions 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());