-- Remove test/dummy data from the database to keep only real data

-- Delete test contact messages
DELETE FROM public.contact_messages 
WHERE name = 'Test User' 
   OR email = 'test@example.com'
   OR message ILIKE '%test%'
   OR name ILIKE '%test%';

-- Delete any filled contracts that might be test data
DELETE FROM public.filled_contracts 
WHERE client_email ILIKE '%test%' 
   OR client_email ILIKE '%example%'
   OR client_name ILIKE '%test%';

-- Delete any address requests that might be test data
DELETE FROM public.address_requests 
WHERE email ILIKE '%test%' 
   OR email ILIKE '%example%'
   OR company_name ILIKE '%test%'
   OR contact_person ILIKE '%test%';

-- Remove duplicate contract templates (keep the first one created of each title)
WITH template_ranks AS (
  SELECT id, 
         ROW_NUMBER() OVER (PARTITION BY title ORDER BY created_at ASC) as rn
  FROM public.contract_templates
)
DELETE FROM public.contract_template_fields 
WHERE template_id IN (
  SELECT id FROM template_ranks WHERE rn > 1
);

WITH template_ranks AS (
  SELECT id, 
         ROW_NUMBER() OVER (PARTITION BY title ORDER BY created_at ASC) as rn
  FROM public.contract_templates
)
DELETE FROM public.contract_templates 
WHERE id IN (
  SELECT id FROM template_ranks WHERE rn > 1
);