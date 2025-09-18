-- Re-enable Row Level Security on address_requests table
ALTER TABLE public.address_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to submit address requests (public form access)
CREATE POLICY "Anyone can submit address requests" 
ON public.address_requests 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow admins to view all address requests
CREATE POLICY "Admins can view all address requests" 
ON public.address_requests 
FOR SELECT 
USING (is_admin());

-- Create policy to allow admins to update address requests
CREATE POLICY "Admins can update address requests" 
ON public.address_requests 
FOR UPDATE 
USING (is_admin());

-- Create policy to allow admins to delete address requests
CREATE POLICY "Admins can delete address requests" 
ON public.address_requests 
FOR DELETE 
USING (is_admin());

-- Create policy to allow authenticated users to view their own requests
CREATE POLICY "Users can view their own requests" 
ON public.address_requests 
FOR SELECT 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);