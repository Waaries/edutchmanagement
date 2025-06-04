
import { createContext, useContext } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { useAuthState } from '@/hooks/use-auth-state';
import { useAuthMethods } from '@/hooks/use-auth-methods';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, metadata?: Record<string, string>) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signInWithFacebook: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { session, user, loading, isAdmin, initialized } = useAuthState();
  const { signIn, signUp, signOut, signInWithGoogle, signInWithFacebook, resetPassword } = useAuthMethods();

  const value = { 
    session, 
    user, 
    loading, 
    isAdmin,
    initialized,
    signIn, 
    signUp, 
    signOut, 
    signInWithGoogle, 
    signInWithFacebook,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('useAuth must be used within an AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
