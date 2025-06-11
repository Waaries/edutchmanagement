
-- Create enum for contract status
CREATE TYPE public.contract_status AS ENUM ('draft', 'active', 'inactive', 'archived');

-- Create enum for field types in contract templates
CREATE TYPE public.field_type AS ENUM ('text', 'textarea', 'number', 'date', 'email', 'phone', 'select', 'checkbox');

-- Create contract templates table
CREATE TABLE public.contract_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL, -- HTML content with placeholders
  status contract_status NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contract template fields table (for defining fillable fields)
CREATE TABLE public.contract_template_fields (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES public.contract_templates(id) ON DELETE CASCADE NOT NULL,
  field_name TEXT NOT NULL, -- e.g., "client_name", "contract_date"
  field_label TEXT NOT NULL, -- e.g., "Client Name", "Contract Date"
  field_type field_type NOT NULL DEFAULT 'text',
  field_options TEXT[], -- for select fields
  is_required BOOLEAN NOT NULL DEFAULT false,
  placeholder TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create filled contracts table (instances of templates filled by clients)
CREATE TABLE public.filled_contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES public.contract_templates(id) NOT NULL,
  client_email TEXT NOT NULL,
  client_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, signed
  filled_data JSONB NOT NULL DEFAULT '{}', -- field_name -> value mapping
  access_token TEXT UNIQUE NOT NULL, -- for secure access without login
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all tables
ALTER TABLE public.contract_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_template_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.filled_contracts ENABLE ROW LEVEL SECURITY;

-- RLS policies for contract_templates (only admins can manage)
CREATE POLICY "Admins can manage contract templates" 
  ON public.contract_templates 
  FOR ALL 
  USING (public.is_admin());

-- RLS policies for contract_template_fields (only admins can manage)
CREATE POLICY "Admins can manage contract template fields" 
  ON public.contract_template_fields 
  FOR ALL 
  USING (public.is_admin());

-- RLS policies for filled_contracts (admins can view all, public can access with token)
CREATE POLICY "Admins can view all filled contracts" 
  ON public.filled_contracts 
  FOR SELECT 
  USING (public.is_admin());

CREATE POLICY "Admins can insert filled contracts" 
  ON public.filled_contracts 
  FOR INSERT 
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update filled contracts" 
  ON public.filled_contracts 
  FOR UPDATE 
  USING (public.is_admin());

-- Add indexes for performance
CREATE INDEX idx_contract_templates_status ON public.contract_templates(status);
CREATE INDEX idx_contract_template_fields_template_id ON public.contract_template_fields(template_id);
CREATE INDEX idx_filled_contracts_template_id ON public.filled_contracts(template_id);
CREATE INDEX idx_filled_contracts_access_token ON public.filled_contracts(access_token);
CREATE INDEX idx_filled_contracts_status ON public.filled_contracts(status);

-- Add triggers for updated_at
CREATE TRIGGER update_contract_templates_updated_at 
  BEFORE UPDATE ON public.contract_templates 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_filled_contracts_updated_at 
  BEFORE UPDATE ON public.filled_contracts 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
