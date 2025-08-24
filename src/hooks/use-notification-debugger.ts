
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js';
import type { DebugMode } from "@/components/debug/types";

export const useNotificationDebugger = () => {
  const { toast } = useToast();
  const [debugMode, setDebugMode] = useState<DebugMode>('none');
  const [channelStatus, setChannelStatus] = useState<string>('Connecting');

  // Check if real-time is working by checking the status of the admin-notifications channel
  const checkRealtimeStatus = async () => {
    try {
      setChannelStatus('Connecting');
      
      // Create a more persistent channel to check Supabase realtime connection
      const testChannel = supabase.channel('realtime-health-check', {
        config: {
          broadcast: { self: false },
          presence: { key: 'health-check' }
        }
      });
      
      testChannel
        .subscribe((status) => {
          console.log('[DEBUG] Realtime channel status:', status);
          setChannelStatus(status);
          
          if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
            console.log('[DEBUG] Realtime connection successful');
          } else if (status === REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR) {
            console.error('[DEBUG] Realtime channel error');
            setChannelStatus('Error');
          } else if (status === REALTIME_SUBSCRIBE_STATES.TIMED_OUT) {
            console.error('[DEBUG] Realtime connection timed out');
            setChannelStatus('Timeout');
          } else if (status === REALTIME_SUBSCRIBE_STATES.CLOSED) {
            console.log('[DEBUG] Realtime connection closed');
            setChannelStatus('Closed');
          }
          
          // Keep the channel open for ongoing monitoring
          // Don't remove it automatically
        });
    } catch (err: any) {
      console.error('[DEBUG] Error checking realtime status:', err);
      setChannelStatus('ERROR');
      toast({
        title: 'Realtime Error',
        description: err.message,
        variant: 'destructive'
      });
    }
  };

  // Automatically check realtime status on hook initialization
  useEffect(() => {
    checkRealtimeStatus();
    
    // Check status periodically
    const interval = setInterval(() => {
      checkRealtimeStatus();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [toast]); // Include toast in dependencies

  // Simple toggle for debug panel visibility
  const toggleDebugMode = () => {
    setDebugMode(current => {
      switch(current) {
        case 'none': return 'visible';
        case 'visible': return 'expanded';
        case 'expanded': return 'none';
        default: return 'none';
      }
    });
  };

  // Test sending a contact message directly from the Supabase client
  const testContactNotification = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([{
          name: 'Test User',
          email: 'test@example.com',
          message: 'This is a test message from the debug panel',
          status: 'unread'
        }])
        .select();

      if (error) {
        console.error('[DEBUG] Error inserting test contact message:', error);
        toast({
          title: 'Error',
          description: `Failed to send test notification: ${error.message}`,
          variant: 'destructive'
        });
      } else {
        console.log('[DEBUG] Successfully sent test contact message:', data);
        toast({
          title: 'Debug Success',
          description: 'Test contact message created successfully'
        });
      }
    } catch (err: any) {
      console.error('[DEBUG] Exception when testing notification:', err);
      toast({
        title: 'Error',
        description: `Exception: ${err.message}`,
        variant: 'destructive'
      });
    }
  };

  const resetRealtime = () => {
    try {
      const channels = supabase.getChannels ? supabase.getChannels() : [] as any[];
      channels.forEach((ch: any) => supabase.removeChannel(ch));
      setChannelStatus('Connecting');
      checkRealtimeStatus();
    } catch (err) {
      console.error('[DEBUG] Error resetting realtime:', err);
    }
  };

  return {
    debugMode,
    channelStatus,
    toggleDebugMode,
    testContactNotification,
    checkRealtimeStatus,
    resetRealtime
  };
};
