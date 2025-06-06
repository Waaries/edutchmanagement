
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNotificationDebugger } from "@/hooks/use-notification-debugger";
import DebugToggleButton from "./DebugToggleButton";
import DebugControls from "./DebugControls";
import { getStatusColor } from "./utils";

const NotificationDebugger: React.FC = () => {
  const {
    debugMode,
    channelStatus,
    toggleDebugMode,
    testContactNotification,
    checkRealtimeStatus
  } = useNotificationDebugger();

  // Show only toggle button if debug mode is 'none'
  if (debugMode === 'none') {
    return (
      <DebugToggleButton 
        debugMode={debugMode} 
        onToggle={toggleDebugMode} 
      />
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
        
        <DebugControls
          debugMode={debugMode}
          channelStatus={channelStatus}
          onToggleDebugMode={toggleDebugMode}
          onCheckRealtimeStatus={checkRealtimeStatus}
          onTestContactNotification={testContactNotification}
          getStatusColor={getStatusColor}
        />
      </div>
    </div>
  );
};

export default NotificationDebugger;
