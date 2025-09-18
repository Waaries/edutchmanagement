-- Create policy to allow users to delete their own address requests
CREATE POLICY "Users can delete their own requests" 
ON public.address_requests 
FOR DELETE 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);