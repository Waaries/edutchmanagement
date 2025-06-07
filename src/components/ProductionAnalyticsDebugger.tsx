
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/use-analytics";
import DebugInfoDisplay from "@/components/analytics/DebugInfoDisplay";
import DebugControls from "@/components/analytics/DebugControls";

const ProductionAnalyticsDebugger: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const { getDebugInfo, isProduction } = useAnalytics();

  // Only show in production or when explicitly enabled
  const shouldShow = isProduction || localStorage.getItem('enableAnalyticsDebugger') === 'true';

  useEffect(() => {
    // Enable with URL parameter or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('debug') === 'analytics') {
      localStorage.setItem('enableAnalyticsDebugger', 'true');
      setIsVisible(true);
    }
  }, []);

  const refreshDebugInfo = () => {
    try {
      const info = getDebugInfo();
      setDebugInfo(info);
      console.log('Analytics Debug Info:', info);
    } catch (error) {
      console.error('Error getting debug info:', error);
    }
  };

  const testAnalytics = () => {
    try {
      // Test event tracking
      if ((window as any).gtag) {
        (window as any).gtag('event', 'debug_test', {
          event_category: 'debug',
          event_label: 'manual_test',
          value: 1
        });
        console.log('Test analytics event sent');
      } else {
        console.error('gtag function not available');
      }
    } catch (error) {
      console.error('Error sending test event:', error);
    }
  };

  const copyDebugInfo = () => {
    if (debugInfo) {
      try {
        navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
        console.log('Debug info copied to clipboard');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {!isVisible ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="opacity-50 hover:opacity-100 bg-blue-50 border-blue-200"
        >
          🔍 Analytics Debug
        </Button>
      ) : (
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 w-80 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-sm">Analytics Debugger</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
              ✕
            </Button>
          </div>
          
          <DebugControls
            onRefreshDebugInfo={refreshDebugInfo}
            onTestAnalytics={testAnalytics}
            onCopyDebugInfo={copyDebugInfo}
            hasDebugInfo={!!debugInfo}
          />
          
          <DebugInfoDisplay debugInfo={debugInfo} />
          
          <div className="mt-3 text-xs text-gray-500">
            <p>Production Mode: {isProduction ? '✅' : '❌'}</p>
            <p>Enable with: ?debug=analytics</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionAnalyticsDebugger;
