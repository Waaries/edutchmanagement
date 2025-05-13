
export type UserData = {
  id: string;
  email: string;
  created_at: string;
  is_admin: boolean;
  last_sign_in_at: string | null;
  raw_app_meta_data?: any; // Added to match the data returned from Supabase
};

// Type utility to convert User from Supabase to our UserData type
export const convertToUserData = (user: any, isAdmin: boolean): UserData => ({
  id: user.id,
  email: user.email || '',
  created_at: user.created_at || new Date().toISOString(),
  last_sign_in_at: user.last_sign_in_at,
  is_admin: isAdmin,
  raw_app_meta_data: user.raw_app_meta_data
});
