
import React from 'react';
import { Button } from "@/components/ui/button";

interface DebugControlsProps {
  onRefreshDebugInfo: () => void;
  onTestAnalytics: () => void;
  onCopyDebugInfo: () => void;
  hasDebugInfo: boolean;
}

const DebugControls: React.FC<DebugControlsProps> = ({
  onRefreshDebugInfo,
  onTestAnalytics,
  onCopyDebugInfo,
  hasDebugInfo
}) => {
  return (
    <div className="space-y-2">
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={onRefreshDebugInfo}
      >
        Get Debug Info
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={onTestAnalytics}
      >
        Test Analytics Event
      </Button>
      
      {hasDebugInfo && (
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          onClick={onCopyDebugInfo}
        >
          Copy Debug Info
        </Button>
      )}
    </div>
  );
};

export default DebugControls;
