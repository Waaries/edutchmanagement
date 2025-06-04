
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

  // Don't render children until auth is initialized to prevent useAuth errors
  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Bezig met laden...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('useAuth must be used within an AuthProvider - context is undefined');
    // Return a fallback object instead of throwing to prevent crashes
    return {
      session: null,
      user: null,
      loading: false,
      isAdmin: false,
      initialized: false,
      signIn: async () => ({ error: new Error('Auth not initialized') as AuthError }),
      signUp: async () => ({ error: new Error('Auth not initialized') as AuthError }),
      signOut: async () => {},
      signInWithGoogle: async () => ({ error: new Error('Auth not initialized') as AuthError }),
      signInWithFacebook: async () => ({ error: new Error('Auth not initialized') as AuthError }),
      resetPassword: async () => ({ error: new Error('Auth not initialized') as AuthError })
    };
  }
  return context;
}
