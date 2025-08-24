-- Remove test/dummy data from the database to keep only real data

-- Delete test contact messages
DELETE FROM public.contact_messages 
WHERE name = 'Test User' 
   OR email = 'test@example.com'
   OR message LIKE '%test%'
   OR message LIKE '%Test%'
   OR name LIKE '%test%'
   OR name LIKE '%Test%';

-- Delete any filled contracts that might be test data
DELETE FROM public.filled_contracts 
WHERE client_email LIKE '%test%' 
   OR client_email LIKE '%example%'
   OR client_name LIKE '%test%'
   OR client_name LIKE '%Test%';

-- Delete any address requests that might be test data
DELETE FROM public.address_requests 
WHERE email LIKE '%test%' 
   OR email LIKE '%example%'
   OR company_name LIKE '%test%'
   OR company_name LIKE '%Test%'
   OR contact_person LIKE '%test%'
   OR contact_person LIKE '%Test%';

-- Remove duplicate contract templates (keep only one of each type)
DELETE FROM public.contract_template_fields 
WHERE template_id IN (
  SELECT id FROM public.contract_templates 
  WHERE id != (
    SELECT MIN(id) FROM public.contract_templates ct2 
    WHERE ct2.title = contract_templates.title
  )
);

DELETE FROM public.contract_templates 
WHERE id != (
  SELECT MIN(id) FROM public.contract_templates ct2 
  WHERE ct2.title = contract_templates.title
);