
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('Checking admin status for user:', userId);
      const { data, error } = await supabase.rpc('is_admin');
      
      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return false;
      }
      
      console.log('Admin check result for user:', userId, 'is admin:', data);
      setIsAdmin(data);
      return data;
    } catch (err) {
      console.error('Failed to check admin status:', err);
      setIsAdmin(false);
      return false;
    }
  };

  const handleAuthChange = async (event: string, currentSession: Session | null) => {
    console.log('Auth state changed:', event, currentSession?.user?.email);
    
    if (event === 'SIGNED_OUT') {
      console.log('User signed out, clearing state');
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    
    if (currentSession?.user) {
      console.log('Setting user session for:', currentSession.user.email);
      setSession(currentSession);
      setUser(currentSession.user);
      
      // Check admin status after setting user
      setTimeout(async () => {
        try {
          await checkAdminStatus(currentSession.user.id);
        } catch (error) {
          console.log('Admin check failed but continuing:', error);
        }
      }, 100);
      
      setLoading(false);
    } else {
      console.log('No session, clearing user state');
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
        console.log('Initializing auth state...');
        setLoading(true);
        
        // Get initial session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        console.log('Initial session check:', !!currentSession, error ? 'Error: ' + error.message : 'OK');
        
        if (!mounted) return;
        
        // Set up auth state listener
        const { data: authData } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) {
              console.log('Component unmounted, ignoring auth state change');
              return;
            }
            
            await handleAuthChange(event, session);
          }
        );
        
        authSubscription = authData.subscription;
        
        // Process initial session
        await handleAuthChange('INITIAL_SESSION', currentSession);
        
        console.log('Auth initialization complete');
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
      console.log('Cleaning up auth state hook');
      clearTimeout(timer);
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  console.log('Auth state hook values:', { 
    session: !!session, 
    user: !!user, 
    loading, 
    isAdmin, 
    initialized 
  });

  return { session, user, loading, isAdmin, initialized };
}
