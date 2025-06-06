
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/use-analytics";

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
    const info = getDebugInfo();
    setDebugInfo(info);
    console.log('Analytics Debug Info:', info);
  };

  const testAnalytics = () => {
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
  };

  const copyDebugInfo = () => {
    if (debugInfo) {
      navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
      console.log('Debug info copied to clipboard');
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
          
          <div className="space-y-2">
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={refreshDebugInfo}
            >
              Get Debug Info
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={testAnalytics}
            >
              Test Analytics Event
            </Button>
            
            {debugInfo && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={copyDebugInfo}
                >
                  Copy Debug Info
                </Button>
                
                <div className="mt-3 text-xs bg-gray-50 p-2 rounded border max-h-40 overflow-y-auto">
                  <div><strong>Environment:</strong> {debugInfo.environment}</div>
                  <div><strong>Hostname:</strong> {debugInfo.hostname}</div>
                  <div><strong>gtag exists:</strong> {debugInfo.gtagExists ? '✅' : '❌'}</div>
                  <div><strong>gtag ready:</strong> {debugInfo.gtagReady ? '✅' : '❌'}</div>
                  <div><strong>Initialized:</strong> {debugInfo.analyticsInitialized ? '✅' : '❌'}</div>
                  <div><strong>Has consent:</strong> {debugInfo.hasConsent ? '✅' : '❌'}</div>
                  <div><strong>Measurement ID:</strong> {debugInfo.measurementId}</div>
                  {debugInfo.debugLog && debugInfo.debugLog.length > 0 && (
                    <div className="mt-2">
                      <strong>Recent logs:</strong>
                      <div className="max-h-20 overflow-y-auto text-xs">
                        {debugInfo.debugLog.slice(-5).map((log: any, index: number) => (
                          <div key={index} className="border-t pt-1 mt-1">
                            <div className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</div>
                            <div>{log.message}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          
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
