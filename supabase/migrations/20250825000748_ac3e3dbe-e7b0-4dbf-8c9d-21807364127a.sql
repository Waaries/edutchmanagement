-- Verwijder overlappende RLS policies op user_sessions tabel
DROP POLICY IF EXISTS "Admins can manage sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Optimized session access policy" ON public.user_sessions;

-- Creëer één geoptimaliseerde policy voor SELECT operaties
CREATE POLICY "Unified session access policy" ON public.user_sessions
FOR SELECT
USING (is_admin() OR (user_id = auth.uid()));

-- Behoud admin policies voor andere operaties (INSERT, UPDATE, DELETE)
CREATE POLICY "Admins can manage sessions completely" ON public.user_sessions
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());