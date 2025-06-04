
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { createOrUpdateProfile } from '@/lib/profile-utils';

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = async () => {
    try {
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

  const handleUserSession = async (currentSession: Session | null) => {
    if (currentSession?.user) {
      console.log('Processing session for user:', currentSession.user.email);
      setSession(currentSession);
      setUser(currentSession.user);
      
      // Create or update profile for the user
      const userMetadata = currentSession.user.user_metadata;
      await createOrUpdateProfile(currentSession.user.id, {
        first_name: userMetadata.first_name || userMetadata.name?.split(' ')[0] || '',
        last_name: userMetadata.last_name || userMetadata.name?.split(' ').slice(1).join(' ') || ''
      });
      
      // Check admin status after profile is handled
      setTimeout(async () => {
        await checkAdminStatus();
        setLoading(false);
      }, 500);
    } else {
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Clean up any old auth state
        const keysToRemove = Object.keys(localStorage).filter(key => 
          key.startsWith('supabase.auth.') && key.includes('previous-session')
        );
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        await handleUserSession(currentSession);
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.email);
        
        if (!mounted) return;
        
        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
        } else {
          await handleUserSession(currentSession);
        }
      }
    );
    
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, user, loading, isAdmin };
}
