import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { SupabaseClient } from '@supabase/supabase-js/dist/module';
import { cleanupAuthState } from '@/utils/auth-utils';

// Define our own type definitions based on what we need
type Session = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: User;
};

type User = {
  id: string;
  email?: string;
  app_metadata: Record<string, any>;
  user_metadata: Record<string, any>;
  aud: string;
};

type AuthError = {
  message: string;
  status?: number;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signInWithFacebook: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  // Function to check if user is an admin
  const checkAdminStatus = async (userId: string) => {
    try {
      // Use the is_admin database function for improved security
      const { data, error } = await supabase.rpc('is_admin');
      
      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return;
      }
      
      setIsAdmin(!!data);
    } catch (err) {
      console.error('Failed to check admin status:', err);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession as Session);
        setUser(currentSession?.user as User ?? null);
        setLoading(false);
        
        // Check admin status if user is logged in
        if (currentSession?.user) {
          // Use setTimeout to avoid deadlocks with Supabase auth
          setTimeout(() => {
            checkAdminStatus(currentSession.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
        }
        
        // Log authentication events for security monitoring
        if (event === 'SIGNED_IN') {
          console.log('User signed in:', currentSession?.user?.email);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        } else if (event === 'PASSWORD_RECOVERY') {
          toast({
            title: "Password Recovery",
            description: "Follow the instructions sent to your email to reset your password.",
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession as Session);
      setUser(currentSession?.user as User ?? null);
      
      if (currentSession?.user) {
        checkAdminStatus(currentSession.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // First clean up any existing auth state to prevent issues
      cleanupAuthState();

      // Try global sign out first to ensure a clean state
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if global sign out fails
        console.log('Global sign out failed, continuing with login');
      }

      // Now perform the actual sign in
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) {
        // Successful login
        console.log('Successful login for:', email);
      }
      return { error };
    } catch (err) {
      console.error('Authentication error:', err);
      return { error: err as AuthError };
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
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
      // First clean up local storage to prevent auth limbo
      cleanupAuthState();
      
      // Then try global sign out from Supabase
      await supabase.auth.signOut({ scope: 'global' });
      
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      
      // Force page reload for a clean state
      window.location.href = '/auth';
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign Out Failed",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      isAdmin,
      signIn, 
      signUp, 
      signOut, 
      signInWithGoogle, 
      signInWithFacebook,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
