
import { AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useAuthMethods() {
  const { toast } = useToast();

  const cleanAuthState = () => {
    const keysToRemove = Object.keys(localStorage).filter(key => 
      key.startsWith('supabase.auth.') || key.includes('sb-')
    );
    keysToRemove.forEach(key => localStorage.removeItem(key));
  };

  const signIn = async (email: string, password: string) => {
    try {
      cleanAuthState();
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) {
        console.log('Successful login for:', email);
      }
      return { error };
    } catch (err) {
      console.error('Authentication error:', err);
      return { error: err as AuthError };
    }
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, string>) => {
    try {
      cleanAuthState();
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });
      return { error };
    } catch (err) {
      console.error('Registration error:', err);
      return { error: err as AuthError };
    }
  };

  const signInWithGoogle = async () => {
    try {
      cleanAuthState();
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth`,
        }
      });
      return { error };
    } catch (err) {
      console.error('Google login error:', err);
      return { error: err as AuthError };
    }
  };

  const signInWithFacebook = async () => {
    try {
      cleanAuthState();
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth`,
        }
      });
      return { error };
    } catch (err) {
      console.error('Facebook login error:', err);
      return { error: err as AuthError };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });
      return { error };
    } catch (err) {
      console.error('Password reset error:', err);
      return { error: err as AuthError };
    }
  };

  const signOut = async () => {
    try {
      cleanAuthState();
      
      await supabase.auth.signOut();
      
      toast({
        title: "Uitgelogd",
        description: "U bent succesvol uitgelogd.",
      });
      
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Uitloggen Mislukt",
        description: "Er was een probleem bij het uitloggen. Probeer het opnieuw.",
        variant: "destructive",
      });
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithFacebook,
    resetPassword
  };
}
