
import { AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export function useAuthMethods() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const cleanAuthState = () => {
    console.log('Cleaning auth state...');
    // Remove all Supabase auth-related keys
    const keysToRemove = Object.keys(localStorage).filter(key => 
      key.startsWith('supabase.auth.') || key.includes('sb-')
    );
    keysToRemove.forEach(key => {
      console.log('Removing key:', key);
      localStorage.removeItem(key);
    });
    
    // Also clear sessionStorage if used
    const sessionKeys = Object.keys(sessionStorage || {}).filter(key => 
      key.startsWith('supabase.auth.') || key.includes('sb-')
    );
    sessionKeys.forEach(key => {
      sessionStorage.removeItem(key);
    });
  };

  const signIn = async (email: string, password: string) => {
    try {
      cleanAuthState();
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) {
      } else {
        console.error('Login error:', error.message);
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
      
      if (!error) {
      } else {
        console.error('Signup error:', error.message);
      }
      return { error };
    } catch (err) {
      console.error('Registration error:', err);
      return { error: err as AuthError };
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('Starting Google sign in...');
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
      console.log('Starting Facebook sign in...');
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
      console.log('Starting sign out process...');

      // Navigate first (SPA) to avoid white flash from full page reload
      navigate('/', { replace: true });

      toast({
        title: "Uitgelogd",
        description: "U bent succesvol uitgelogd.",
      });

      cleanAuthState();
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Uitloggen Mislukt",
        description: "Er was een probleem bij het uitloggen. Probeer het opnieuw.",
        variant: "destructive",
      });
      navigate('/', { replace: true });
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
