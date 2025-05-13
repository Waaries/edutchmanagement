
export type UserData = {
  id: string;
  email: string;
  created_at: string;
  is_admin: boolean;
  last_sign_in_at: string | null;
  raw_app_meta_data?: any; // Added to match the data returned from Supabase
};
