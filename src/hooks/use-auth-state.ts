
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = async () => {
    try {
      // Use the fixed is_admin function
      const { data, error } = await supabase.rpc('is_admin');
      
      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return false;
      }
      
      console.log('Admin check result:', data);
      setIsAdmin(data);
      return data;
    } catch (err) {
      console.error('Failed to check admin status:', err);
      setIsAdmin(false);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;
    
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Clean up existing auth state to prevent conflicts
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('supabase.auth.') && key.includes('previous-session')) {
            localStorage.removeItem(key);
          }
        });
        
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (currentSession?.user) {
          console.log('Found existing session for user:', currentSession.user.email);
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Wait a moment before checking admin status to ensure auth is ready
          setTimeout(async () => {
            if (mounted) {
              await checkAdminStatus();
              setLoading(false);
            }
          }, 500);
        } else {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.email);
        
        if (!mounted) return;
        
        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
        } else if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Wait a moment before checking admin status to ensure auth is ready
          setTimeout(async () => {
            if (mounted) {
              await checkAdminStatus();
              setLoading(false);
            }
          }, 500);
        } else {
          setLoading(false);
        }
      }
    );
    
    // Initialize auth state
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, user, loading, isAdmin };
}
