
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { devLog } from "@/lib/logger";

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('is_admin');
      
      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return false;
      }
      
      setIsAdmin(data);
      return data;
    } catch (err) {
      console.error('Failed to check admin status:', err);
      setIsAdmin(false);
      return false;
    }
  };

  const handleAuthChange = async (event: string, currentSession: Session | null) => {
    
    if (event === 'SIGNED_OUT') {
      devLog('User signed out, clearing state');
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    
    if (currentSession?.user) {
      setSession(currentSession);
      setUser(currentSession.user);
      
      // Check admin status after setting user
      setTimeout(async () => {
        try {
          await checkAdminStatus(currentSession.user.id);
        } catch (error) {
          devLog('Admin check failed but continuing:', error);
        }
      }, 100);
      
      setLoading(false);
    } else {
      devLog('No session, clearing user state');
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;
    
    const initializeAuth = async () => {
      if (!mounted) return;
      
      try {
        devLog('Initializing auth state...');
        setLoading(true);
        
        // Get initial session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        // Set up auth state listener
        const { data: authData } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) {
              devLog('Component unmounted, ignoring auth state change');
              return;
            }
            
            await handleAuthChange(event, session);
          }
        );
        
        authSubscription = authData.subscription;
        
        // Process initial session
        await handleAuthChange('INITIAL_SESSION', currentSession);
        
        devLog('Auth initialization complete');
        setInitialized(true);
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };
    
    // Small delay to ensure proper initialization
    const timer = setTimeout(initializeAuth, 50);

    return () => {
      devLog('Cleaning up auth state hook');
      clearTimeout(timer);
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  devLog('Auth state hook values:', { 
    session: !!session, 
    user: !!user, 
    loading, 
    isAdmin, 
    initialized 
  });

  return { session, user, loading, isAdmin, initialized };
}
