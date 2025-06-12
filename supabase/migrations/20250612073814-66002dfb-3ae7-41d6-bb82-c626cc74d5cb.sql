
-- First, check if the Service Agreement template already exists
DO $$
DECLARE
    template_exists boolean;
    template_uuid uuid;
BEGIN
    -- Check if template exists
    SELECT EXISTS(SELECT 1 FROM public.contract_templates WHERE title = 'Service Agreement') INTO template_exists;
    
    -- Only insert if it doesn't exist
    IF NOT template_exists THEN
        INSERT INTO public.contract_templates (
          title,
          description,
          content,
          status,
          created_by
        ) VALUES (
          'Service Agreement',
          'Standard service agreement template for business services',
          '<div class="contract-document">
<h1>SERVICE AGREEMENT</h1>

<p><strong>This Service Agreement</strong> ("Agreement") is entered into on {{start_date}} between:</p>

<div class="parties">
<p><strong>Service Provider:</strong><br>
[Your Company Name]<br>
[Your Address]<br>
[City, State, ZIP]<br>
Email: [Your Email]<br>
Phone: [Your Phone]</p>

<p><strong>Client:</strong><br>
{{client_name}}<br>
{{client_address}}<br>
Email: {{client_email}}<br>
Phone: {{client_phone}}</p>
</div>

<h2>1. SERVICES</h2>
<p>The Service Provider agrees to provide the following services ("Services"):</p>
<p>{{services_description}}</p>

<h2>2. COMPENSATION</h2>
<p>In consideration for the Services, Client agrees to pay:</p>
<ul>
<li>Monthly Fee: {{monthly_fee}}</li>
<li>Payment Terms: {{payment_terms}}</li>
</ul>

<h2>3. TERM</h2>
<p>This Agreement shall commence on {{start_date}} and shall continue until {{end_date}}, unless terminated earlier in accordance with the terms herein.</p>

<h2>4. TERMINATION</h2>
<p>Either party may terminate this Agreement with {{termination_notice}} days written notice.</p>

<h2>5. CONFIDENTIALITY</h2>
<p>Both parties acknowledge that they may have access to confidential information and agree to maintain the confidentiality of such information.</p>

<h2>6. GOVERNING LAW</h2>
<p>This Agreement shall be governed by the laws of {{governing_state}}.</p>

<div class="signatures">
<div class="signature-block">
<p>Service Provider:</p>
<p>_________________________</p>
<p>Date: _________________</p>
</div>

<div class="signature-block">
<p>Client:</p>
<p>_________________________</p>
<p>Date: _________________</p>
</div>
</div>
</div>

<style>
.contract-document {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  font-family: "Times New Roman", serif;
  line-height: 1.6;
  color: #333;
}

.parties {
  background-color: #f9f9f9;
  padding: 20px;
  margin: 20px 0;
  border-left: 4px solid #007bff;
}

h1 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 30px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

h2 {
  font-size: 16px;
  margin-top: 30px;
  margin-bottom: 15px;
  text-transform: uppercase;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
}

.signatures {
  margin-top: 50px;
  display: flex;
  justify-content: space-between;
}

.signature-block {
  width: 45%;
}

ul {
  margin: 15px 0;
  padding-left: 20px;
}

li {
  margin: 8px 0;
}
</style>',
          'active',
          (SELECT id FROM auth.users LIMIT 1)
        );
    END IF;
    
    -- Get the template ID
    SELECT id FROM public.contract_templates WHERE title = 'Service Agreement' INTO template_uuid;
    
    -- Check if fields already exist for this template
    IF NOT EXISTS(SELECT 1 FROM public.contract_template_fields WHERE template_id = template_uuid) THEN
        -- Insert template fields for the Service Agreement
        INSERT INTO public.contract_template_fields (
          template_id,
          field_name,
          field_label,
          field_type,
          is_required,
          placeholder,
          sort_order
        ) VALUES 
        (template_uuid, 'client_name', 'Client Name', 'text', true, 'Enter client or company name', 0),
        (template_uuid, 'client_address', 'Client Address', 'textarea', true, 'Enter complete client address', 1),
        (template_uuid, 'client_email', 'Client Email', 'email', true, 'client@example.com', 2),
        (template_uuid, 'client_phone', 'Client Phone', 'phone', true, '+1 (555) 123-4567', 3),
        (template_uuid, 'services_description', 'Services Description', 'textarea', true, 'Describe the services to be provided', 4),
        (template_uuid, 'monthly_fee', 'Monthly Fee', 'text', true, '€150.00', 5),
        (template_uuid, 'payment_terms', 'Payment Terms', 'select', true, '', 6),
        (template_uuid, 'start_date', 'Start Date', 'date', true, '', 7),
        (template_uuid, 'end_date', 'End Date', 'date', true, '', 8),
        (template_uuid, 'termination_notice', 'Termination Notice (days)', 'number', true, '30', 9),
        (template_uuid, 'governing_state', 'Governing State/Country', 'text', true, 'Netherlands', 10);

        -- Update the payment terms field to include select options
        UPDATE public.contract_template_fields 
        SET field_options = ARRAY['Net 30 days', 'Net 15 days', 'Due on receipt', 'Monthly in advance', 'Quarterly in advance']
        WHERE field_name = 'payment_terms' AND template_id = template_uuid;
    END IF;
END $$;
