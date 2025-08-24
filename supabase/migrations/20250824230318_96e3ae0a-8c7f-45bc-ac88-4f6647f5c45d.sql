-- Enable realtime for existing tables that might need it
-- This ensures realtime functionality works properly

-- Enable realtime for address_requests table
ALTER TABLE public.address_requests REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.address_requests;

-- Enable realtime for contact_messages table  
ALTER TABLE public.contact_messages REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.contact_messages;

-- Enable realtime for user_roles table
ALTER TABLE public.user_roles REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.user_roles;

-- Enable realtime for profiles table
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.profiles;