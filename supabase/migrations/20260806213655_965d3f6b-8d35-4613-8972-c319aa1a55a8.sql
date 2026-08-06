CREATE TYPE public.mail_type AS ENUM ('letter','parcel','registered','other');

CREATE TABLE public.mail_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  sender text,
  mail_type public.mail_type NOT NULL DEFAULT 'letter',
  priority text NOT NULL DEFAULT 'normal',
  status text NOT NULL DEFAULT 'received',
  received_at timestamptz NOT NULL DEFAULT now(),
  is_read boolean NOT NULL DEFAULT false,
  scan_url text,
  notes text,
  registered_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT mail_items_priority_check CHECK (priority IN ('low','normal','high')),
  CONSTRAINT mail_items_status_check CHECK (status IN ('received','notified','scanned','forwarded','collected','destroyed'))
);

GRANT SELECT, UPDATE ON public.mail_items TO authenticated;
GRANT INSERT, DELETE ON public.mail_items TO authenticated;
GRANT ALL ON public.mail_items TO service_role;

ALTER TABLE public.mail_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mail_items_owner_select" ON public.mail_items
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "mail_items_owner_update_read" ON public.mail_items
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND NOT public.is_admin())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "mail_items_admin_insert" ON public.mail_items
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "mail_items_admin_update" ON public.mail_items
  FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "mail_items_admin_delete" ON public.mail_items
  FOR DELETE TO authenticated
  USING (public.is_admin());

CREATE INDEX mail_items_user_received_idx ON public.mail_items (user_id, received_at DESC);

CREATE TRIGGER update_mail_items_updated_at
  BEFORE UPDATE ON public.mail_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Restrict non-admin customers to only changing is_read on their own rows
CREATE OR REPLACE FUNCTION public.enforce_mail_item_customer_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;

  IF NEW.user_id IS DISTINCT FROM OLD.user_id
     OR NEW.subject IS DISTINCT FROM OLD.subject
     OR NEW.sender IS DISTINCT FROM OLD.sender
     OR NEW.mail_type IS DISTINCT FROM OLD.mail_type
     OR NEW.priority IS DISTINCT FROM OLD.priority
     OR NEW.status IS DISTINCT FROM OLD.status
     OR NEW.received_at IS DISTINCT FROM OLD.received_at
     OR NEW.scan_url IS DISTINCT FROM OLD.scan_url
     OR NEW.notes IS DISTINCT FROM OLD.notes
     OR NEW.registered_by IS DISTINCT FROM OLD.registered_by
     OR NEW.id IS DISTINCT FROM OLD.id THEN
    RAISE EXCEPTION 'Only the read status can be updated';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_mail_items_customer_update
  BEFORE UPDATE ON public.mail_items
  FOR EACH ROW EXECUTE FUNCTION public.enforce_mail_item_customer_update();