
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js';
import type { DebugMode } from "@/components/debug/types";

export const useNotificationDebugger = () => {
  const { toast } = useToast();
  const [debugMode, setDebugMode] = useState<DebugMode>('none');
  const [channelStatus, setChannelStatus] = useState<string>('Unknown');

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

  // Check if real-time is working by checking the status of the admin-notifications channel
  const checkRealtimeStatus = async () => {
    try {
      // Create a temporary channel to check if Supabase can establish a connection
      const testChannel = supabase.channel('test-connection');
      
      testChannel
        .subscribe((status) => {
          console.log('[DEBUG] Test channel status:', status);
          setChannelStatus(status);
          
          // Use the correct enum comparison
          if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
            toast({
              title: 'Realtime Connection',
              description: 'Successfully connected to Supabase realtime'
            });
          } else {
            toast({
              title: 'Realtime Status',
              description: `Current status: ${status}`,
              variant: status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED ? 'default' : 'destructive'
            });
          }
          
          // Remove the test channel after checking
          setTimeout(() => {
            supabase.removeChannel(testChannel);
          }, 2000);
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

  return {
    debugMode,
    channelStatus,
    toggleDebugMode,
    testContactNotification,
    checkRealtimeStatus
  };
};
