
import React from 'react';
import { Button } from "@/components/ui/button";
import type { DebugMode } from "./types";

interface DebugControlsProps {
  debugMode: DebugMode;
  channelStatus: string;
  onToggleDebugMode: () => void;
  onCheckRealtimeStatus: () => void;
  onTestContactNotification: () => void;
  getStatusColor: (status: string) => string;
}

const DebugControls: React.FC<DebugControlsProps> = ({
  debugMode,
  channelStatus,
  onToggleDebugMode,
  onCheckRealtimeStatus,
  onTestContactNotification,
  getStatusColor
}) => {
  return (
    <div className="space-y-2">
      <div className="text-sm">
        <span>Realtime Status: </span>
        <span className={`font-medium ${getStatusColor(channelStatus)}`}>
          {channelStatus}
        </span>
      </div>
      
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={onCheckRealtimeStatus}
      >
        Check Realtime Status
      </Button>
      
      {debugMode === 'expanded' && (
        <>
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={onTestContactNotification}
          >
            Send Test Contact Message
          </Button>
          
          <div className="text-xs mt-2 text-gray-500">
            <p>Test messages will trigger notifications if correctly configured.</p>
          </div>
        </>
      )}
    </div>
  );
};

export default DebugControls;
