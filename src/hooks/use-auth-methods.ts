
import { AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useAuthMethods() {
  const { toast } = useToast();

  const cleanAuthState = () => {
    console.log('Cleaning auth state...');
    const keysToRemove = Object.keys(localStorage).filter(key => 
      key.startsWith('supabase.auth.') || key.includes('sb-')
    );
    keysToRemove.forEach(key => {
      console.log('Removing key:', key);
      localStorage.removeItem(key);
    });
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Starting sign in process for:', email);
      cleanAuthState();
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) {
        console.log('Successful login for:', email);
        // Don't force redirect here, let the auth state change handle it
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
      console.log('Starting sign up process for:', email);
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
        console.log('Successful signup for:', email);
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
      console.log('Starting password reset for:', email);
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
      cleanAuthState();
      
      await supabase.auth.signOut();
      
      toast({
        title: "Uitgelogd",
        description: "U bent succesvol uitgelogd.",
      });
      
      // Force a full page reload to ensure clean state
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
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
