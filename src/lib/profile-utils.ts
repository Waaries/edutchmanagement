
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

/**
 * Zorgt ervoor dat een gebruikersprofiel bestaat, maakt het aan als het nog niet bestaat
 * @param user De gebruiker waarvoor een profiel moet worden aangemaakt
 * @returns Boolean die aangeeft of het profiel bestaat of aangemaakt is
 */
export async function ensureProfileExists(user: User): Promise<boolean> {
  if (!user) return false;
  
  try {
    // Controleer of het profiel al bestaat
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking profile:', fetchError);
      return false;
    }
    
    // Als het profiel bestaat, return true
    if (existingProfile) {
      return true;
    }
    
    // Profiel bestaat niet, maak het aan
    const userMetadata = user.user_metadata || {};
    
    const { error: insertError } = await supabase
      .from('profiles')
      .insert([
        {
          id: user.id,
          email: user.email,
          first_name: userMetadata.first_name || null,
          last_name: userMetadata.last_name || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    
    if (insertError) {
      console.error('Error creating profile:', insertError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception in ensureProfileExists:', error);
    return false;
  }
}

/**
 * Haal de naam van de gebruiker op, ofwel uit het profiel ofwel uit metadata
 * @param user De gebruiker
 * @returns De voornaam van de gebruiker of null als deze niet beschikbaar is
 */
export async function getUserFirstName(user: User): Promise<string | null> {
  if (!user) return null;
  
  try {
    // Probeer eerst uit het profiel
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name')
      .eq('id', user.id)
      .maybeSingle();
    
    if (data && data.first_name) {
      return data.first_name;
    }
    
    // Anders probeer uit user_metadata
    const userMetadata = user.user_metadata as any;
    if (userMetadata && userMetadata.first_name) {
      return userMetadata.first_name;
    }
    
    // Als laatste optie, gebruik de naam uit het e-mailadres
    return user.email ? user.email.split('@')[0] : null;
  } catch (error) {
    console.error('Error getting user first name:', error);
    return null;
  }
}
