
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { createOrUpdateProfile } from '@/lib/profile-utils';

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = async (userId: string) => {
    try {
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

  const handleUserSession = async (currentSession: Session | null) => {
    console.log('handleUserSession called with session:', !!currentSession);
    
    if (currentSession?.user) {
      console.log('Setting user session for:', currentSession.user.email);
      setSession(currentSession);
      setUser(currentSession.user);
      
      // Try to create or update profile, but don't let it block the user
      try {
        const userMetadata = currentSession.user.user_metadata;
        await createOrUpdateProfile(currentSession.user.id, {
          first_name: userMetadata.first_name || userMetadata.name?.split(' ')[0] || '',
          last_name: userMetadata.last_name || userMetadata.name?.split(' ').slice(1).join(' ') || ''
        });
      } catch (error) {
        console.log('Profile creation failed but continuing:', error);
      }
      
      // Check admin status after profile is handled
      await checkAdminStatus(currentSession.user.id);
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
      try {
        console.log('Initializing auth state...');
        setLoading(true);
        
        // Clean up any old auth state
        const keysToRemove = Object.keys(localStorage).filter(key => 
          key.startsWith('supabase.auth.') && key.includes('previous-session')
        );
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // Set up auth state listener FIRST
        const { data: authData } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            console.log('Auth state changed:', event, currentSession?.user?.email);
            
            if (!mounted) {
              console.log('Component unmounted, ignoring auth state change');
              return;
            }
            
            if (event === 'SIGNED_OUT') {
              console.log('User signed out, clearing state');
              setSession(null);
              setUser(null);
              setIsAdmin(false);
              setLoading(false);
            } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              console.log('User signed in or token refreshed');
              await handleUserSession(currentSession);
            } else if (event === 'INITIAL_SESSION') {
              console.log('Initial session detected');
              await handleUserSession(currentSession);
            }
          }
        );
        
        authSubscription = authData.subscription;
        
        // Get initial session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Initial session check:', !!currentSession);
        
        if (!mounted) return;
        
        await handleUserSession(currentSession);
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    initializeAuth();

    return () => {
      console.log('Cleaning up auth state hook');
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  return { session, user, loading, isAdmin };
}
