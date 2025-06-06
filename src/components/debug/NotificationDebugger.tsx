
import React from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RealtimeChannel, REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js';

type DebugMode = 'none' | 'visible' | 'expanded';

const NotificationDebugger: React.FC = () => {
  const { toast } = useToast();
  const [debugMode, setDebugMode] = React.useState<DebugMode>('none');
  const [channelStatus, setChannelStatus] = React.useState<string>('Unknown');

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
          
          // Fix: Use the correct REALTIME_SUBSCRIBE_STATES enum for comparison
          if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
            toast({
              title: 'Realtime Connection',
              description: 'Successfully connected to Supabase realtime'
            });
          } else {
            toast({
              title: 'Realtime Status',
              description: `Current status: ${status}`,
              // Fix: Use the enum for the variant condition
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

  // Debug panel is only shown in development mode
  if (process.env.NODE_ENV !== 'development' && debugMode === 'none') {
    // Show only the toggle button in production
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          variant="outline" 
          size="sm"
          className="opacity-30 hover:opacity-100"
          onClick={toggleDebugMode}
        >
          Debug
        </Button>
      </div>
    );
  }

  if (debugMode === 'none') {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          variant="outline" 
          size="sm"
          onClick={toggleDebugMode}
        >
          Debug Notifications
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 w-64">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Notification Debugger</h3>
          <Button variant="ghost" size="sm" onClick={toggleDebugMode}>
            {debugMode === 'expanded' ? 'Collapse' : 'Expand'}
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm">
            <span>Realtime Status: </span>
            <span className={`font-medium ${
              channelStatus === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED ? 'text-green-500' : 
              channelStatus === REALTIME_SUBSCRIBE_STATES.TIMED_OUT || 
              channelStatus === REALTIME_SUBSCRIBE_STATES.CLOSED || 
              channelStatus === REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR ? 'text-red-500' : 
              'text-yellow-500'
            }`}>{channelStatus}</span>
          </div>
          
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={checkRealtimeStatus}
          >
            Check Realtime Status
          </Button>
          
          {debugMode === 'expanded' && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={testContactNotification}
              >
                Send Test Contact Message
              </Button>
              
              <div className="text-xs mt-2 text-gray-500">
                <p>Test messages will trigger notifications if correctly configured.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDebugger;
