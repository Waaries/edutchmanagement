
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export const createOrUpdateProfile = async (userId: string, userData: any) => {
  try {
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (existingProfile) {
      console.log('Profile already exists for user:', userId);
      return { data: existingProfile, error: null };
    }

    // Create new profile without email field (email is in auth.users)
    const profileData = {
      id: userId,
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert([profileData])
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return { data: null, error };
    }

    console.log('Profile created successfully:', data);
    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error in createOrUpdateProfile:', err);
    return { data: null, error: err };
  }
};

export const getProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error in getProfile:', err);
    return { data: null, error: err };
  }
};

export const ensureProfileExists = async (user: User) => {
  try {
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (existingProfile) {
      console.log('Profile already exists for user:', user.email);
      return true;
    }

    // Create new profile using user metadata
    const userMetadata = user.user_metadata as any;
    const profileData = {
      id: user.id,
      first_name: userMetadata?.first_name || userMetadata?.name?.split(' ')[0] || '',
      last_name: userMetadata?.last_name || userMetadata?.name?.split(' ').slice(1).join(' ') || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert([profileData])
      .select()
      .single();

    if (error) {
      console.error('Error creating profile in ensureProfileExists:', error);
      return false;
    }

    console.log('Profile created successfully in ensureProfileExists:', data);
    return true;
  } catch (err) {
    console.error('Unexpected error in ensureProfileExists:', err);
    return false;
  }
};
