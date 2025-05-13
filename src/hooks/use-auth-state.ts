
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log("Checking admin status for userId:", userId);
      
      // Use the is_admin() function via RPC
      const { data, error } = await supabase.rpc('is_admin');
      
      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return false;
      }
      
      const hasAdminRole = !!data;
      console.log('Admin check result:', hasAdminRole);
      setIsAdmin(hasAdminRole);
      return hasAdminRole;
    } catch (err) {
      console.error('Failed to check admin status:', err);
      setIsAdmin(false);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;
    
    // Helper to safely update state only if component is still mounted
    const safeSetState = {
      session: (value: Session | null) => {
        if (mounted) setSession(value);
      },
      user: (value: User | null) => {
        if (mounted) setUser(value);
      },
      isAdmin: (value: boolean) => {
        if (mounted) setIsAdmin(value);
      },
      loading: (value: boolean) => {
        if (mounted) setLoading(value);
      }
    };
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.email);
        
        if (!mounted) return;
        
        safeSetState.session(currentSession);
        safeSetState.user(currentSession?.user ?? null);
        
        // Check admin status when user signs in
        if (currentSession?.user) {
          await checkAdminStatus(currentSession.user.id);
        } else {
          safeSetState.isAdmin(false);
        }
        
        safeSetState.loading(false);
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        safeSetState.session(currentSession);
        safeSetState.user(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          console.log('Found existing session for user:', currentSession.user.email);
          await checkAdminStatus(currentSession.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          safeSetState.loading(false);
        }
      }
    };
    
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, user, loading, isAdmin };
}
