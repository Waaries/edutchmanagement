
import { createContext, useContext } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { useAuthState } from '@/hooks/use-auth-state';
import { useAuthMethods } from '@/hooks/use-auth-methods';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, metadata?: Record<string, string>) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signInWithFacebook: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { session, user, loading, isAdmin } = useAuthState();
  const { signIn, signUp, signOut, signInWithGoogle, signInWithFacebook, resetPassword } = useAuthMethods();

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
