-- Uitbreiden van profiles tabel met bedrijfsgegevens
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS company_name text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS business_address text,
ADD COLUMN IF NOT EXISTS kvk_number text,
ADD COLUMN IF NOT EXISTS vat_number text;