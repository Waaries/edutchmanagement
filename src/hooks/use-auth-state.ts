
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
      
      // Direct query to user_roles table to check admin status - avoiding the function
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();
      
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
    let isUnmounted = false;
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.email);
        
        if (isUnmounted) return;
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Check admin status when user signs in
        if (currentSession?.user) {
          // Use setTimeout to prevent potential deadlocks
          setTimeout(async () => {
            if (isUnmounted) return;
            await checkAdminStatus(currentSession.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (isUnmounted) return;
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          console.log('Found existing session for user:', currentSession.user.email);
          await checkAdminStatus(currentSession.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (!isUnmounted) {
          setLoading(false);
        }
      }
    };
    
    initializeAuth();

    return () => {
      isUnmounted = true;
      subscription.unsubscribe();
    };
  }, []);

  return { session, user, loading, isAdmin };
}
