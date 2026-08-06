ALTER TABLE public.mail_items RENAME COLUMN scan_url TO scan_path;

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
     OR NEW.scan_path IS DISTINCT FROM OLD.scan_path
     OR NEW.notes IS DISTINCT FROM OLD.notes
     OR NEW.registered_by IS DISTINCT FROM OLD.registered_by
     OR NEW.id IS DISTINCT FROM OLD.id THEN
    RAISE EXCEPTION 'Only the read status can be updated';
  END IF;

  RETURN NEW;
END;
$$;