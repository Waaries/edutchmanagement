CREATE POLICY "mail_scans_admin_all" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'mail-scans' AND public.is_admin())
  WITH CHECK (bucket_id = 'mail-scans' AND public.is_admin());

CREATE POLICY "mail_scans_owner_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'mail-scans' AND (storage.foldername(name))[1] = auth.uid()::text);