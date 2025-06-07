
import React from 'react';

interface DebugInfoDisplayProps {
  debugInfo: any;
}

const DebugInfoDisplay: React.FC<DebugInfoDisplayProps> = ({ debugInfo }) => {
  if (!debugInfo) return null;

  return (
    <div className="mt-3 text-xs bg-gray-50 p-2 rounded border max-h-40 overflow-y-auto">
      <div><strong>Environment:</strong> {debugInfo.environment}</div>
      <div><strong>Hostname:</strong> {debugInfo.environmentDetails?.hostname || debugInfo.hostname}</div>
      <div><strong>Is iframe:</strong> {debugInfo.environmentDetails?.isIframe ? '✅' : '❌'}</div>
      <div><strong>Is Lovable:</strong> {debugInfo.environmentDetails?.isLovable ? '✅' : '❌'}</div>
      <div><strong>gtag exists:</strong> {debugInfo.gtagExists ? '✅' : '❌'}</div>
      <div><strong>gtag ready:</strong> {debugInfo.gtagReady ? '✅' : '❌'}</div>
      <div><strong>Has consent:</strong> {debugInfo.hasConsent ? '✅' : '❌'}</div>
      <div><strong>Consent status:</strong> {debugInfo.consentStatus || 'null'}</div>
      <div><strong>Should track:</strong> {debugInfo.shouldTrack ? '✅' : '❌'}</div>
      <div><strong>Should track (RT):</strong> {debugInfo.shouldTrackRealtime ? '✅' : '❌'}</div>
      <div><strong>Measurement ID:</strong> {debugInfo.measurementId}</div>
      
      {debugInfo.cookieTest && (
        <div className="mt-2 border-t pt-2">
          <strong>Cookie Test:</strong>
          <div className="ml-2">
            <div><strong>Passed:</strong> {debugInfo.cookieTest.passed ? '✅' : '❌'}</div>
            {!debugInfo.cookieTest.passed && (
              <div className="text-red-600">
                <div>Expected: {debugInfo.cookieTest.expectedValue}</div>
                <div>Got: {debugInfo.cookieTest.actualValue || 'null'}</div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {debugInfo.fallbackStorage && (
        <div className="mt-2 border-t pt-2">
          <strong>Fallback Storage:</strong>
          <div className="ml-2">
            <div><strong>Available:</strong> {debugInfo.fallbackStorage.available ? '✅' : '❌'}</div>
            <div><strong>Needed:</strong> {debugInfo.fallbackStorage.needed ? '✅' : '❌'}</div>
          </div>
        </div>
      )}

      {debugInfo.cookies && (
        <div className="mt-2 border-t pt-2">
          <strong>Cookie Details:</strong>
          <div className="ml-2">
            <div><strong>Consent:</strong> {debugInfo.cookies.consentCookie || 'not set'}</div>
            <div><strong>Analytics:</strong> {debugInfo.cookies.analyticsEnabledCookie || 'not set'}</div>
            <div><strong>Timestamp:</strong> {debugInfo.cookies.timestampCookie || 'not set'}</div>
            <div><strong>Using fallback:</strong> {debugInfo.cookies.isIframe ? '✅' : '❌'}</div>
            <div><strong>Raw:</strong> {debugInfo.cookies.rawCookies || 'empty'}</div>
          </div>
        </div>
      )}
      
      {debugInfo.debugLog && debugInfo.debugLog.length > 0 && (
        <div className="mt-2 border-t pt-2">
          <strong>Recent logs:</strong>
          <div className="max-h-20 overflow-y-auto text-xs">
            {debugInfo.debugLog.slice(-3).map((log: any, index: number) => (
              <div key={index} className="border-t pt-1 mt-1">
                <div className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</div>
                <div>{log.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {debugInfo.error && (
        <div className="mt-2 border-t pt-2 text-red-600">
          <strong>Error:</strong> {debugInfo.error}
        </div>
      )}
      
      {debugInfo.timestamp && (
        <div className="mt-2 text-gray-400 text-xs">
          Last updated: {new Date(debugInfo.timestamp).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default DebugInfoDisplay;
