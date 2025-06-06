
import React from 'react';
import { Button } from "@/components/ui/button";
import type { DebugMode } from "./types";

interface DebugToggleButtonProps {
  debugMode: DebugMode;
  onToggle: () => void;
}

const DebugToggleButton: React.FC<DebugToggleButtonProps> = ({
  debugMode,
  onToggle
}) => {
  // Show only the toggle button in production
  if (process.env.NODE_ENV !== 'development' && debugMode === 'none') {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          variant="outline" 
          size="sm"
          className="opacity-30 hover:opacity-100"
          onClick={onToggle}
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
          onClick={onToggle}
        >
          Debug Notifications
        </Button>
      </div>
    );
  }

  return null;
};

export default DebugToggleButton;
